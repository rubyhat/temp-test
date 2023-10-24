import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import Order from './[id]';

/**
 * HOC для SSG: /order/[id] => /order/?id=
 *
 * Первый рендер при открытии ссылки напрямую всегда с пустым объектом `router.query`.
 * Чтобы избежать API запросов типа `/api/orders/undefined` рендерим компонент
 * только после получения QueryParams.
 */
const Index: NextPage = () => {
    const router = useRouter();

    const { id: orderId } = router.query as { id?: string };

    if (orderId) {
        return <Order id={orderId} />;
    }

    // тут мог бы быть Preloader
    return null;
};

Index.getInitialProps = async () => {
    return {
        namespacesRequired: ['order', 'booking', 'brand'],
    };
};

export default Index;
