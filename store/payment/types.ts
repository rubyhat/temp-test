import { ConfirmUrlDto, OrderConfirmDtoPaymentTypeEnum } from 'swagger/client';

export type PaymentState = {
    error: Error | null;
    expiresAt: Date | null;
    saveCreditCard: boolean;

    confirmStatus: ConfirmStatuses | null;
    recurrStatus: RecurrStatuses | null;
    cancelStatus: CancelStatuses | null;

    /**
     * Свойства ниже обозначают доступность способов оплаты.
     *
     * Вместо отображения ошибки "Что-то пошло не так"
     * метод оплаты будет задизейблен если не смогли:
     * - создать ивойс,
     * - получить список сохраненных карт
     * - получить баланс миль
     *
     * Ошибки будут логироваться в Sentry.
     */
    recurrPaymentOnline: boolean;
    cardPaymentOnline: boolean;
    milesPaymentOnline: boolean;

    savedCardsLoading: boolean;
    invoiceLoading: boolean;
    milesBalanceLoading: boolean;

    paymentInitSuccess: boolean;
};

type ConfirmStatuses =
    | typeof CONFIRM_LOADING
    | typeof CONFIRM_SUCCESS
    | typeof CONFIRM_ERROR;
export const CONFIRM_LOADING = 'CONFIRM_LOADING';
export const CONFIRM_SUCCESS = 'CONFIRM_SUCCESS';
export const CONFIRM_ERROR = 'CONFIRM_ERROR';
export const CONFIRM_RESET = 'CONFIRM_RESET';

type RecurrStatuses =
    | typeof RECURR_LOADING
    | typeof RECURR_SUCCESS
    | typeof RECURR_ERROR;
export const RECURR_LOADING = 'RECURR_LOADING';
export const RECURR_SUCCESS = 'RECURR_SUCCESS';
export const RECURR_ERROR = 'RECURR_ERROR';
export const RECURR_RESET = 'RECURR_RESET';

export const PAYMENT_INIT = 'PAYMENT_INIT';
export const PAYMENT_INIT_SUCCESS = 'PAYMENT_INIT_SUCCESS';
export const PAYMENT_SET_ONLINE = 'PAYMENT_SET_ONLINE';
export const PAYMENT_SET_LOADING = 'PAYMENT_SET_LOADING';
export const PAYMENT_SAVE_CREDIT_CARD = 'PAYMENT_SAVE_CREDIT_CARD';
export const UPDATE_INVOICE = 'UPDATE_INVOICE';
export const OPEN_ACQUIRING_PAYMENT_PAGE = 'OPEN_ACQUIRING_PAYMENT_PAGE';
export const CORDOVA_ACQUIRING_PAYMENT_SUCCESS =
    'CORDOVA_ACQUIRING_PAYMENT_SUCCESS';

type CancelStatuses =
    | typeof CANCEL_CANCELING
    | typeof CANCEL_SUCCESS
    | typeof CANCEL_ERROR;
export const CANCEL_CANCELING = 'CANCEL_CANCELING';
export const CANCEL_SUCCESS = 'CANCEL_SUCCESS';
export const CANCEL_ERROR = 'CANCEL_ERROR';

export const ORDER_POLLING_SUCCESS = 'ORDER_POLLING_SUCCESS';

export type PaymentInit = {
    type: typeof PAYMENT_INIT;
    payload: {
        orderId: string;
    };
};

export type PaymentInitSuccess = {
    type: typeof PAYMENT_INIT_SUCCESS;
};

export type PaymentSetOnline = {
    type: typeof PAYMENT_SET_ONLINE;
    payload: Partial<
        Pick<
            PaymentState,
            'recurrPaymentOnline' | 'cardPaymentOnline' | 'milesPaymentOnline'
        >
    >;
};

export type PaymentSetLoading = {
    type: typeof PAYMENT_SET_LOADING;
    payload: Partial<
        Pick<
            PaymentState,
            'savedCardsLoading' | 'invoiceLoading' | 'milesBalanceLoading'
        >
    >;
};

export type PaymentSaveCreditCard = {
    type: typeof PAYMENT_SAVE_CREDIT_CARD;
    payload: boolean;
};

export type PaymentConfirm = {
    type: typeof CONFIRM_LOADING;
    payload: {
        orderId: string;
        paymentType: OrderConfirmDtoPaymentTypeEnum;
    };
};

export type PaymentConfirmSuccess = {
    type: typeof CONFIRM_SUCCESS;
};

export type PaymentConfirmError = {
    type: typeof CONFIRM_ERROR;
};

export type PaymentConfirmReset = {
    type: typeof CONFIRM_RESET;
};

export type PaymentRecurr = {
    type: typeof RECURR_LOADING;
    payload: {
        orderId: string;
        cardId: string | number;
    };
};

export type PaymentRecurrSuccess = {
    type: typeof RECURR_SUCCESS;
};

export type PaymentRecurrError = {
    type: typeof RECURR_ERROR;
};

export type PaymentRecurrReset = {
    type: typeof RECURR_RESET;
};

export type OrderCancel = {
    type: typeof CANCEL_CANCELING;
    payload: {
        orderId: string;
    };
};

export type OrderCancelSuccess = {
    type: typeof CANCEL_SUCCESS;
};

export type OrderCancelError = {
    type: typeof CANCEL_ERROR;
};

export type OrderPollingSuccess = {
    type: typeof ORDER_POLLING_SUCCESS;
};

export type UpdateInvoice = {
    type: typeof UPDATE_INVOICE;
    payload: {
        orderId: string;
    };
};

export type OpenAcquiringPaymentPage = {
    type: typeof OPEN_ACQUIRING_PAYMENT_PAGE;
    payload: {
        confirmationUrl: ConfirmUrlDto;
        saveCreditCard: boolean;
    };
};

export type CordovaAcquiringPaymentSuccess = {
    type: typeof CORDOVA_ACQUIRING_PAYMENT_SUCCESS;
};

export type PaymentActionTypes =
    | PaymentInit
    | PaymentInitSuccess
    | PaymentSetOnline
    | PaymentSetLoading
    | PaymentSaveCreditCard
    | PaymentConfirm
    | PaymentConfirmSuccess
    | PaymentConfirmError
    | PaymentConfirmReset
    | PaymentRecurr
    | PaymentRecurrSuccess
    | PaymentRecurrError
    | PaymentRecurrReset
    | OrderCancel
    | OrderCancelSuccess
    | OrderCancelError
    | OrderPollingSuccess
    | UpdateInvoice
    | OpenAcquiringPaymentPage
    | CordovaAcquiringPaymentSuccess;
