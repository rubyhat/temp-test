import {
    FiltersActionTypes,
    FiltersState,
    RESET_FILTERS,
    SET_FILTERS,
    SORTBY_FILTERS,
    UPDATE_DROPOFF_FILTER,
    UPDATE_PICKUP_FILTER,
} from './types';

const initialState: FiltersState = {
    pickupInputValue: '',
    pickupValue: null,
    pickupMapValue: null,
    dropoffInputValue: '',
    dropoffValue: null,
    dropoffMapValue: null,
    departureTime: null,
    sortBy: null,
};

export const filtersReducer = (
    state = initialState,
    action: FiltersActionTypes
): FiltersState => {
    switch (action.type) {
        case SET_FILTERS: {
            return {
                ...state,
                ...action.payload,
            };
        }
        case UPDATE_PICKUP_FILTER: {
            return {
                ...state,
                pickupValue: action.payload,
                pickupMapValue: action.payload,
            };
        }
        case UPDATE_DROPOFF_FILTER: {
            return {
                ...state,
                dropoffValue: action.payload,
                dropoffMapValue: action.payload,
            };
        }
        case SORTBY_FILTERS: {
            return {
                ...state,
                sortBy: action.payload,
            };
        }
        case RESET_FILTERS: {
            return {
                ...initialState,
            };
        }
        default:
            return state;
    }
};
