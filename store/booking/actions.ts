import {
    BOOKING_DOCUMENTS_AUTOCOMPLETED,
    BOOKING_EDIT_PASSENGER,
    BOOKING_EDIT_PHONE,
    BOOKING_EDIT_SUBJECT,
    BOOKING_FIRE_FORM_VALIDATE,
    BOOKING_FIRE_PHONE_VALIDATE,
    BOOKING_INIT,
    BOOKING_ORDER_ERROR,
    BOOKING_ORDER_SENDING,
    BOOKING_ORDER_SUCCESS,
    BOOKING_SET_DEFAULT_PICKUP_DROPOFF,
    BOOKING_UPDATE_DROPOFF,
    BOOKING_UPDATE_PICKUP,
    BOOKING_UPDATE_STATE,
    BookingActionTypes,
    BookingInitPayload,
    BookingPassenger,
    BookingState,
} from './types';
import { SearchDto, StopsDto } from 'swagger/client';

export const bookingInit = (
    payload: BookingInitPayload
): BookingActionTypes => ({
    type: BOOKING_INIT,
    payload,
});

export const bookingEditPassenger = (payload: {
    index: number;
    passenger: BookingPassenger | null;
}): BookingActionTypes => ({
    type: BOOKING_EDIT_PASSENGER,
    payload,
});

export const bookingEditPhone = (phone: string): BookingActionTypes => ({
    type: BOOKING_EDIT_PHONE,
    payload: phone,
});

export const bookingEditSubject = (subject: string): BookingActionTypes => ({
    type: BOOKING_EDIT_SUBJECT,
    payload: subject,
});

export const bookingUpdatePickup = (
    payload: Partial<
        Pick<
            BookingState,
            'pickupInputValue' | 'pickupValue' | 'pickupMapValue'
        >
    >
): BookingActionTypes => ({
    type: BOOKING_UPDATE_PICKUP,
    payload,
});

export const bookingUpdateDropoff = (
    payload: Partial<
        Pick<
            BookingState,
            'dropoffInputValue' | 'dropoffValue' | 'dropoffMapValue'
        >
    >
): BookingActionTypes => ({
    type: BOOKING_UPDATE_DROPOFF,
    payload,
});

export const bookingSetDefaultPickupDropoff = (payload: {
    defaultPickupStop: StopsDto;
    defaultDischargeStop: StopsDto;
}): BookingActionTypes => ({
    type: BOOKING_SET_DEFAULT_PICKUP_DROPOFF,
    payload,
});

export const bookingUpdateState = (
    payload: Partial<BookingState>
): BookingActionTypes => ({
    type: BOOKING_UPDATE_STATE,
    payload,
});

export const bookingOrderSending = (): BookingActionTypes => ({
    type: BOOKING_ORDER_SENDING,
});

export const bookingOrderSuccess = (): BookingActionTypes => ({
    type: BOOKING_ORDER_SUCCESS,
});

export const bookingOrderError = (): BookingActionTypes => ({
    type: BOOKING_ORDER_ERROR,
});

export const bookingDocumentsAutocompleted = (
    autocompleted: boolean
): BookingActionTypes => ({
    type: BOOKING_DOCUMENTS_AUTOCOMPLETED,
    payload: autocompleted,
});

export const bookingFireFormValidate = (
    value: boolean
): BookingActionTypes => ({
    type: BOOKING_FIRE_FORM_VALIDATE,
    payload: value,
});

export const bookingFirePhoneValidate = (
    value: boolean
): BookingActionTypes => ({
    type: BOOKING_FIRE_PHONE_VALIDATE,
    payload: value,
});
