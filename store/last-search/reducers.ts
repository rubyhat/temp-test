import { Reducer } from 'redux';

import {
    LastSearchActionTypes,
    LastSearchState,
    SAVE_LAST_SEARCH,
} from './types';

const initialState: LastSearchState = {
    lastSearch: null,
};

export const lastSearchReducer: Reducer<
    LastSearchState,
    LastSearchActionTypes
> = (state = initialState, action) => {
    switch (action.type) {
        case SAVE_LAST_SEARCH: {
            return {
                ...state,
                lastSearch: action.payload,
            };
        }
        default:
            return state;
    }
};
