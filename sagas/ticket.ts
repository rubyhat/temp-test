import { SagaIterator } from 'redux-saga';
import { takeLatest, call, put, all, delay } from 'redux-saga/effects';
import * as Sentry from '@sentry/browser';

import { TICKET_CANCEL, TicketFetchingAction } from 'store/ticket/types';
import { ticketError, ticketReset, ticketSuccess } from 'store/ticket/actions';
import apiClient from 'lib/apiClient';

function* cancelTicket(action: TicketFetchingAction): SagaIterator {
    try {
        const { ticketId } = action.payload;
        yield call(apiClient.cancelAndRefund, ticketId);
        yield put(ticketSuccess());
    } catch (err) {
        yield put(ticketError(err));
        Sentry.captureException(err);
    } finally {
        yield delay(2500);
        yield put(ticketReset());
    }
}

export function* watchTicket(): SagaIterator {
    yield all([takeLatest(TICKET_CANCEL, cancelTicket)]);
}
