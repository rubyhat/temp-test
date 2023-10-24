import { Reducer } from 'redux';

import {
    BOOKING_GEOLOCATION_RESET_STATE,
    BOOKING_NEAREST_STOP_BY_GEOLOCATION_ATTEMPT,
    BookingGeolocationActionTypes,
    BookingGeolocationState,
} from './types';

const initialState: BookingGeolocationState = {
    nearestStopByGeolocationAttempt: false,
};

export const bookingGeolocationReducer: Reducer<
    BookingGeolocationState,
    BookingGeolocationActionTypes
> = (state = initialState, action): BookingGeolocationState => {
    switch (action.type) {
        case BOOKING_NEAREST_STOP_BY_GEOLOCATION_ATTEMPT: {
            return {
                ...state,
                nearestStopByGeolocationAttempt: true,
            };
        }
        case BOOKING_GEOLOCATION_RESET_STATE: {
            return {
                ...initialState,
            };
        }
        default:
            return state;
    }
};
