import { GeolocationPositionError } from './types';

/**
 * Из GeolocationPosition в обычный объект.
 * Чтобы можно было хранить в Redux.
 * @param position
 */
export function geolocationPositionToObject(position: Position): Position {
    return {
        coords: {
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            altitudeAccuracy: position.coords.altitudeAccuracy,
            heading: position.coords.heading,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            speed: position.coords.speed,
        },
        timestamp: position.timestamp,
    };
}

/**
 * Из PositionError в обычный GeolocationPositionError.
 * Чтобы можно было хранить в Redux.
 * @param err
 */
export function geolocationPositionErrorToObject(
    err: PositionError
): GeolocationPositionError {
    return {
        code: err.code,
        message: err.message,
    };
}
