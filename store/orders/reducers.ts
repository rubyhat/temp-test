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

const initialState: OrdersState = {
    orders: [],
    status: null,
    error: null,
    page: 0,
    completed: false,
    type: 'upcoming',
};

export const ordersReducer = (
    state: OrdersState = initialState,
    action: OrdersActionTypes
): OrdersState => {
    switch (action.type) {
        case ORDERS_FETCHING: {
            return {
                ...state,
                status: ORDERS_FETCHING,
                error: null,
                completed: false,
            };
        }
        case ORDERS_SUCCESS: {
            const orders = action.payload;

            return {
                ...state,
                status: ORDERS_SUCCESS,
                orders: [...state.orders, ...orders],
                page: state.page + 1,
            };
        }
        case ORDERS_ERROR: {
            return {
                ...state,
                status: ORDERS_ERROR,
                error: action.payload,
            };
        }
        case ORDERS_COMPLETED: {
            return {
                ...state,
                status: ORDERS_SUCCESS,
                completed: true,
            };
        }
        case ORDERS_UPDATE_STATE: {
            return {
                ...state,
                ...action.payload,
            };
        }
        case ORDERS_REFETCHING: {
            return state;
        }
        default:
            return state;
    }
};
