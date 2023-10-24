import {
    ORDERS_COMPLETED,
    ORDERS_ERROR,
    ORDERS_FETCHING,
    ORDERS_REFETCHING,
    ORDERS_SUCCESS,
    ORDERS_UPDATE_STATE,
    OrdersActionTypes,
    OrdersState,
} from './types';
import { OrdersResponseDto } from 'swagger/client';

export const ordersFetching = (): OrdersActionTypes => ({
    type: ORDERS_FETCHING,
});

export const ordersSuccess = (
    orders: OrdersResponseDto[]
): OrdersActionTypes => ({
    type: ORDERS_SUCCESS,
    payload: orders,
});

export const ordersError = (err: Error): OrdersActionTypes => ({
    type: ORDERS_ERROR,
    payload: err,
});

export const ordersCompleted = (): OrdersActionTypes => ({
    type: ORDERS_COMPLETED,
});

export const ordersUpdateState = (payload: Partial<OrdersState>) => ({
    type: ORDERS_UPDATE_STATE,
    payload,
});

export const ordersRefetching = () => ({
    type: ORDERS_REFETCHING,
});
