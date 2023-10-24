import {
    RESET_SKIP_REVIEW_STATE,
    REVIEW_SKIPPED,
    SKIP_REVIEW,
    SKIP_REVIEW_ERROR,
    SkipReviewActionTypes,
} from './types';

export const skipReview = (orderId: string): SkipReviewActionTypes => ({
    type: SKIP_REVIEW,
    payload: {
        orderId,
    },
});

export const reviewSkipped = (): SkipReviewActionTypes => ({
    type: REVIEW_SKIPPED,
});

export const skipReviewError = (err: Error): SkipReviewActionTypes => ({
    type: SKIP_REVIEW_ERROR,
    payload: err,
});

export const resetSkipReviewState = (): SkipReviewActionTypes => ({
    type: RESET_SKIP_REVIEW_STATE,
});
