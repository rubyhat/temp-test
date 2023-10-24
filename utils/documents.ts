import { conformToMask, maskArray } from 'react-text-mask';

import { CountryCode } from './country';
import { DocTypesDto } from 'swagger/client';
import { Locale } from 'i18n/utils';

export type Citizenship = {
    country_code: string;
    id: number;
    localized_name: Record<Locale, string>;
};

export function sortCountries(countries: Citizenship[], country: CountryCode) {
    let priorityCountries: CountryCode[] = [country, 'RU', 'BY', 'PL', 'UA'];

    return countries.sort((left, right) => {
        const leftIndex = priorityCountries.findIndex(
            code => code === left.country_code
        );
        const rightIndex = priorityCountries.findIndex(
            code => code === right.country_code
        );

        if (leftIndex > -1 && rightIndex > -1) {
            return leftIndex - rightIndex;
        } else if (leftIndex > -1) {
            return -1;
        } else if (rightIndex > -1) {
            return 1;
        }

        return left.country_code < right.country_code
            ? -1
            : left.country_code > right.country_code
            ? 1
            : 0;
    });
}

export function getCitizenshipByDocumentType(
    docType: string
): CountryCode | '' {
    if (/_ru$/.test(docType)) {
        return 'RU';
    } else if (/_by$/.test(docType)) {
        return 'BY';
    } else if (/_ua$/.test(docType)) {
        return 'UA';
    }

    return '';
}

export const documentTextMask: Record<
    'id_ru' | 'passport_by' | 'passport_ru' | 'birth_certificate_ru' | string,
    maskArray | ((value: string) => maskArray)
> = {
    id_ru: [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/],
    passport_by: [
        /[a-zа-я]/i,
        /[a-zа-я]/i,
        // ' ',
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        /\d/,
    ],
    passport_ru: [/\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/],
    birth_certificate_ru: (input: string) => {
        const romanSymbol = /[IVXLCDM]/i;
        const mask = [
            '-',
            /[а-я]/i,
            /[а-я]/i,
            // ' ',
            /\d/,
            /\d/,
            /\d/,
            /\d/,
            /\d/,
            /\d/,
        ];

        if (/^[IVXLCDM]{1}[а-я-]/i.test(input)) {
            return [romanSymbol, ...mask];
        } else if (/^[IVXLCDM]{2}[а-я-]/i.test(input)) {
            return [romanSymbol, romanSymbol, ...mask];
        }

        return [romanSymbol, romanSymbol, romanSymbol, ...mask];
    },
};

export const documentMask: Record<
    | 'id_ru'
    | 'passport_by'
    | 'passport_ru'
    | 'birth_certificate_ru'
    | 'foreign_passport'
    | 'id_ua'
    | 'military_book_ru'
    | 'passport_su'
    | 'permit_of_residence_ru'
    | 'soldier_id_ru'
    | string,
    RegExp
> = {
    id_ru: /^\d{4}\d{6}$/, // Паспорт РФ
    passport_by: /^[a-z]{2}\d{7}$/i, // Паспорт РБ
    passport_ru: /^\d{2}\d{7}$/, // Загран. паспорт РФ
    birth_certificate_ru: /^[IVX]+[-]?[А-Я]{2}\d{6}$/i, // Свидетельство о рождении РФ
    foreign_passport: /.+/, // Паспорт другого государства
    id_ua: /^\d{9}$/i, // Украинский паспорт
    military_book_ru: /^[А-Я]{2}\d{7}$/i, // Военный билет РФ
    passport_su: /^[IVX]+[А-Я]+\d{6}$/i, // Паспорт СССР
    soldier_id_ru: /^[А-Я]{2}\d{6}$/i, // Удостоверение военнослужащего РФ
    permit_of_residence_ru: /^\d{9}$/i, // Вид на жительство РФ
};

// При автозаполнении документа
// нужно подержать обратное
// преобразование IIIАБ123456 -> III-АБ 123456.
export function normaliseDocNumber(documentRaw: string): string {
    // `birth_certificate_ru` без тире и пробелов
    if (/^[IVXLCDM]{1,3}-?[а-я]{2}\s?\d{6}$/i.test(documentRaw)) {
        const romanSymbol = /[IVXLCDM]/i;
        const mask = [
            '-',
            /[а-я]/i,
            /[а-я]/i,
            ' ',
            /\d/,
            /\d/,
            /\d/,
            /\d/,
            /\d/,
            /\d/,
        ];

        const conformedDocNumber = conformToMask(
            documentRaw,
            value => {
                if (/^[IVXLCDM][а-я]/i.test(value)) {
                    return [romanSymbol, ...mask];
                } else if (/^[IVXLCDM]{2}[а-я]/i.test(value)) {
                    return [romanSymbol, romanSymbol, ...mask];
                } else if (/^[IVXLCDM]{3}[а-я]/i.test(value)) {
                    return [romanSymbol, romanSymbol, romanSymbol, ...mask];
                }

                return [];
            },
            { guide: false }
        );

        return conformedDocNumber.conformedValue;
    }

    return documentRaw;
}

export function sortDocTypesByCountry(
    documents: DocTypesDto[],
    country: CountryCode
) {
    const countryDocumentsOrder: Record<CountryCode, string[]> = {
        RU: ['id_ru', 'passport_ru', 'birth_certificate_ru'],
        BY: ['id_by', 'foreign_passport'],
        PL: [],
        UA: ['id_ua'],
        LT: [],
        LV: [],
        DE: [],
    };
    const documentsOrder: string[] = countryDocumentsOrder[country];

    if (!documentsOrder.length) return documents;

    return documents.sort((left, right) => {
        const leftIndex = documentsOrder.findIndex(code => code === left.code);
        const rightIndex = documentsOrder.findIndex(
            code => code === right.code
        );

        if (leftIndex > -1 && rightIndex > -1) {
            return leftIndex - rightIndex;
        } else if (leftIndex > -1) {
            return -1;
        } else if (rightIndex > -1) {
            return 1;
        }

        return left.code < right.code ? -1 : left.code > right.code ? 1 : 0;
    });
}

export function isFakeDocument(docNumber: string): boolean {
    const docNumberDigitsOnly = docNumber.replace(/[^0-9]/g, '');

    // Документы с одинаковыми числами
    // 000000000
    // 111111111
    // 222222222
    // ...
    const sameDigitPattern = /([0-9])\1{8,}/;

    const incrementingDigitPattern = /123456789/;
    const decrementingDigitPattern = /987654321/;

    return (
        sameDigitPattern.test(docNumberDigitsOnly) ||
        incrementingDigitPattern.test(docNumberDigitsOnly) ||
        decrementingDigitPattern.test(docNumberDigitsOnly)
    );
}
