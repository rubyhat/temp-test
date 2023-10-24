import { BusLocationDto, PositionDto } from 'swagger/client';

export type BusLocationState = {
    position: PositionDto | null;
    available: boolean;
    willBeAvailableIn: number;
    status: BusLocationStatuses | null;
    error: Error | null;
};

export type BusLocationStatuses =
    | typeof BUS_LOCATION_FETCHING
    | typeof BUS_LOCATION_SUCCESS
    | typeof BUS_LOCATION_ERROR;

export const BUS_LOCATION_FETCHING = 'BUS_LOCATION_FETCHING';
export const BUS_LOCATION_SUCCESS = 'BUS_LOCATION_SUCCESS';
export const BUS_LOCATION_ERROR = 'BUS_LOCATION_ERROR';

export type BusLocationFetchingAction = {
    type: typeof BUS_LOCATION_FETCHING;
    payload: {
        orderId: string;
    };
};

export type BusLocationSuccessAction = {
    type: typeof BUS_LOCATION_SUCCESS;
    payload: BusLocationDto;
};

export type BusLocationErrorAction = {
    type: typeof BUS_LOCATION_ERROR;
    payload: Error;
};

export type BusLocationActionTypes =
    | BusLocationFetchingAction
    | BusLocationSuccessAction
    | BusLocationErrorAction;
