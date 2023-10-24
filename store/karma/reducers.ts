import {
    KARMA_ERROR,
    KARMA_FETCHING,
    KARMA_SUCCESS,
    KarmaActionTypes,
    KarmaState,
} from './types';

const initialState: KarmaState = {
    karma: 0,
    currency: 'RUB',
    limit: 0,
    maxLimit: 0,

    status: null,
    error: null,
};

export const karmaReducer = (
    state: KarmaState = initialState,
    action: KarmaActionTypes
): KarmaState => {
    switch (action.type) {
        case KARMA_FETCHING: {
            return {
                ...state,
                status: KARMA_FETCHING,
                error: null,
            };
        }
        case KARMA_SUCCESS: {
            const { data, currency } = action.payload;
            const { balance, currency: currencyArray } = data;
            const currencyObject = currencyArray.find(
                item => item.code === currency
            );

            return {
                ...state,
                status: KARMA_SUCCESS,
                karma: balance,
                currency,
                limit: (currencyObject && currencyObject['balance']) || 0,
                maxLimit: (currencyObject && currencyObject['limit']) || 0,
            };
        }
        case KARMA_ERROR: {
            return {
                ...state,
                status: KARMA_ERROR,
                error: action.payload,
            };
        }
        default:
            return state;
    }
};
