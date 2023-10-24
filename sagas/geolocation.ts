import { SagaIterator } from 'redux-saga';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import * as Sentry from '@sentry/browser';
import { Severity } from '@sentry/browser';

import {
    geolocationError,
    geolocationSuccess,
    REQUEST_GEOLOCATION,
    RequestGeolocationAction,
} from 'store/geolocation';
import { getCurrentPosition } from 'utils/geolocation';

function* requestGeolocationTask(
    action: RequestGeolocationAction
): SagaIterator {
    if (!process.browser) return; // skip server

    const { options } = action.payload;

    try {
        const position = yield call(getCurrentPosition, options);
        yield put(geolocationSuccess(position));
    } catch (err) {
        yield put(geolocationError(err));
        Sentry.captureMessage(err.message, Severity.Debug);
    }
}

export function* watchGeolocation(): SagaIterator {
    yield all([takeLatest(REQUEST_GEOLOCATION, requestGeolocationTask)]);
}
