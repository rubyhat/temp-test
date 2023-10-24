export type GeolocationState = {
    status: GeolocationStatus;
    position: Position | null;
    error: GeolocationPositionError | Error | null;
};

export enum GeolocationStatus {
    Requesting = 'requesting',
    Success = 'success',
    Error = 'error',
    Idle = 'idle',
}

export type GeolocationPositionError = {
    code: number;
    message: string;
};

export const REQUEST_GEOLOCATION = 'geolocation/requestGeolocation';
export const GEOLOCATION_SUCCESS = 'geolocation/geolocationSuccess';
export const GEOLOCATION_ERROR = 'geolocation/geolocationError';

export const GEOLOCATION_RESET_STATE = 'geolocation/geolocationResetState';

export type RequestGeolocationAction = {
    type: typeof REQUEST_GEOLOCATION;
    payload: {
        options?: PositionOptions;
    };
};

export type GeolocationSuccessAction = {
    type: typeof GEOLOCATION_SUCCESS;
    payload: {
        position: Position;
    };
};

export type GeolocationErrorAction = {
    type: typeof GEOLOCATION_ERROR;
    payload: PositionError | Error;
};

export type GeolocationResetAction = {
    type: typeof GEOLOCATION_RESET_STATE;
};

export type GeolocationActionTypes =
    | RequestGeolocationAction
    | GeolocationSuccessAction
    | GeolocationErrorAction
    | GeolocationResetAction;
