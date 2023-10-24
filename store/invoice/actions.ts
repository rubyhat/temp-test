import {
    INVOICE_ERROR,
    INVOICE_FETCHING,
    INVOICE_RESET,
    INVOICE_SUCCESS,
    InvoiceActionTypes,
} from './types';
import { InvoiceDto } from 'swagger/client';

export const invoiceFetching = (orderId: string): InvoiceActionTypes => ({
    type: INVOICE_FETCHING,
    payload: {
        orderId,
    },
});

export const invoiceSuccess = (invoice: InvoiceDto): InvoiceActionTypes => ({
    type: INVOICE_SUCCESS,
    payload: invoice,
});

export const invoiceError = (err: Error): InvoiceActionTypes => ({
    type: INVOICE_ERROR,
    payload: err,
});

export const invoiceReset = (): InvoiceActionTypes => ({
    type: INVOICE_RESET,
});
