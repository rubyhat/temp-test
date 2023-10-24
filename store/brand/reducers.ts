import { Reducer } from 'redux';

import {
    BRAND_SET_PARTNER,
    BrandActionTypes,
    BrandState,
    SET_IN_WEBVIEW,
} from './types';

const initialState: BrandState = {
    brandName: 'atlas',
    partners: [],
    partner: null,
    inWebView: null,
};

export const brandReducer: Reducer<BrandState, BrandActionTypes> = (
    state = initialState,
    action
): BrandState => {
    switch (action.type) {
        case BRAND_SET_PARTNER: {
            const { brandName, partners, partner } = action.payload;

            return {
                ...state,
                brandName,
                partners,
                partner,
            };
        }
        case SET_IN_WEBVIEW: {
            return {
                ...state,
                inWebView: action.payload,
            };
        }
        default:
            return state;
    }
};
