import {
    CANCEL_CANCELING,
    CANCEL_ERROR,
    CANCEL_SUCCESS,
    CONFIRM_ERROR,
    CONFIRM_LOADING,
    CONFIRM_RESET,
    CONFIRM_SUCCESS,
    PAYMENT_INIT,
    PAYMENT_INIT_SUCCESS,
    PAYMENT_SAVE_CREDIT_CARD,
    PAYMENT_SET_LOADING,
    PAYMENT_SET_ONLINE,
    PaymentActionTypes,
    PaymentState,
    RECURR_ERROR,
    RECURR_LOADING,
    RECURR_RESET,
    RECURR_SUCCESS,
} from './types';
import { Reducer } from 'redux';

const initialState: PaymentState = {
    error: null,
    expiresAt: null,
    saveCreditCard: true,

    confirmStatus: null,
    recurrStatus: null,
    cancelStatus: null,

    recurrPaymentOnline: false,
    cardPaymentOnline: false,
    milesPaymentOnline: false,

    savedCardsLoading: false,
    invoiceLoading: false,
    milesBalanceLoading: false,

    paymentInitSuccess: false,
};

export const paymentReducer: Reducer<PaymentState, PaymentActionTypes> = (
    state = initialState,
    action
) => {
    switch (action.type) {
        case PAYMENT_INIT: {
            return {
                ...initialState,
            };
        }
        case PAYMENT_INIT_SUCCESS: {
            return {
                ...state,
                paymentInitSuccess: true,
            };
        }
        case PAYMENT_SET_ONLINE: {
            return {
                ...state,
                ...action.payload,
            };
        }
        case PAYMENT_SET_LOADING: {
            return {
                ...state,
                ...action.payload,
            };
        }
        case PAYMENT_SAVE_CREDIT_CARD: {
            return {
                ...state,
                saveCreditCard: action.payload,
            };
        }

        case CONFIRM_LOADING: {
            return {
                ...state,
                confirmStatus: CONFIRM_LOADING,
            };
        }
        case CONFIRM_SUCCESS: {
            return {
                ...state,
                confirmStatus: CONFIRM_SUCCESS,
            };
        }
        case CONFIRM_ERROR: {
            return {
                ...state,
                confirmStatus: CONFIRM_ERROR,
            };
        }
        case CONFIRM_RESET: {
            return {
                ...state,
                confirmStatus: null,
            };
        }

        case RECURR_LOADING: {
            return {
                ...state,
                recurrStatus: RECURR_LOADING,
            };
        }
        case RECURR_SUCCESS: {
            return {
                ...state,
                recurrStatus: RECURR_SUCCESS,
            };
        }
        case RECURR_ERROR: {
            return {
                ...state,
                recurrStatus: RECURR_ERROR,
            };
        }
        case RECURR_RESET: {
            return {
                ...state,
                recurrStatus: null,
            };
        }

        case CANCEL_CANCELING: {
            return {
                ...state,
                cancelStatus: CANCEL_CANCELING,
            };
        }
        case CANCEL_SUCCESS: {
            return {
                ...state,
                cancelStatus: CANCEL_SUCCESS,
            };
        }
        case CANCEL_ERROR: {
            return {
                ...state,
                cancelStatus: CANCEL_ERROR,
            };
        }
        default:
            return state;
    }
};
