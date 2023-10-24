import { OrderDto, OrderDtoStatusEnum } from 'swagger/client';

export type OrderState = {
    order: OrderDto | null;
    status: OrderStatuses | null;
    error: Error | null;
};

export type OrderStatuses =
    | typeof ORDER_FETCHING
    | typeof ORDER_POLLING
    | typeof ORDER_SUCCESS
    | typeof ORDER_ERROR;

export const ORDER_FETCHING = 'ORDER_FETCHING';
export const ORDER_POLLING = 'ORDER_POLLING';
export const ORDER_SUCCESS = 'ORDER_SUCCESS';
export const ORDER_ERROR = 'ORDER_ERROR';

export const ORDER_STATUS_CHANGED_TO_SUCCESS =
    'ORDER_STATUS_CHANGED_TO_SUCCESS'; // после поллинга booked -> confirmed (для аналитики)

export const ORDER_RESET = 'ORDER_RESET';
export const ORDER_RESET_LOYALTY_INFO = 'ORDER_RESET_LOYALTY_INFO';

export type OrderFetchingAction = {
    type: typeof ORDER_FETCHING;
    payload: {
        orderId: string;
        validStatuses?: OrderDtoStatusEnum[];
    };
};

type OrderPollingAction = {
    type: typeof ORDER_POLLING;
};

export type OrderSuccessAction = {
    type: typeof ORDER_SUCCESS;
    payload: OrderDto;
};

export type OrderStatusChangedToSuccessAction = {
    type: typeof ORDER_STATUS_CHANGED_TO_SUCCESS;
    payload: OrderDto;
};

type OrderErrorAction = {
    type: typeof ORDER_ERROR;
    payload: Error;
};

type OrderReset = {
    type: typeof ORDER_RESET;
};

type OrderResetLoyaltyInfo = {
    type: typeof ORDER_RESET_LOYALTY_INFO;
};

export type OrderActionTypes =
    | OrderFetchingAction
    | OrderPollingAction
    | OrderSuccessAction
    | OrderStatusChangedToSuccessAction
    | OrderErrorAction
    | OrderReset
    | OrderResetLoyaltyInfo;
