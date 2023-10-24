import { SearchDto, SeatingSchemeDto, StopsDto } from 'swagger/client';

export type BookingPassenger = {
    id: number;
    /**
     * NewPassengerDialog state.
     */
    lastName: string;
    firstName: string;
    middleName: string;
    birthDate: string; // ISO format
    genderCode: string;

    /**
     * NewPassengerDialog state (passport data).
     */
    docTypeCode: string;
    docNumber: string;
    citizenshipCode: string;

    /**
     * NewPassenger state.
     */
    ticketTypeCode: string;
};

export type BookingPassengers = Record<number, BookingPassenger | null>;

export type BookingState = {
    // Данные пассажиров
    passengers: BookingPassengers;
    phone: string;
    subject: string;
    savePersonalData: boolean;

    // Выбор мест посадки/высадки
    pickupInputValue: string;
    pickupValue: StopsDto['id'] | null;
    pickupMapValue: StopsDto['id'] | null;

    dropoffInputValue: string;
    dropoffValue: StopsDto['id'] | null;
    dropoffMapValue: StopsDto['id'] | null;

    // QueryParams
    rideId: string;
    fromId: string;
    toId: string;
    date: string;

    orderStatus: BookingOrderStatuses | null;
    documentsAutocompleted: boolean;

    fireFormValidate: boolean;
    firePhoneValidate: boolean;

    isOpenSelectSeatModal: boolean;
    selectedSeats: number[];
    seatingRequired: boolean;
    seatingScheme?: Array<SeatingSchemeDto>;
};

type BookingOrderStatuses =
    | typeof BOOKING_ORDER_SENDING
    | typeof BOOKING_ORDER_SUCCESS
    | typeof BOOKING_ORDER_ERROR;
export const BOOKING_ORDER_SENDING = 'BOOKING_ORDER_SENDING';
export const BOOKING_ORDER_SUCCESS = 'BOOKING_ORDER_SUCCESS';
export const BOOKING_ORDER_ERROR = 'BOOKING_ORDER_ERROR';

export const BOOKING_INIT = 'BOOKING_INIT';
export const BOOKING_EDIT_PASSENGER = 'BOOKING_EDIT_PASSENGER';
export const BOOKING_UPDATE_PICKUP = 'BOOKING_UPDATE_PICKUP';
export const BOOKING_UPDATE_DROPOFF = 'BOOKING_UPDATE_DROPOFF';
export const BOOKING_EDIT_PHONE = 'BOOKING_EDIT_PHONE';
export const BOOKING_EDIT_SUBJECT = 'BOOKING_EDIT_SUBJECT';
export const BOOKING_SET_DEFAULT_PICKUP_DROPOFF =
    'BOOKING_SET_DEFAULT_PICKUP_DROPOFF';
export const BOOKING_UPDATE_STATE = 'BOOKING_UPDATE_STATE';
export const BOOKING_DOCUMENTS_AUTOCOMPLETED =
    'BOOKING_DOCUMENTS_AUTOCOMPLETED';

export const BOOKING_FIRE_FORM_VALIDATE = 'BOOKING_FIRE_FORM_VALIDATE';
export const BOOKING_FIRE_PHONE_VALIDATE = 'BOOKING_FIRE_PHONE_VALIDATE';

export type BookingInitPayload = {
    numberOfPassengers: number;
    fromId: string;
    toId: string;
    date: string;
    rideId: string;
    pickup?: string;
    discharge?: string;
    seatingScheme?: Array<SeatingSchemeDto>;
    seatingRequired?: boolean;
};
type BookingInitAction = {
    type: typeof BOOKING_INIT;
    payload: BookingInitPayload;
};

type BookingEditPassengerAction = {
    type: typeof BOOKING_EDIT_PASSENGER;
    payload: {
        index: number;
        passenger: BookingPassenger | null;
    };
};

type BookingEditPhoneAction = {
    type: typeof BOOKING_EDIT_PHONE;
    payload: string;
};

type BookingEditSubjectAction = {
    type: typeof BOOKING_EDIT_SUBJECT;
    payload: string;
};

type BookingUpdatePickupAction = {
    type: typeof BOOKING_UPDATE_PICKUP;
    payload: Partial<
        Pick<
            BookingState,
            'pickupInputValue' | 'pickupValue' | 'pickupMapValue'
        >
    >;
};

type BookingUpdateDropoffAction = {
    type: typeof BOOKING_UPDATE_DROPOFF;
    payload: Partial<
        Pick<
            BookingState,
            'dropoffInputValue' | 'dropoffValue' | 'dropoffMapValue'
        >
    >;
};

type BookingSetDefaultPickupDropoff = {
    type: typeof BOOKING_SET_DEFAULT_PICKUP_DROPOFF;
    payload: {
        defaultPickupStop: StopsDto;
        defaultDischargeStop: StopsDto;
    };
};

type BookingUpdateState = {
    type: typeof BOOKING_UPDATE_STATE;
    payload: Partial<BookingState>;
};

export type BookingOrderSending = {
    type: typeof BOOKING_ORDER_SENDING;
};

export type BookingOrderSuccess = {
    type: typeof BOOKING_ORDER_SUCCESS;
};

export type BookingOrderError = {
    type: typeof BOOKING_ORDER_ERROR;
};

export type BookingDocumentsAutocompleted = {
    type: typeof BOOKING_DOCUMENTS_AUTOCOMPLETED;
    payload: boolean;
};

export type BookingFireFormValidate = {
    type: typeof BOOKING_FIRE_FORM_VALIDATE;
    payload: boolean;
};

export type BookingFirePhoneValidate = {
    type: typeof BOOKING_FIRE_PHONE_VALIDATE;
    payload: boolean;
};

export type BookingActionTypes =
    | BookingInitAction
    | BookingEditPassengerAction
    | BookingUpdatePickupAction
    | BookingUpdateDropoffAction
    | BookingEditPhoneAction
    | BookingEditSubjectAction
    | BookingSetDefaultPickupDropoff
    | BookingUpdateState
    | BookingOrderSending
    | BookingOrderSuccess
    | BookingOrderError
    | BookingDocumentsAutocompleted
    | BookingFireFormValidate
    | BookingFirePhoneValidate;
