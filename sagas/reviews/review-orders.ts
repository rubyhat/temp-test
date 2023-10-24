import { SagaIterator } from 'redux-saga';
import { takeLatest, call, put, all } from 'redux-saga/effects';
import * as Sentry from '@sentry/browser';
import { AxiosResponse } from 'axios';

import apiClient from 'lib/apiClient';
import {
    FETCH_REVIEW_ORDERS,
    reviewOrdersError,
    reviewOrdersSuccess,
} from 'store/reviews/review-orders';
import { ListReviewResponseDto } from 'swagger/client';
import { isDebugging } from 'utils/debugging/storage';
import { listReviewResponseDto } from 'utils/debugging/mocks';

function* fetchReviewOrdersAction(): SagaIterator {
    if (isDebugging('review')) {
        yield put(reviewOrdersSuccess(listReviewResponseDto));

        return;
    }

    try {
        const { data }: AxiosResponse<ListReviewResponseDto> = ((yield call(
            apiClient.ordersToReview
        )) as unknown) as AxiosResponse<ListReviewResponseDto>;
        const { orders, reviewSettings } = data;

        yield put(
            reviewOrdersSuccess({
                orders,
                reviewSettings,
            })
        );
    } catch (err) {
        yield put(reviewOrdersError(err as Error));
        Sentry.captureException(err);
    }
}

export function* watchReviewOrders(): SagaIterator {
    yield all([takeLatest(FETCH_REVIEW_ORDERS, fetchReviewOrdersAction)]);
}
