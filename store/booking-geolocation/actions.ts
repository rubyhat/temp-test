import {
    BOOKING_GEOLOCATION_RESET_STATE,
    BOOKING_NEAREST_STOP_BY_GEOLOCATION_ATTEMPT,
    BookingGeolocationActionTypes,
} from './types';

export const bookingNearestStopByGeolocationAttempt = (): BookingGeolocationActionTypes => ({
    type: BOOKING_NEAREST_STOP_BY_GEOLOCATION_ATTEMPT,
});

export const bookingGeolocationResetState = (): BookingGeolocationActionTypes => ({
    type: BOOKING_GEOLOCATION_RESET_STATE,
});
