import {
    CANCEL_CANCELING,
    CANCEL_ERROR,
    CANCEL_SUCCESS,
    CONFIRM_ERROR,
    CONFIRM_LOADING,
    CONFIRM_RESET,
    CONFIRM_SUCCESS,
    CORDOVA_ACQUIRING_PAYMENT_SUCCESS,
    OPEN_ACQUIRING_PAYMENT_PAGE,
    ORDER_POLLING_SUCCESS,
    PAYMENT_INIT,
    PAYMENT_INIT_SUCCESS,
    PAYMENT_SAVE_CREDIT_CARD,
    PAYMENT_SET_LOADING,
    PAYMENT_SET_ONLINE,
    PaymentActionTypes,
    PaymentSetLoading,
    PaymentSetOnline,
    RECURR_ERROR,
    RECURR_LOADING,
    RECURR_RESET,
    RECURR_SUCCESS,
    UPDATE_INVOICE,
} from './types';
import { ConfirmUrlDto, OrderConfirmDtoPaymentTypeEnum } from 'swagger/client';

export const paymentInit = (orderId: string): PaymentActionTypes => ({
    type: PAYMENT_INIT,
    payload: {
        orderId,
    },
});

export const paymentInitSuccess = (): PaymentActionTypes => ({
    type: PAYMENT_INIT_SUCCESS,
});

export const paymentSetOnline = (payload: PaymentSetOnline['payload']) => ({
    type: PAYMENT_SET_ONLINE,
    payload,
});

export const paymentSetLoading = (payload: PaymentSetLoading['payload']) => ({
    type: PAYMENT_SET_LOADING,
    payload,
});

export const paymentSaveCreditCard = (checked: boolean) => ({
    type: PAYMENT_SAVE_CREDIT_CARD,
    payload: checked,
});

export const paymentConfirm = (
    orderId: string,
    paymentType: OrderConfirmDtoPaymentTypeEnum
): PaymentActionTypes => ({
    type: CONFIRM_LOADING,
    payload: {
        orderId,
        paymentType,
    },
});

export const paymentConfirmSuccess = (): PaymentActionTypes => ({
    type: CONFIRM_SUCCESS,
});

export const paymentConfirmError = (): PaymentActionTypes => ({
    type: CONFIRM_ERROR,
});

export const paymentConfirmReset = (): PaymentActionTypes => ({
    type: CONFIRM_RESET,
});

export const paymentRecurr = (
    orderId: string,
    cardId: string | number
): PaymentActionTypes => ({
    type: RECURR_LOADING,
    payload: {
        orderId,
        cardId,
    },
});

export const paymentRecurrSuccess = (): PaymentActionTypes => ({
    type: RECURR_SUCCESS,
});

export const paymentRecurrError = (): PaymentActionTypes => ({
    type: RECURR_ERROR,
});

export const paymentRecurrReset = (): PaymentActionTypes => ({
    type: RECURR_RESET,
});

export const orderCancel = (orderId: string): PaymentActionTypes => ({
    type: CANCEL_CANCELING,
    payload: {
        orderId,
    },
});

export const orderCancelSuccess = (): PaymentActionTypes => ({
    type: CANCEL_SUCCESS,
});

export const orderCancelError = (): PaymentActionTypes => ({
    type: CANCEL_ERROR,
});

export const orderPollingSuccess = (): PaymentActionTypes => ({
    type: ORDER_POLLING_SUCCESS,
});

export const updateInvoice = (orderId: string): PaymentActionTypes => ({
    type: UPDATE_INVOICE,
    payload: {
        orderId,
    },
});

export const openAcquiringPaymentPage = (
    confirmationUrl: ConfirmUrlDto,
    saveCreditCard: boolean
): PaymentActionTypes => ({
    type: OPEN_ACQUIRING_PAYMENT_PAGE,
    payload: {
        confirmationUrl,
        saveCreditCard,
    },
});

export const cordovaAcquiringPaymentSuccess = (): PaymentActionTypes => ({
    type: CORDOVA_ACQUIRING_PAYMENT_SUCCESS,
});
