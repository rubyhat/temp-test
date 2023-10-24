import { CountryCode } from 'utils/country';

export type CountryState = {
    country: CountryCode;
};

export const COUNTRY_CODE_SET = 'COUNTRY_CODE_SET';

export type CountrySetCode = {
    type: typeof COUNTRY_CODE_SET;
    payload: CountryCode;
};

export type CountryActionTypes = CountrySetCode;
