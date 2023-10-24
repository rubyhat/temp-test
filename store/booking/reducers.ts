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
    BookingState,
} from './types';

const initialState: BookingState = {
    passengers: {},
    phone: '',
    subject: '',
    savePersonalData: true,

    pickupInputValue: '',
    pickupValue: null,
    pickupMapValue: null,
    dropoffInputValue: '',
    dropoffValue: null,
    dropoffMapValue: null,

    // QueryParams
    rideId: '',
    fromId: '',
    toId: '',
    date: '',

    orderStatus: null,
    documentsAutocompleted: false,

    fireFormValidate: false,
    firePhoneValidate: false,

    isOpenSelectSeatModal: false,
    seatingScheme: [],
    selectedSeats: [],
    seatingRequired: false,
};

export const bookingReducer = (
    state: BookingState = initialState,
    action: BookingActionTypes
): BookingState => {
    switch (action.type) {
        case BOOKING_INIT: {
            const {
                numberOfPassengers,
                rideId,
                fromId,
                toId,
                date,
            } = action.payload;

            const passengers = Array(numberOfPassengers)
                .fill(null)
                .reduce(
                    (acc, curr, index) => ({
                        ...acc,
                        [index]: curr,
                    }),
                    {}
                );

            return {
                ...initialState,
                passengers,
                rideId,
                fromId,
                toId,
                date,
            };
        }
        case BOOKING_EDIT_PASSENGER: {
            const { payload } = action;
            const { passenger, index } = payload;

            const statePassengers = { ...state.passengers };
            statePassengers[index] = passenger;

            return {
                ...state,
                passengers: statePassengers,
            };
        }
        case BOOKING_EDIT_PHONE: {
            return {
                ...state,
                phone: action.payload,
            };
        }
        case BOOKING_EDIT_SUBJECT: {
            return {
                ...state,
                subject: action.payload,
            };
        }
        case BOOKING_UPDATE_PICKUP: {
            return {
                ...state,
                ...action.payload,
            };
        }
        case BOOKING_UPDATE_DROPOFF: {
            return {
                ...state,
                ...action.payload,
            };
        }
        case BOOKING_SET_DEFAULT_PICKUP_DROPOFF: {
            const { defaultDischargeStop, defaultPickupStop } = action.payload;

            return {
                ...state,
                pickupValue: defaultPickupStop.id,
                pickupInputValue: defaultPickupStop.desc,
                pickupMapValue: defaultPickupStop.id,
                dropoffValue: defaultDischargeStop.id,
                dropoffInputValue: defaultDischargeStop.desc,
                dropoffMapValue: defaultDischargeStop.id,
            };
        }
        case BOOKING_UPDATE_STATE: {
            return {
                ...state,
                ...action.payload,
            };
        }
        case BOOKING_ORDER_SENDING: {
            return {
                ...state,
                orderStatus: BOOKING_ORDER_SENDING,
            };
        }
        case BOOKING_ORDER_SUCCESS: {
            return {
                ...state,
                orderStatus: BOOKING_ORDER_SUCCESS,
            };
        }
        case BOOKING_ORDER_ERROR: {
            return {
                ...state,
                orderStatus: BOOKING_ORDER_ERROR,
            };
        }
        case BOOKING_DOCUMENTS_AUTOCOMPLETED: {
            return {
                ...state,
                documentsAutocompleted: action.payload,
            };
        }
        case BOOKING_FIRE_FORM_VALIDATE: {
            return {
                ...state,
                fireFormValidate: action.payload,
            };
        }
        case BOOKING_FIRE_PHONE_VALIDATE: {
            return {
                ...state,
                firePhoneValidate: action.payload,
            };
        }
        default: {
            return state;
        }
    }
};
