import { Reducer } from 'redux';

import {
    SEO_CITY_ERROR,
    SEO_CITY_FETCHING,
    SEO_CITY_SUCCESS,
    SeoCityActionTypes,
    SeoCityState,
} from 'store/seo-city/types';
import { SeoDto } from 'swagger/client';

const initialState: SeoCityState = {
    city: '',
    destinations: [],
    status: null,
    error: null,
};

export const seoCityReducer: Reducer<SeoCityState, SeoCityActionTypes> = (
    state = initialState,
    action
): SeoCityState => {
    switch (action.type) {
        case SEO_CITY_FETCHING: {
            const { city } = action.payload;

            return {
                ...state,
                status: SEO_CITY_FETCHING,
                city,
                error: null,
            };
        }
        case SEO_CITY_SUCCESS: {
            return {
                ...state,
                destinations: sortDestinationsByName(action.payload),
                status: SEO_CITY_SUCCESS,
            };
        }
        case SEO_CITY_ERROR: {
            return {
                ...state,
                status: SEO_CITY_ERROR,
                error: action.payload,
            };
        }
        default:
            return state;
    }
};

/**
 * Отсортирует по городу назначения в алфавитном порядке.
 * @param destinations
 */
function sortDestinationsByName(destinations: SeoDto[]) {
    return destinations.sort((left, right) => {
        if (left.to.name < right.to.name) {
            return -1;
        }

        if (left.to.name > right.to.name) {
            return 1;
        }

        return 0;
    });
}
