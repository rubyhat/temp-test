import { SagaIterator } from 'redux-saga';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import * as Sentry from '@sentry/browser';

import apiClient from 'lib/apiClient';
import { ORDERS_FETCHING, ORDERS_REFETCHING } from 'store/orders/types';
import {
    ordersCompleted,
    ordersError,
    ordersFetching,
    ordersSuccess,
    ordersUpdateState,
} from 'store/orders/actions';
import { RootState } from 'store';
import { TICKET_SUCCESS } from 'store/ticket/types';
import {
    CONFIRM_SUCCESS,
    CORDOVA_ACQUIRING_PAYMENT_SUCCESS,
    ORDER_POLLING_SUCCESS,
    RECURR_SUCCESS,
} from 'store/payment/types';

const ordersPerPage = 25;

function* fetchOrders(): SagaIterator {
    try {
        const state: RootState = ((yield select()) as unknown) as RootState;
        const { page, type } = state.orders;
        const nextPage = page + 1;

        const { data: orders } = yield call(
            apiClient.getOrders,
            nextPage,
            ordersPerPage,
            type
        );

        if (orders.length) {
            yield put(ordersSuccess(orders));
        } else {
            yield put(ordersCompleted());
        }
    } catch (err) {
        yield put(ordersError(err));
        Sentry.captureException(err);
    }
}

function* refetchOrders(): SagaIterator {
    yield put(ordersUpdateState({ page: 0, orders: [] }));
    yield put(ordersFetching());
}

export function* watchOrders(): SagaIterator {
    yield all([
        takeLatest(ORDERS_FETCHING, fetchOrders),
        takeLatest(
            [
                ORDER_POLLING_SUCCESS,
                TICKET_SUCCESS,
                CONFIRM_SUCCESS,
                RECURR_SUCCESS,
                CORDOVA_ACQUIRING_PAYMENT_SUCCESS,
                ORDERS_REFETCHING, // @todo проксировать экшоны выше в один
            ],
            refetchOrders
        ),
    ]);
}
