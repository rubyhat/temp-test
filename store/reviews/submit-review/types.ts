import { CreateReviewBodyDto, OrderDto } from 'swagger/client';

export enum SubmitReviewStatus {
    IDLE = 'IDLE',
    SUBMITTING = 'SUBMITTING',
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR',
}

export type SubmitReviewState = {
    status: SubmitReviewStatus;
    err: Error | null;
};

export const SUBMIT_REVIEW = 'submit-review/submitReview';
export const REVIEW_SUBMITTED = 'submit-review/reviewSubmitted';
export const REVIEW_ERROR = 'submit-review/reviewError';
export const RESET_SUBMIT_REVIEW_STATE = 'submit-review/resetSubmitReviewState';

export type SubmitReview = {
    type: typeof SUBMIT_REVIEW;
    payload: {
        review: CreateReviewBodyDto;
        order: OrderDto;
    };
};

export type ReviewSubmitted = {
    type: typeof REVIEW_SUBMITTED;
};

export type ReviewError = {
    type: typeof REVIEW_ERROR;
    payload: Error;
};

export type ResetSubmitReviewState = {
    type: typeof RESET_SUBMIT_REVIEW_STATE;
};

export type SubmitReviewActionTypes =
    | SubmitReview
    | ReviewSubmitted
    | ReviewError
    | ResetSubmitReviewState;
