import { Reducer } from 'redux';

import {
    INVOICE_ERROR,
    INVOICE_FETCHING,
    INVOICE_RESET,
    INVOICE_SUCCESS,
    InvoiceActionTypes,
    InvoiceState,
} from './types';

const initialState: InvoiceState = {
    invoice: null,
    status: null,
    error: null,
};

export const invoiceReducer: Reducer<InvoiceState, InvoiceActionTypes> = (
    state = initialState,
    action
) => {
    switch (action.type) {
        case INVOICE_FETCHING: {
            return {
                ...state,
                status: INVOICE_FETCHING,
            };
        }
        case INVOICE_SUCCESS: {
            return {
                ...state,
                status: INVOICE_SUCCESS,
                invoice: action.payload,
            };
        }
        case INVOICE_ERROR: {
            return {
                ...state,
                error: action.payload,
            };
        }
        case INVOICE_RESET: {
            return {
                ...initialState,
            };
        }
        default:
            return state;
    }
};
