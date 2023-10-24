import { SagaIterator } from 'redux-saga';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import * as Sentry from '@sentry/browser';

import { MILES_FETCHING } from 'store/miles/types';
import { milesError, milesSuccess } from 'store/miles/actions';
import apiClient from 'lib/apiClient';

function* fetchMiles(): SagaIterator {
    try {
        const { data } = yield call(apiClient.getMilesBalance);

        yield put(milesSuccess(data));
    } catch (err) {
        Sentry.captureException(err);
        yield put(milesError(err));
    }
}

export function* watchMiles(): SagaIterator {
    yield all([takeLatest(MILES_FETCHING, fetchMiles)]);
}
