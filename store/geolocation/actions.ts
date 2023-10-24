import {
    GEOLOCATION_ERROR,
    GEOLOCATION_RESET_STATE,
    GEOLOCATION_SUCCESS,
    GeolocationActionTypes,
    REQUEST_GEOLOCATION,
} from './types';

export const requestGeolocation = (
    options?: PositionOptions
): GeolocationActionTypes => ({
    type: REQUEST_GEOLOCATION,
    payload: {
        options,
    },
});

export const geolocationSuccess = (
    position: Position
): GeolocationActionTypes => ({
    type: GEOLOCATION_SUCCESS,
    payload: {
        position,
    },
});

export const geolocationError = (
    err: PositionError | Error
): GeolocationActionTypes => ({
    type: GEOLOCATION_ERROR,
    payload: err,
});

export const geolocationResetState = (): GeolocationActionTypes => ({
    type: GEOLOCATION_RESET_STATE,
});
