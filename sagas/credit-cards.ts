import { SagaIterator } from 'redux-saga';
import { takeLatest, call, put, all } from 'redux-saga/effects';
import * as Sentry from '@sentry/browser';

import { cardsError, cardsSuccess } from 'store/credit-cards/actions';
import {
    CARDS_FETCHING,
    CARD_DELETING,
    CardDeletingAction,
} from 'store/credit-cards/types';
import apiClient from 'lib/apiClient';

function* fetchCards(): SagaIterator {
    try {
        const { data: cards } = yield call(apiClient.getCards);

        yield put(cardsSuccess(cards));
    } catch (err) {
        yield put(cardsError(err));
        Sentry.captureException(err);
    }
}

function* deleteCard(action: CardDeletingAction): SagaIterator {
    try {
        const { cardId } = action.payload;
        yield call(apiClient.deleteCard, cardId);
        yield call(fetchCards);
    } catch (err) {
        yield put(cardsError(err));
        Sentry.captureException(err);
    }
}

export function* watchCards(): SagaIterator {
    yield all([
        takeLatest(CARDS_FETCHING, fetchCards),
        takeLatest(CARD_DELETING, deleteCard),
    ]);
}
