import {
    FETCH_REVIEW_ORDERS,
    RESET_REVIEW_ORDERS_STATE,
    REVIEW_ORDERS_ERROR,
    REVIEW_ORDERS_SUCCESS,
    ReviewOrdersActionTypes,
} from './types';
import { ListReviewResponseDto } from 'swagger/client';

export const fetchReviewOrders = (): ReviewOrdersActionTypes => ({
    type: FETCH_REVIEW_ORDERS,
});

export const reviewOrdersSuccess = (
    data: ListReviewResponseDto
): ReviewOrdersActionTypes => ({
    type: REVIEW_ORDERS_SUCCESS,
    payload: {
        orders: data.orders,
        reviewSettings: data.reviewSettings,
    },
});

export const reviewOrdersError = (err: Error): ReviewOrdersActionTypes => ({
    type: REVIEW_ORDERS_ERROR,
    payload: err,
});

export const resetReviewOrdersState = (): ReviewOrdersActionTypes => ({
    type: RESET_REVIEW_ORDERS_STATE,
});
