import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import BaseBooking from './[id]';

/**
 * HOC для SSG: /booking/[id] => /booking/?id=
 *
 * Первый рендер при открытии ссылки напрямую всегда с пустым объектом `router.query`.
 * Чтобы избежать API запросов типа `/api/orders/undefined` рендерим компонент
 * только после получения QueryParams.
 */
const Booking: NextPage = props => {
    const router = useRouter();

    // можно доп. сделать проверку на &from=&to=&date=&passengers=
    const { id: rideId } = router.query as { id?: string };

    if (rideId) {
        return <BaseBooking {...props} />;
    }

    // тут мог бы быть Preloader
    return null;
};

Booking.getInitialProps = async () => {
    return {
        namespacesRequired: [
            'booking',
            'auth',
            'profile',
            'formErrors',
            'brand',
        ],
    };
};

export default Booking;
