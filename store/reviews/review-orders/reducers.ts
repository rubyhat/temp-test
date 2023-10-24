import { Reducer } from 'redux';

import {
    FETCH_REVIEW_ORDERS,
    RESET_REVIEW_ORDERS_STATE,
    REVIEW_ORDERS_ERROR,
    REVIEW_ORDERS_SUCCESS,
    ReviewOrdersActionTypes,
    ReviewOrdersState,
    ReviewOrdersStatus,
} from './types';

const initialState: ReviewOrdersState = {
    orders: [],
    reviewSettings: null,
    status: ReviewOrdersStatus.IDLE,
    err: null,
};

export const reviewOrdersReducer: Reducer<
    ReviewOrdersState,
    ReviewOrdersActionTypes
> = (state = initialState, action): ReviewOrdersState => {
    switch (action.type) {
        case FETCH_REVIEW_ORDERS: {
            return {
                ...state,
                status: ReviewOrdersStatus.FETCHING,
            };
        }
        case REVIEW_ORDERS_SUCCESS: {
            const { orders, reviewSettings } = action.payload;

            return {
                ...state,
                status: ReviewOrdersStatus.SUCCESS,
                orders,
                reviewSettings,
            };
        }
        case REVIEW_ORDERS_ERROR: {
            return {
                ...state,
                status: ReviewOrdersStatus.ERROR,
                err: action.payload,
            };
        }
        case RESET_REVIEW_ORDERS_STATE: {
            return {
                ...initialState,
            };
        }
        default:
            return state;
    }
};
