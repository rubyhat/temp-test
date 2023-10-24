import { COUNTRY_CODE_SET, CountryActionTypes, CountryState } from './types';

const initialState: CountryState = {
    country: 'BY',
};

export const countryReducer = (
    state: CountryState = initialState,
    action: CountryActionTypes
): CountryState => {
    switch (action.type) {
        case COUNTRY_CODE_SET: {
            return {
                ...state,
                country: action.payload,
            };
        }
        default:
            return state;
    }
};
