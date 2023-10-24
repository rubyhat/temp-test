import {
    MILES_ERROR,
    MILES_FETCHING,
    MILES_SUCCESS,
    MilesActionTypes,
    MilesState,
} from './types';

const initialState: MilesState = {
    balance: 0,
    currency: [],
    status: null,
    error: null,
};

export const milesReducer = (
    state: MilesState = initialState,
    action: MilesActionTypes
): MilesState => {
    switch (action.type) {
        case MILES_FETCHING: {
            return {
                ...state,
                status: MILES_FETCHING,
                error: null,
            };
        }
        case MILES_SUCCESS: {
            const { balance, currency } = action.payload;

            return {
                ...state,
                status: MILES_SUCCESS,
                balance,
                currency,
            };
        }
        case MILES_ERROR: {
            return {
                ...state,
                status: MILES_ERROR,
                error: action.payload,
            };
        }
        default:
            return state;
    }
};
