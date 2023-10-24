import { IncomingMessage } from 'http';

import apiClient from 'lib/apiClient';

export type CountryCode = 'RU' | 'BY' | 'PL' | 'UA' | 'LT' | 'LV' | 'DE';
const countriesWhiteList = ['RU', 'BY', 'PL', 'UA', 'LT', 'LV', 'DE'];
const defaultCountry: CountryCode = 'BY';
export const countryCodes: Record<CountryCode, string> = {
    RU: '+7',
    BY: '+375',
    PL: '+48',
    UA: '+380',
    LT: '+370',
    LV: '+371',
    DE: '+49',
};

export function detectCountry(req: IncomingMessage): CountryCode {
    const host = (req.headers['x-real-host'] as string) || req.headers.host;
    const domainCountry = host && detectCountryByUrl(host);
    if (domainCountry) {
        return domainCountry;
    }
    const xAppEngineCountry =
        (req.headers['x-appengine-country'] as string) || '';

    if (countriesWhiteList.includes(xAppEngineCountry)) {
        return xAppEngineCountry as CountryCode;
    }

    const locale = (req.headers['accept-language'] as string) || '';
    return detectCountryByAcceptLanguage(locale);
}

export async function detectCountryBrowser(): Promise<CountryCode> {
    try {
        const { data } = await apiClient.getUserCountry();
        const country = data.country.toUpperCase();
        if (countriesWhiteList.includes(country)) {
            return country as any;
        }
        return defaultCountry;
    } catch (e) {
        console.error(e);
        return defaultCountry;
    }
}

export function detectCountryByUrl(url: string): CountryCode | undefined {
    const parsedUrl = new URL(url.startsWith('http') ? url : `http://${url}`);
    const hostName = parsedUrl.hostname.split('.');
    const tld = hostName[hostName.length - 1].toUpperCase();
    if (countriesWhiteList.includes(tld)) {
        return tld as CountryCode;
    }
}

export function detectCountryByPhone(phone: string) {
    let country: keyof typeof countryCodes | null = null;

    if (Boolean(phone)) {
        const formatPhoneNumber = '+' + phone;
        Object.entries(countryCodes).forEach(([key, value]) => {
            if (formatPhoneNumber.includes(value)) {
                country = key as keyof typeof countryCodes;
            }
        });
    }

    return country;
}

// Source: https://stackoverflow.com/a/48053990
export function detectCountryByAcceptLanguage(
    acceptLanguage: string
): CountryCode {
    let countryCode: string = '';

    // in some cases like "fr" or "hu" the language and the country codes are the same
    if (acceptLanguage.length === 2) {
        countryCode = acceptLanguage.toUpperCase();
    }

    // get "PT" out of "pt-PT"
    else if (acceptLanguage.length === 5) {
        countryCode = acceptLanguage.substring(3, 5);
    }

    // ex: "pt-PT,pt;q=0.9,en;q=0.8,en-GB;q=0.7,de-DE;q=0.6,de;q=0.5,fr-FR;q=0.4,fr;q=0.3,es;q=0.2"
    // gets the first two capital letters that fit into 2-letter ISO country code
    else if (acceptLanguage.length > 5) {
        let substr;
        for (let i = 0; i + 2 < acceptLanguage.length; i++) {
            substr = acceptLanguage.substring(i, i + 2).toUpperCase();
            if (countriesWhiteList.includes(substr)) {
                return substr as CountryCode;
            }
        }
    }

    if (countriesWhiteList.includes(countryCode)) {
        return countryCode as CountryCode;
    }

    return 'BY';
}
