export type BookingGeolocationState = {
    /**
     * Была ли попытка найти ближайшую остановку по геолокации.
     *
     * Во избежание повторного примагничивания к этой же остановке (пользователь
     * мог выбрать другую в итоге) при переходе между этапами бронирования
     * "Откуда/Куда".
     */
    nearestStopByGeolocationAttempt: boolean;
};

export const BOOKING_NEAREST_STOP_BY_GEOLOCATION_ATTEMPT =
    'booking-geolocation/nearestStopByGeolocationAttempt';
export const BOOKING_GEOLOCATION_RESET_STATE = 'booking-geolocation/resetState';

export type BookingNeatestStopByGeolocationAttempt = {
    type: typeof BOOKING_NEAREST_STOP_BY_GEOLOCATION_ATTEMPT;
};

export type BookingGeolocationResetState = {
    type: typeof BOOKING_GEOLOCATION_RESET_STATE;
};

export type BookingGeolocationActionTypes =
    | BookingNeatestStopByGeolocationAttempt
    | BookingGeolocationResetState;
