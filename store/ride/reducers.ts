import {
    RIDE_ERROR,
    RIDE_FETCHING,
    RIDE_UPDATING,
    RIDE_POLLING,
    RIDE_SUCCESS,
    RIDE_BOOKING_SEATING,
    RIDE_BOOKING_SEATING_POLLING,
    RIDE_BOOKING_SEATING_SUCCESS,
    RideActionTypes,
    RideState,
} from './types';

const initialState: RideState = {
    rideInfo: null,
    bookParams: null,
    status: null,
    error: null,
    pollingCount: 0,
    bookingStatus: RIDE_SUCCESS,
    bookingSeatNumber: null,
    bookingAction: null,
    bookingPollingCount: 0,
};

export const rideReducer = (
    state: RideState = initialState,
    action: RideActionTypes
): RideState => {
    switch (action.type) {
        case RIDE_FETCHING: {
            return {
                ...state,
                rideInfo: null,
                bookParams: null,
                status: RIDE_FETCHING,
                error: null,
            };
        }
        case RIDE_UPDATING: {
            return {
                ...state,
                status: RIDE_UPDATING,
                error: null,
            };
        }
        case RIDE_POLLING: {
            return {
                ...state,
                status: RIDE_POLLING,
                pollingCount: state.pollingCount + 1,
            };
        }
        case RIDE_SUCCESS: {
            const { rideInfo, bookParams } = action.payload;

            return {
                ...state,
                status: RIDE_SUCCESS,
                rideInfo,
                bookParams,
                pollingCount: 0,
            };
        }
        case RIDE_ERROR: {
            return {
                ...state,
                status: RIDE_ERROR,
                error: action.payload,
                pollingCount: 0,
            };
        }
        case RIDE_BOOKING_SEATING: {
            const { bookingSeatNumber, bookingAction } = action.payload;

            return {
                ...state,
                bookingStatus: RIDE_FETCHING,
                bookingSeatNumber,
                bookingAction,
            };
        }

        case RIDE_BOOKING_SEATING_POLLING: {
            return {
                ...state,
                bookingStatus: RIDE_POLLING,
                bookingPollingCount: state.bookingPollingCount + 1,
            };
        }

        case RIDE_BOOKING_SEATING_SUCCESS: {
            return {
                ...state,
                bookingStatus: RIDE_SUCCESS,
                bookingSeatNumber: null,
                bookingAction: null,
                bookingPollingCount: 0,
            };
        }
        default:
            return state;
    }
};
