import { SagaIterator } from 'redux-saga';
import { takeLatest, call, put, all } from 'redux-saga/effects';
import * as Sentry from '@sentry/browser';

import {
    reviewError,
    reviewSubmitted,
    SUBMIT_REVIEW,
    SubmitReview,
} from 'store/reviews/submit-review';
import apiClient from 'lib/apiClient';
import { isDebugging } from 'utils/debugging/storage';

function* submitReviewAction(action: SubmitReview): SagaIterator {
    // При дебагинге притворимся что отправили отзыв
    if (isDebugging('review')) {
        yield put(reviewSubmitted());

        return;
    }

    const { review } = action.payload;

    try {
        yield call(apiClient.submitReview, review);

        yield put(reviewSubmitted());
    } catch (err) {
        yield put(reviewError(err));
        Sentry.captureException(err);
    }
}

export function* watchSubmitReview(): SagaIterator {
    yield all([takeLatest(SUBMIT_REVIEW, submitReviewAction)]);
}
