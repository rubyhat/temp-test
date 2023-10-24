import { SagaIterator } from 'redux-saga';
import {
    all,
    call,
    put,
    takeLatest,
    delay,
    cancel,
    select,
    fork,
    take,
} from 'redux-saga/effects';
import * as Sentry from '@sentry/browser';
import Router from 'next/router';
import { AxiosResponse } from 'axios';

import apiClient from 'lib/apiClient';
import { orderError, orderSuccess } from 'store/order/actions';
import {
    CANCEL_CANCELING,
    CONFIRM_LOADING,
    CONFIRM_SUCCESS,
    OrderCancel,
    PAYMENT_INIT,
    PaymentConfirm,
    PaymentInit,
    PaymentRecurr,
    RECURR_LOADING,
    RECURR_SUCCESS,
    UpdateInvoice,
    UPDATE_INVOICE,
    CORDOVA_ACQUIRING_PAYMENT_SUCCESS,
} from 'store/payment/types';
import { RootState } from 'store';
import { InvoiceDto, OrderDtoStatusEnum, RideDto } from 'swagger/client';
import { loyaltyError, loyaltySuccess } from 'store/loyalty/actions';
import { ORDER_SUCCESS, OrderState } from 'store/order/types';
import { milesSuccess } from 'store/miles/actions';
import {
    orderCancelError,
    orderCancelSuccess,
    orderPollingSuccess,
    paymentConfirmError,
    paymentConfirmReset,
    paymentConfirmSuccess,
    paymentInitSuccess,
    paymentRecurrError,
    paymentRecurrReset,
    paymentRecurrSuccess,
    paymentSetLoading,
    paymentSetOnline,
} from 'store/payment/actions';
import { cardsSuccess } from 'store/credit-cards/actions';
import { getAcquiringRedirectURL } from 'utils/acquiring';
import { getPollingDelay } from 'utils/polling';
import { goToOrder } from './util/order';
import { hasFailedStatus } from 'utils/order-status';
import { invoiceSuccess } from 'store/invoice/actions';
import { saveStopToLS } from './util/stops-localstorage';

function* paymentInit(action: PaymentInit): SagaIterator {
    const { orderId } = action.payload;

    try {
        yield fork(fetchOrder, orderId);
        yield take(ORDER_SUCCESS);
        yield put(orderPollingSuccess());

        const { order: orderState }: RootState = yield select();
        const { order } = orderState;
        if (!order) return;

        if (
            order.status === OrderDtoStatusEnum.Confirmed ||
            order.status === OrderDtoStatusEnum.Active
        ) {
            yield call(goToSuccess);
            return;
        } else if (hasFailedStatus(order.status)) {
            yield call(goToOrder, order.id, true);
            return;
        }

        yield call(
            loyaltyCalc,
            orderId,
            order.loyaltyInfo && order.loyaltyInfo.promocode.value
        );

        const { rideInfo } = order;
        const { paymentTypes } = rideInfo as RideDto; // @todo type

        if (paymentTypes.includes('card' as any)) {
            // Использую блокирующий call() вместо fork()
            // потому-что в инвойсе хранится тип эквайринга
            // который нужно передать в fetchCards().
            yield call(fetchInvoice, orderId);
        }

        if (paymentTypes.includes('reccur' as any)) {
            yield fork(fetchCards);
        }

        if (paymentTypes.includes('miles' as any)) {
            // @todo types
            yield fork(fetchMiles);
        }

        yield put(paymentInitSuccess());
    } catch (err) {
        Sentry.captureException(err);
    }
}

function* updateInvoice(action: UpdateInvoice): SagaIterator {
    const { orderId } = action.payload;
    yield fork(fetchInvoice, orderId);
}

