import {
    ORDER_ERROR,
    ORDER_FETCHING,
    ORDER_POLLING,
    ORDER_RESET,
    ORDER_RESET_LOYALTY_INFO,
    ORDER_STATUS_CHANGED_TO_SUCCESS,
    ORDER_SUCCESS,
    OrderActionTypes,
} from './types';
import { OrderDto, OrderDtoStatusEnum } from 'swagger/client';

export const orderFetching = (
    orderId: string,
    validStatuses?: OrderDtoStatusEnum[]
): OrderActionTypes => ({
    type: ORDER_FETCHING,
    payload: {
        orderId,
        validStatuses,
    },
});

export const orderPolling = (): OrderActionTypes => ({
    type: ORDER_POLLING,
});

export const orderSuccess = (payload: OrderDto): OrderActionTypes => ({
    type: ORDER_SUCCESS,
    payload,
});

export const orderStatusChangedToSuccess = (
    order: OrderDto
): OrderActionTypes => ({
    type: ORDER_STATUS_CHANGED_TO_SUCCESS,
    payload: order,
});

export const orderError = (err: Error): OrderActionTypes => ({
    type: ORDER_ERROR,
    payload: err,
});

export const orderReset = (): OrderActionTypes => ({
    type: ORDER_RESET,
});

export const orderResetLoyaltyInfo = (): OrderActionTypes => ({
    type: ORDER_RESET_LOYALTY_INFO,
});
