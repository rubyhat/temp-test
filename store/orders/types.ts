import { OrdersResponseDto } from 'swagger/client';

export type OrdersType = 'all' | 'upcoming' | 'old';

export type OrdersState = {
    orders: OrdersResponseDto[];
    status: OrderStatuses | null;
    completed: boolean; // если все заказы загружены (при пагинации)
    error: Error | null;
    page: number;
    type: OrdersType;
};

export type OrderStatuses =
    | typeof ORDERS_FETCHING
    | typeof ORDERS_SUCCESS
    | typeof ORDERS_ERROR;

export const ORDERS_FETCHING = 'ORDERS_FETCHING';
export const ORDERS_SUCCESS = 'ORDERS_SUCCESS';
export const ORDERS_ERROR = 'ORDERS_ERROR';
export const ORDERS_COMPLETED = 'ORDERS_COMPLETED';
export const ORDERS_UPDATE_STATE = 'ORDERS_UPDATE_STATE';
export const ORDERS_REFETCHING = 'ORDERS_REFETCHING';

type OrdersFetchingAction = {
    type: typeof ORDERS_FETCHING;
};

type OrdersSuccessAction = {
    type: typeof ORDERS_SUCCESS;
    payload: OrdersResponseDto[];
};

type OrdersErrorAction = {
    type: typeof ORDERS_ERROR;
    payload: Error;
};

type OrdersCompletedAction = {
    type: typeof ORDERS_COMPLETED;
};

type OrdersUpdateState = {
    type: typeof ORDERS_UPDATE_STATE;
    payload: Partial<OrdersState>;
};

type OrdersRefetchingAction = {
    type: typeof ORDERS_REFETCHING;
};

export type OrdersActionTypes =
    | OrdersFetchingAction
    | OrdersSuccessAction
    | OrdersErrorAction
    | OrdersCompletedAction
    | OrdersUpdateState
    | OrdersRefetchingAction;
