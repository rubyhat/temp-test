import { TFunction } from 'i18next';
import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';
import { BookField } from '../components/NewPassenger';
import { PersonalDataDto } from 'swagger/client';

export function formatPassengerName(
    lastName: string,
    firstName: string,
    middleName: string,
    bookFields: BookField[] = []
) {
    if (bookFields.includes('patronymic')) {
        return `${lastName} ${firstName} ${middleName}`.trim();
    } else {
        return `${lastName} ${firstName}`.trim();
    }
}

export function formatPassengerNameByDocument(document: PersonalDataDto) {
    const { name, surname, patronymic = '' } = document;

    return `${name} ${surname} ${patronymic || ''}`.trim();
}

export function formatPassengerData(
    t: TFunction,
    genderCode: string,
    birthDate: string,
    docNumber: string,
    bookFields: BookField[] = []
) {
    let data: string[] = [];

    if (genderCode && bookFields.includes('gender')) {
        data.push(t(`booking:genderShort${upperFirst(genderCode)}`));
    }

    if (birthDate && bookFields.includes('birthDate')) {
        data.push(birthDate);
    }

    if (docNumber && bookFields.includes('document')) {
        data.push(`${t('booking:passport')} ${docNumber}`);
    }

    return data.join(', ');
}

export function formatPassengerDataByDocument(
    t: TFunction,
    document: PersonalDataDto
) {
    const { docNum, docType, gender, birthday } = document;
    const docTypeI18n = t(
        `booking:docTypeName${upperFirst(camelCase(docType))}`
    );
    let data: string[] = [];

    if (docNum && docType) {
        return `${docTypeI18n} · ${docNum}`;
    }

    if (gender) {
        data.push(t(`booking:genderShort${upperFirst(gender)}`));
    }

    if (birthday) {
        data.push(birthday);
    }

    return data.join(',');
}
