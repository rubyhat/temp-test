import { Reducer } from 'redux';

import {
    GEOLOCATION_ERROR,
    GEOLOCATION_RESET_STATE,
    GEOLOCATION_SUCCESS,
    GeolocationActionTypes,
    GeolocationState,
    GeolocationStatus,
    REQUEST_GEOLOCATION,
} from './types';

const initialState: GeolocationState = {
    position: null,
    status: GeolocationStatus.Idle,
    error: null,
};

export const geolocationReducer: Reducer<
    GeolocationState,
    GeolocationActionTypes
> = (state = initialState, action): GeolocationState => {
    switch (action.type) {
        case REQUEST_GEOLOCATION: {
            return {
                ...state,
                status: GeolocationStatus.Requesting,
            };
        }
        case GEOLOCATION_SUCCESS: {
            const { position } = action.payload;

            return {
                ...state,
                status: GeolocationStatus.Success,
                position,
            };
        }
        case GEOLOCATION_ERROR: {
            return {
                ...state,
                status: GeolocationStatus.Error,
                error: action.payload,
            };
        }
        case GEOLOCATION_RESET_STATE: {
            return {
                ...initialState,
            };
        }
        default:
            return state;
    }
};
