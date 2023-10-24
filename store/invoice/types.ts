import { InvoiceDto } from 'swagger/client';

export type InvoiceState = {
    status: InvoiceStatuses | null;
    invoice: InvoiceDto | null;
    error: Error | null;
};

export type InvoiceStatuses =
    | typeof INVOICE_FETCHING
    | typeof INVOICE_SUCCESS
    | typeof INVOICE_ERROR;
export const INVOICE_FETCHING = 'INVOICE_FETCHING';
export const INVOICE_SUCCESS = 'INVOICE_SUCCESS';
export const INVOICE_ERROR = 'INVOICE_ERROR';

export const INVOICE_RESET = 'INVOICE_RESET';

export type InvoiceFetchingAction = {
    type: typeof INVOICE_FETCHING;
    payload: {
        orderId: string;
    };
};

export type InvoiceSuccessAction = {
    type: typeof INVOICE_SUCCESS;
    payload: InvoiceDto;
};

export type InvoiceErrorAction = {
    type: typeof INVOICE_ERROR;
    payload: Error;
};

export type InvoiceResetAction = {
    type: typeof INVOICE_RESET;
};

export type InvoiceActionTypes =
    | InvoiceFetchingAction
    | InvoiceSuccessAction
    | InvoiceErrorAction
    | InvoiceResetAction;
