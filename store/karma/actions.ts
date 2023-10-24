import {
    KARMA_ERROR,
    KARMA_FETCHING,
    KARMA_SUCCESS,
    KarmaActionTypes,
    KarmaSuccessAction,
} from './types';

export const karmaFetching = (): KarmaActionTypes => ({
    type: KARMA_FETCHING,
});

export const karmaSuccess = (
    payload: KarmaSuccessAction['payload']
): KarmaActionTypes => ({
    type: KARMA_SUCCESS,
    payload,
});

export const karmaError = (err: Error): KarmaActionTypes => ({
    type: KARMA_ERROR,
    payload: err,
});
