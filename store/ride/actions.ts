import {
    RIDE_ERROR,
    RIDE_FETCHING,
    RIDE_UPDATING,
    RIDE_POLLING,
    RIDE_SUCCESS,
    RideActionTypes,
    RIDE_BOOKING_SEATING,
    RIDE_BOOKING_SEATING_POLLING,
    RIDE_BOOKING_SEATING_SUCCESS,
} from './types';
import { BookParamsDto, RideDto } from 'swagger/client';

export const rideFetching = (): RideActionTypes => ({
    type: RIDE_FETCHING,
});

export const rideUpdating = (): RideActionTypes => ({
    type: RIDE_UPDATING,
});

export const ridePolling = (): RideActionTypes => ({
    type: RIDE_POLLING,
});

export const rideSuccess = (
    rideInfo: RideDto,
    bookParams: BookParamsDto
): RideActionTypes => ({
    type: RIDE_SUCCESS,
    payload: {
        rideInfo,
        bookParams,
    },
});

export const rideError = (error: Error): RideActionTypes => ({
    type: RIDE_ERROR,
    payload: error,
});

export const rideBookingSeating = (payload: {
    bookingSeatNumber: number;
    bookingAction: 'selected' | 'unselected';
}): RideActionTypes => ({
    type: RIDE_BOOKING_SEATING,
    payload,
});

export const rideBookingSeatingPolling = (): RideActionTypes => ({
    type: RIDE_BOOKING_SEATING_POLLING,
});

export const rideBookingSeatingSuccess = (): RideActionTypes => ({
    type: RIDE_BOOKING_SEATING_SUCCESS,
});
