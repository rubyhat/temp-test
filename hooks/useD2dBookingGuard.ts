import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import { RIDE_SUCCESS, RIDE_UPDATING, RideState } from 'store/ride/types';
import { RootState } from 'store';

export enum BookingStep {
    Index = '/d2dbooking',
    Pickup = '/d2dbooking/pickup',
    Dropoff = '/d2dbooking/dropoff',
    Passengers = '/d2dbooking/passengers',
}

/**
 * Guard для этапов D2D букинга.
 */
export function useD2dBookingGuard() {
    const router = useRouter();
    const { status } = useSelector<RootState, RideState>(
        rootState => rootState.ride
    );

    useEffect(() => {
        if (router.pathname === BookingStep.Index) {
            // Ничего не делаем. На этой странице фетчится рейс.
            // Потом перенаправляет к первому этапу "Выбор места посадки".
            return;
        }

        // Этапы: Pickup, Dropoff, Passengers
        // Если обновили страницу то `rideInfo` потерян.
        // Перенаправляем в `index.tsx` чтобы получить rideInfo заново.
        if (status !== RIDE_SUCCESS && status !== RIDE_UPDATING) {
            router.replace({
                pathname: BookingStep.Index,
                query: router.query,
            });
        }
    }, [status]);
}
