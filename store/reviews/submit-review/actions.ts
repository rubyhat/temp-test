import {
    RESET_SUBMIT_REVIEW_STATE,
    REVIEW_ERROR,
    REVIEW_SUBMITTED,
    SUBMIT_REVIEW,
    SubmitReviewActionTypes,
} from './types';
import { CreateReviewBodyDto, OrderDto } from 'swagger/client';

export const submitReview = (
    review: CreateReviewBodyDto,
    order: OrderDto
): SubmitReviewActionTypes => ({
    type: SUBMIT_REVIEW,
    payload: {
        review,
        order,
    },
});

export const reviewSubmitted = (): SubmitReviewActionTypes => ({
    type: REVIEW_SUBMITTED,
});

export const reviewError = (err: Error): SubmitReviewActionTypes => ({
    type: REVIEW_ERROR,
    payload: err,
});

export const resetSubmitReviewState = (): SubmitReviewActionTypes => ({
    type: RESET_SUBMIT_REVIEW_STATE,
});
