import {
    geolocationPositionErrorToObject,
    geolocationPositionToObject,
} from 'store/geolocation';

// Promise wrapper
export function getCurrentPosition(
    options?: PositionOptions
): Promise<Position> {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            position => {
                resolve(geolocationPositionToObject(position));
            },
            err => {
                reject(geolocationPositionErrorToObject(err));
            },
            options
        );
    });
}
