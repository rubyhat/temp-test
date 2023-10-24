import { SagaIterator } from 'redux-saga';
import { all, call, put, takeLatest, select } from 'redux-saga/effects';
import * as Sentry from '@sentry/browser';

import apiClient from 'lib/apiClient';
import { detectCountryByPhone } from 'utils/country';
import { KARMA_FETCHING } from 'store/karma/types';
import { countryCurrency } from 'utils/currency';
import { karmaError, karmaSuccess } from 'store/karma/actions';
import { RootState } from 'store';

function* karmaFetch(): SagaIterator {
    const state: RootState = ((yield select()) as unknown) as RootState;
    const countryByPhone = detectCountryByPhone(state.user.phoneNumber) || 'BY';

    try {
        const { data } = yield call(apiClient.getUserKarma);
        yield put(
            karmaSuccess({
                data,
                currency: countryCurrency[countryByPhone],
            })
        );
    } catch (err) {
        yield put(karmaError(err));
        Sentry.captureException(err);
    }
}

export function* watchKarma(): SagaIterator {
    yield all([takeLatest(KARMA_FETCHING, karmaFetch)]);
}
