import {
    MILES_ERROR,
    MILES_FETCHING,
    MILES_SUCCESS,
    MilesActionTypes,
} from './types';
import { MilesBalanceDto } from 'swagger/client';

export const milesFetching = (): MilesActionTypes => ({
    type: MILES_FETCHING,
});

export const milesSuccess = (payload: MilesBalanceDto): MilesActionTypes => ({
    type: MILES_SUCCESS,
    payload,
});

export const milesError = (err: Error): MilesActionTypes => ({
    type: MILES_ERROR,
    payload: err,
});
