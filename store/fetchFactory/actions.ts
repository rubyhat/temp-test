import {
    FETCH_ERROR,
    FETCH_FETCHING,
    FETCH_SUCCESS,
    FetchActionTypes,
} from './types';

export const fetchFetching = (name: string): FetchActionTypes => ({
    name,
    type: FETCH_FETCHING,
});

export const fetchSuccess = <D>(
    name: string,
    payload: {
        data: D;
        userInput: string;
    }
): FetchActionTypes<D> => ({
    name,
    type: FETCH_SUCCESS,
    payload,
});

export const fetchError = (name: string, err: Error): FetchActionTypes => ({
    name,
    type: FETCH_ERROR,
    payload: err,
});
