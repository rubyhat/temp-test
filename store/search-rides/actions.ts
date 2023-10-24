import {
    ERROR_RIDES,
    FETCHING_RIDES,
    POLLING_RIDES,
    SearchRidesActionTypes,
    SET_CONTINUE_POLLING_RIDES,
    SUCCESS_RIDES,
    FETCHING_RIDES_BROWSER,
    DEBUG_NEAR_DAY_WITH_RIDES,
} from './types';
import { SearchResultDto } from 'swagger/client';

export const fetchingRides = (
    withScrolling: boolean = false,
    withDateInQuery: boolean = false
): SearchRidesActionTypes => ({
    type: FETCHING_RIDES,
    payload: { withScrolling, withDateInQuery },
});

export const pollingRides = (): SearchRidesActionTypes => ({
    type: POLLING_RIDES,
});

export const successRides = (
    data: SearchResultDto
): SearchRidesActionTypes => ({
    type: SUCCESS_RIDES,
    payload: data,
});

export const errorRides = (error: Error): SearchRidesActionTypes => ({
    type: ERROR_RIDES,
    payload: error,
});

export const continuePollingOnClient = (): SearchRidesActionTypes => ({
    type: SET_CONTINUE_POLLING_RIDES,
});

export const fetchingRidesBrowser = (): SearchRidesActionTypes => ({
    type: FETCHING_RIDES_BROWSER,
});

export const debugNearDayWithRides = (
    payload: any
): SearchRidesActionTypes => ({
    type: DEBUG_NEAR_DAY_WITH_RIDES,
    payload,
});
