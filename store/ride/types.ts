import { BookParamsDto, RideDto } from 'swagger/client';

export type RideState = {
    rideInfo: RideDto | null;
    bookParams: BookParamsDto | null;
    status: RideStatuses | null;
    error: Error | null;
    pollingCount: number;
    bookingStatus: RideStatuses | null;
    bookingSeatNumber: number | null;
    bookingAction: 'selected' | 'unselected' | null;
    bookingPollingCount: number;
};

export type RideStatuses =
    | typeof RIDE_FETCHING
    | typeof RIDE_UPDATING
    | typeof RIDE_POLLING
    | typeof RIDE_SUCCESS
    | typeof RIDE_ERROR;

export const RIDE_FETCHING = 'RIDE_FETCHING';
export const RIDE_UPDATING = 'RIDE_UPDATING';
export const RIDE_POLLING = 'RIDE_POLLING';
export const RIDE_SUCCESS = 'RIDE_SUCCESS';
export const RIDE_ERROR = 'RIDE_ERROR';
export const RIDE_BOOKING_SEATING = 'RIDE_BOOKING_SEATING';
export const RIDE_BOOKING_SEATING_POLLING = 'RIDE_BOOKING_SEATING_POLLING';
export const RIDE_BOOKING_SEATING_SUCCESS = 'RIDE_BOOKING_SEATING_SUCCESS';

type RideUpdatingAction = {
    type: typeof RIDE_UPDATING;
};

type RideFetchingAction = {
    type: typeof RIDE_FETCHING;
};

type RidePollingAction = {
    type: typeof RIDE_POLLING;
};

type RideSuccessAction = {
    type: typeof RIDE_SUCCESS;
    payload: {
        rideInfo: RideDto;
        bookParams: BookParamsDto;
    };
};

type RideErrorAction = {
    type: typeof RIDE_ERROR;
    payload: Error;
};

type RideBookingSeatingAction = {
    type: typeof RIDE_BOOKING_SEATING;
    payload: {
        bookingSeatNumber: number;
        bookingAction: 'selected' | 'unselected';
    };
};

type RideBookingSeatingPollingAction = {
    type: typeof RIDE_BOOKING_SEATING_POLLING;
};

type RideBookingSeatingSuccessAction = {
    type: typeof RIDE_BOOKING_SEATING_SUCCESS;
};

export type RideActionTypes =
    | RideFetchingAction
    | RideUpdatingAction
    | RidePollingAction
    | RideSuccessAction
    | RideErrorAction
    | RideBookingSeatingAction
    | RideBookingSeatingPollingAction
    | RideBookingSeatingSuccessAction;
