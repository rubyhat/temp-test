import {
    BUS_LOCATION_ERROR,
    BUS_LOCATION_FETCHING,
    BUS_LOCATION_SUCCESS,
    BusLocationActionTypes,
    BusLocationState,
} from './types';

const initialState: BusLocationState = {
    available: false,
    willBeAvailableIn: 0,
    position: null,
    status: null,
    error: null,
};

export const busLocationReducer = (
    state: BusLocationState = initialState,
    action: BusLocationActionTypes
): BusLocationState => {
    switch (action.type) {
        case BUS_LOCATION_FETCHING: {
            return {
                ...state,
                status: BUS_LOCATION_FETCHING,
            };
        }
        case BUS_LOCATION_SUCCESS: {
            const {
                available = false,
                willBeAvailableIn = 0,
                position = null,
            } = action.payload;

            return {
                ...state,
                status: BUS_LOCATION_SUCCESS,
                available,
                willBeAvailableIn,
                position,
            };
        }
        case BUS_LOCATION_ERROR: {
            return {
                ...state,
                status: BUS_LOCATION_ERROR,
                error: action.payload,
            };
        }
        default:
            return state;
    }
};
