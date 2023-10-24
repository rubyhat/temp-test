import { SagaIterator } from 'redux-saga';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import * as Sentry from '@sentry/browser';

import { LOYALTY_FETCHING, LoyaltyFetchingAction } from 'store/loyalty/types';
import { loyaltyError, loyaltySuccess } from 'store/loyalty/actions';
import apiClient from 'lib/apiClient';
import { updateInvoice } from 'store/payment/actions';

function* loyaltyCalc(action: LoyaltyFetchingAction): SagaIterator {
    try {
        const { orderId, promocode } = action.payload;
        const { data } = yield call(apiClient.loyaltyCalc, orderId, promocode);
        yield put(updateInvoice(orderId));
        yield put(loyaltySuccess(data));
    } catch (err) {
        yield put(loyaltyError(err));
        Sentry.captureException(err);
    }
}

export function* watchLoyalty(): SagaIterator {
    yield all([takeLatest(LOYALTY_FETCHING, loyaltyCalc)]);
}