function* fetchOrder(orderId: string): SagaIterator {
    let pollingCount = 0;

    try {
        while (true) {
            const { data, status } = yield call(apiClient.getOrder, orderId);

            if (status === 200) {
                yield put(orderSuccess(data));
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

function* loyaltyCalc(orderId: string, promocode: string = ''): SagaIterator {
    try {
        const { data } = yield call(apiClient.loyaltyCalc, orderId, promocode);

        yield put(loyaltySuccess(data));
    } catch (err) {
        yield put(loyaltyError(err));
        Sentry.captureException(err);
    }
}

function* fetchCards(): SagaIterator {
    const state: RootState = ((yield select()) as unknown) as RootState;
    const { invoice } = state.invoice;
    const acquiringType = (invoice && invoice.acquiring) || undefined;

    const { order } = state.order;
    const orderCurrency =
        (order && order.rideInfo && order.rideInfo.currency) || undefined;

    yield put(
        paymentSetLoading({
            savedCardsLoading: true,
        })
    );

    try {
        const { data: cards } = yield call(
            apiClient.getCards,
            acquiringType,
            orderCurrency
        );

        yield put(cardsSuccess(cards));
        yield put(
            paymentSetOnline({
                recurrPaymentOnline: true,
            })
        );
    } catch (err) {
        Sentry.captureException(err);
    } finally {
        yield put(
            paymentSetLoading({
                savedCardsLoading: false,
            })
        );
    }
}

function* fetchInvoice(orderId: string): SagaIterator {
    yield put(
        paymentSetLoading({
            invoiceLoading: true,
        })
    );

    try {
        const acquiringRedirectURL = getAcquiringRedirectURL(orderId);
        const { data }: AxiosResponse<InvoiceDto> = yield call(
            apiClient.createInvoice,
            orderId,
            acquiringRedirectURL
        );

        yield put(invoiceSuccess(data));
        yield put(
            paymentSetOnline({
                cardPaymentOnline: true,
            })
        );
    } catch (err) {
        yield put(
            paymentSetOnline({
                cardPaymentOnline: false,
            })
        );
        Sentry.captureException(err);
    } finally {
        yield put(
            paymentSetLoading({
                invoiceLoading: false,
            })
        );
    }
}

function* fetchMiles(): SagaIterator {
    yield put(
        paymentSetLoading({
            milesBalanceLoading: true,
        })
    );

    try {
        const { data } = yield call(apiClient.getMilesBalance);

        yield put(milesSuccess(data));
        yield put(
            paymentSetOnline({
                milesPaymentOnline: true,
            })
        );
    } catch (err) {
        Sentry.captureException(err);
    } finally {
        yield put(
            paymentSetLoading({
                milesBalanceLoading: false,
            })
        );
    }
}

function* confirmOrder(action: PaymentConfirm): SagaIterator {
    try {
        const { orderId, paymentType } = action.payload;

        yield call(apiClient.confirmOrder, orderId, paymentType);
        yield put(paymentConfirmSuccess());
    } catch (err) {
        yield put(paymentConfirmError());
        Sentry.captureException(err);
    } finally {
        yield delay(2500);
        yield put(paymentConfirmReset());
    }
}

function* payRecurr(action: PaymentRecurr): SagaIterator {
    try {
        const { orderId, cardId } = action.payload;

        yield call(apiClient.payRecurrent, orderId, cardId);
        yield put(paymentRecurrSuccess());
    } catch (err) {
        yield put(paymentRecurrError());
        Sentry.captureException(err);
    } finally {
        yield delay(2500);
        yield put(paymentRecurrReset());
    }
}

function* cancelOrder(action: OrderCancel): SagaIterator {
    const { orderId } = action.payload;

    try {
        yield call(apiClient.cancelBooking, orderId);
        yield put(orderCancelSuccess());
    } catch (err) {
        yield put(orderCancelError());
        Sentry.captureException(err);
    } finally {
        if (window.history.length > 1) {
            Router.back();
        } else {
            Router.replace('/');
        }
    }
}

function* goToSuccess(): SagaIterator {
    const state: RootState = ((yield select()) as unknown) as RootState;
    const { order } = state.order;
    if (!order) return;

    if (process.env.CORDOVA) {
        Router.replace({
            pathname: '/success',
            query: { id: order.id },
        });
    } else {
        Router.replace('/success/[id]', `/success/${order.id}`);
    }
}

function* saveBookingStopsToLS(): SagaIterator {
    const { order }: OrderState = yield select(rootState => rootState.order);
    if (!order) return;
    const { pickupStop, dischargeStop } = order;

    saveStopToLS(pickupStop.id);
    saveStopToLS(dischargeStop.id);
}

export function* watchPayment(): SagaIterator {
    yield all([
        takeLatest(PAYMENT_INIT, paymentInit),
        takeLatest(
            [
                CONFIRM_SUCCESS,
                RECURR_SUCCESS,
                CORDOVA_ACQUIRING_PAYMENT_SUCCESS,
            ],
            saveBookingStopsToLS
        ),
        takeLatest(
            [
                CONFIRM_SUCCESS,
                RECURR_SUCCESS,
                CORDOVA_ACQUIRING_PAYMENT_SUCCESS,
            ],
            goToSuccess
        ),
        takeLatest(CONFIRM_LOADING, confirmOrder),
        takeLatest(RECURR_LOADING, payRecurr),
        takeLatest(CANCEL_CANCELING, cancelOrder),
        takeLatest(UPDATE_INVOICE, updateInvoice),
    ]);
}
