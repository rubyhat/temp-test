import { SagaIterator } from 'redux-saga';
import { takeLatest, call, put, all } from 'redux-saga/effects';
import * as Sentry from '@sentry/browser';

import apiClient from 'lib/apiClient';
import { PARTNERS_FETCHING } from 'store/partners/types';
import { partnersError, partnersSuccess } from 'store/partners/actions';

export function* fetchPartners(): SagaIterator {
    try {
        const { data: partners } = yield call(apiClient.getPartners);

        yield put(partnersSuccess(partners));
    } catch (err) {
        yield put(partnersError(err));
        Sentry.captureException(err);
    }
}

export function* watchPartners(): SagaIterator {
    yield all([takeLatest(PARTNERS_FETCHING, fetchPartners)]);
}
