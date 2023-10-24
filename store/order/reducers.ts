import {
    ORDER_ERROR,
    ORDER_FETCHING,
    ORDER_POLLING,
    ORDER_RESET,
    ORDER_RESET_LOYALTY_INFO,
    ORDER_SUCCESS,
    OrderActionTypes,
    OrderState,
} from './types';

const initialState: OrderState = {
    order: null,
    status: null,
    error: null,
};

export const orderReducer = (
    state: OrderState = initialState,
    action: OrderActionTypes
): OrderState => {
    switch (action.type) {
        case ORDER_FETCHING: {
            return {
                ...state,
                order: null,
                status: ORDER_FETCHING,
                error: null,
            };
        }
        case ORDER_POLLING: {
            return {
                ...state,
                status: ORDER_POLLING,
            };
        }
        case ORDER_SUCCESS: {
            const order = action.payload;

            return {
                ...state,
                status: ORDER_SUCCESS,
                order,
            };
        }
        case ORDER_ERROR: {
            return {
                ...state,
                status: ORDER_ERROR,
                error: action.payload,
            };
        }
        case ORDER_RESET: {
            return {
                ...initialState,
            };
        }
        case ORDER_RESET_LOYALTY_INFO: {
            if (state.order) {
                return {
                    ...state,
                    order: {
                        ...state.order,
                        loyaltyInfo: undefined,
                    },
                };
            }

            return state;
        }
        default:
            return state;
    }
};
