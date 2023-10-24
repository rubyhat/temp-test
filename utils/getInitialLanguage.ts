import { IncomingMessage } from 'http';

import { i18n } from 'i18n';
import { Locale, locales, compasBusLocales } from 'i18n/utils';
import { isCordovaBuild, isServer } from './platform';
import { detectCountry, CountryCode } from './country';

const countryLanguages: { [P in CountryCode]: Locale } = {
    RU: 'ru',
    BY: 'ru',
    PL: 'pl',
    UA: 'ru',
    LT: 'lt',
    LV: 'lv',
    DE: 'de',
};

export function detectSaasDefaultLocale(
    req: IncomingMessage,
    country: CountryCode
): Locale {
    const host = (req.headers['x-real-host'] as string) || req.headers.host;

    const isCompass = (host || '').includes('compasbus');

    const languages = isCompass ? compasBusLocales : locales;

    const countryCandidate = country.toLowerCase() as Locale;

    const countryToSelect = isCompass
        ? 'pl'
        : languages.includes(countryCandidate)
        ? countryCandidate
        : 'ru';

    return countryToSelect as Locale;
}

export function getInitialLanguage(req?: IncomingMessage): Locale | null {
    const defaultLanguage: Locale = 'ru';

    // Язык по умолчанию который будет бандлится
    // в HTML файлы Cordov'ы при выполнении getInitialProps.
    if (isCordovaBuild) {
        return defaultLanguage;
    }

    if (isServer) {
        if (req) {
            const country = detectCountry(req);
            const countryLanguage = detectSaasDefaultLocale(req, country);
            return countryLanguage
                ? countryLanguage
                : countryLanguages[country];
        }
        // @todo fallback на куку next-1i8next?
        if (req && (req as any).language) {
            return (req as any).language;
        }
    }

    // Browser or Cordova
    let language = i18n.language && i18n.language.substr(0, 2);
    if (locales.includes(language as any)) {
        return language as Locale;
    }

    return defaultLanguage;
}
