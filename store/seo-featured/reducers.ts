import { Reducer } from 'redux';

import {
    SEO_FEATURED_ERROR,
    SEO_FEATURED_FETCHING,
    SEO_FEATURED_SUCCESS,
    SeoFeaturedActionTypes,
    SeoFeaturedState,
} from 'store/seo-featured/types';

const initialState: SeoFeaturedState = {
    searchHistory: [],
    nearbyRoutes: [],
    status: null,
    error: null,
};

export const seoFeaturedReducer: Reducer<
    SeoFeaturedState,
    SeoFeaturedActionTypes
> = (state = initialState, action): SeoFeaturedState => {
    switch (action.type) {
        case SEO_FEATURED_FETCHING: {
            return {
                ...state,
                status: SEO_FEATURED_FETCHING,
                error: null,
            };
        }
        case SEO_FEATURED_SUCCESS: {
            const { userRoutes, nearbyRoutes } = action.payload;

            return {
                ...state,
                searchHistory: userRoutes,
                nearbyRoutes: nearbyRoutes,
                status: SEO_FEATURED_SUCCESS,
            };
        }
        case SEO_FEATURED_ERROR: {
            return {
                ...state,
                status: SEO_FEATURED_ERROR,
                error: action.payload,
            };
        }
        default:
            return state;
    }
};
