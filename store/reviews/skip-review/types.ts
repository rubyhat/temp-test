export enum SkipReviewStatus {
    IDLE = 'IDLE',
    SKIPPING = 'SKIPPING',
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR',
}

export type SkipReviewState = {
    status: SkipReviewStatus;
    err: Error | null;
};

export const SKIP_REVIEW = 'skip-review/skipReview';
export const REVIEW_SKIPPED = 'skip-review/reviewSkipped';
export const SKIP_REVIEW_ERROR = 'skip-review/skipReviewError';
export const RESET_SKIP_REVIEW_STATE = 'skip-review/resetSkipReviewState';

export type SkipReview = {
    type: typeof SKIP_REVIEW;
    payload: {
        orderId: string;
    };
};

export type ReviewSkipped = {
    type: typeof REVIEW_SKIPPED;
};

export type SkipReviewError = {
    type: typeof SKIP_REVIEW_ERROR;
    payload: Error;
};

export type ResetSkipReviewState = {
    type: typeof RESET_SKIP_REVIEW_STATE;
};

export type SkipReviewActionTypes =
    | SkipReview
    | ReviewSkipped
    | SkipReviewError
    | ResetSkipReviewState;
