import { Reducer } from 'redux';

import {
    SEO_ERROR,
    SEO_FETCHING,
    SEO_RESET,
    SEO_SUCCESS,
    SeoActionTypes,
    SeoState,
} from './types';

const initialState: SeoState = {
    seo: null,
    status: null,
    error: null,
    phones: [],
};

export const seoReducer: Reducer<SeoState, SeoActionTypes> = (
    state = initialState,
    action
): SeoState => {
    switch (action.type) {
        case SEO_FETCHING: {
            return {
                ...state,
                status: SEO_FETCHING,
                error: null,
            };
        }
        case SEO_SUCCESS: {
            return {
                ...state,
                seo: action.payload,
                status: SEO_SUCCESS,
                phones: action.payload.phones,
            };
        }
        case SEO_ERROR: {
            return {
                ...state,
                status: SEO_ERROR,
                error: action.payload,
            };
        }
        case SEO_RESET: {
            return {
                ...initialState,
            };
        }
        default:
            return state;
    }
};
