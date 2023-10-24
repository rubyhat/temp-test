import {
    BUS_LOCATION_ERROR,
    BUS_LOCATION_FETCHING,
    BUS_LOCATION_SUCCESS,
    BusLocationActionTypes,
} from './types';
import { BusLocationDto } from 'swagger/client';

export const busLocationFetching = (
    orderId: string
): BusLocationActionTypes => ({
    type: BUS_LOCATION_FETCHING,
    payload: {
        orderId,
    },
});

export const busLocationSuccess = (
    location: BusLocationDto
): BusLocationActionTypes => ({
    type: BUS_LOCATION_SUCCESS,
    payload: location,
});

export const busLocationError = (err: Error): BusLocationActionTypes => ({
    type: BUS_LOCATION_ERROR,
    payload: err,
});
