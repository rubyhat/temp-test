import { CountryCode } from 'utils/country';
import { COUNTRY_CODE_SET, CountryActionTypes } from './types';

export const countrySetCode = (code: CountryCode): CountryActionTypes => ({
    type: COUNTRY_CODE_SET,
    payload: code,
});
