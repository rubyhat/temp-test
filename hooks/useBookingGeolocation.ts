import { useSelector } from 'react-redux';

import { BookingGeolocationState } from 'store/booking-geolocation';
import { RootState } from 'store';

export function useBookingGeolocation() {
    const { nearestStopByGeolocationAttempt } = useSelector<
        RootState,
        BookingGeolocationState
    >(rootState => rootState.bookingGeolocation);

    return {
        nearestStopByGeolocationAttempt,
    };
}
