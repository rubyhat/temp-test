import { CountryCode } from './country';

export type CurrencySymbol = 'RUB' | 'BYN' | 'PLN' | 'UAH' | 'EUR';

export const currencySymbol: Record<CurrencySymbol, string> = {
    RUB: '₽',
    BYN: 'Br',
    PLN: 'zł',
    UAH: '₴',
    EUR: '€',
};

export const countryCurrency: Record<CountryCode, CurrencySymbol> = {
    RU: 'RUB',
    BY: 'BYN',
    PL: 'PLN',
    UA: 'UAH',
    LT: 'EUR',
    LV: 'EUR',
    DE: 'EUR',
};
