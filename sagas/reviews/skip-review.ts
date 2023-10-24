import { SagaIterator } from 'redux-saga';
import { takeLatest, call, put, all } from 'redux-saga/effects';
import * as Sentry from '@sentry/browser';

import apiClient from 'lib/apiClient';
import {
    reviewSkipped,
    SKIP_REVIEW,
    SkipReview,
    skipReviewError,
} from 'store/reviews/skip-review';
import { isDebugging } from 'utils/debugging/storage';

function* skipReviewAction(action: SkipReview): SagaIterator {
    const { orderId } = action.payload;

    if (isDebugging('review')) {
        yield put(reviewSkipped());

        return;
    }

    try {
        yield call(apiClient.skipReview, orderId);

        yield put(reviewSkipped());
    } catch (err) {
        yield put(skipReviewError(err));
        Sentry.captureException(err);
    }
}

export function* watchSkipReview(): SagaIterator {
    yield all([takeLatest(SKIP_REVIEW, skipReviewAction)]);
}
