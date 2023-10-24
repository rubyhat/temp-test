import { SagaIterator } from 'redux-saga';
import { all, call, put, delay, takeLatest, cancel } from 'redux-saga/effects';
import * as Sentry from '@sentry/browser';

import apiClient from 'lib/apiClient';
import { ORDER_FETCHING, OrderFetchingAction } from 'store/order/types';
import {
    orderError,
    orderStatusChangedToSuccess,
    orderSuccess,
} from 'store/order/actions';
import { getPollingDelay } from 'utils/polling';
import { hasFailedStatus } from 'utils/order-status';
import { goToOrder } from './util/order';

function* fetchOrder(action: OrderFetchingAction): SagaIterator {
    let pollingCount = 0;
    const { orderId, validStatuses } = action.payload;

    try {
        while (true) {
            const { data: order, status } = yield call(
                apiClient.getOrder,
                orderId
            );

            if (status === 200) {
                if (validStatuses) {
                    // продолжать поллить пока не получим
                    // конкретный статус заказа либо ошибку
                    if (validStatuses.includes(order.status)) {
                        yield put(orderSuccess(order));
                        yield put(orderStatusChangedToSuccess(order)); // для аналитики
                        yield cancel();
                        break;
                    } else if (hasFailedStatus(order.status)) {
                        yield put(orderSuccess(order));
                        yield call(goToOrder, order.id, true);
                        yield cancel();
                        break;
                    }
                }

                yield put(orderSuccess(order));
                yield cancel();
                break;
            }

            yield delay(getPollingDelay(pollingCount));
            pollingCount++;
        }
    } catch (err) {
        yield put(orderError(err));
        Sentry.captureException(err);
    }
}

export function* watchOrder(): SagaIterator {
    yield all([takeLatest(ORDER_FETCHING, fetchOrder)]);
}
