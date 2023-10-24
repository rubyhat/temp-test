import { Reducer } from 'redux';

import {
    PARTNERS_ERROR,
    PARTNERS_FETCHING,
    PARTNERS_SUCCESS,
    PartnersActionTypes,
    PartnersState,
} from './types';

const initialState: PartnersState = {
    partners: [],
    status: null,
    error: null,
};

export const partnersReducer: Reducer<PartnersState, PartnersActionTypes> = (
    state = initialState,
    action
) => {
    switch (action.type) {
        case PARTNERS_FETCHING: {
            return {
                ...state,
                status: PARTNERS_FETCHING,
                error: null,
            };
        }
        case PARTNERS_SUCCESS: {
            return {
                ...state,
                status: PARTNERS_SUCCESS,
                partners: action.payload,
            };
        }
        case PARTNERS_ERROR: {
            return {
                ...state,
                status: PARTNERS_ERROR,
                error: action.payload,
            };
        }
        default:
            return state;
    }
};
