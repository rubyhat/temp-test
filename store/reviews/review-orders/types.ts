import { OrderDto, ReviewSettingsDto } from 'swagger/client';

export enum ReviewOrdersStatus {
    IDLE = 'IDLE',
    FETCHING = 'FETCHING',
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR',
}

export type ReviewOrdersState = {
    orders: OrderDto[];
    reviewSettings: ReviewSettingsDto | null;
    status: ReviewOrdersStatus;
    err: Error | null;
};

export const FETCH_REVIEW_ORDERS = 'review-orders/fetchReviewOrders';
export const REVIEW_ORDERS_SUCCESS = 'review-orders/reviewOrdersSuccess';
export const REVIEW_ORDERS_ERROR = 'review-orders/reviewOrdersError';
export const RESET_REVIEW_ORDERS_STATE = 'review-orders/resetReviewOrdersState';

export type FetchReviewOrders = {
    type: typeof FETCH_REVIEW_ORDERS;
};

export type ReviewOrdersSuccess = {
    type: typeof REVIEW_ORDERS_SUCCESS;
    payload: {
        orders: OrderDto[];
        reviewSettings: ReviewSettingsDto;
    };
};

export type ReviewOrdersError = {
    type: typeof REVIEW_ORDERS_ERROR;
    payload: Error;
};

export type ResetReviewOrdersState = {
    type: typeof RESET_REVIEW_ORDERS_STATE;
};

export type ReviewOrdersActionTypes =
    | FetchReviewOrders
    | ReviewOrdersSuccess
    | ReviewOrdersError
    | ResetReviewOrdersState;
