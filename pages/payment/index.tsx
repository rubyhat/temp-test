import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import Payment from './[id]';

/**
 * HOC для SSG: /payment/[id] => /payment/?id=
 *
 * Первый рендер при открытии ссылки напрямую всегда с пустым объектом `router.query`.
 * Чтобы избежать API запросов типа `/api/orders/undefined` рендерим компонент
 * только после получения QueryParams.
 */
const Index: NextPage = () => {
    const router = useRouter();

    const { id: orderId } = router.query as { id?: string };

    if (orderId) {
        return <Payment />;
    }

    // тут мог бы быть Preloader
    return null;
};

Index.getInitialProps = async () => {
    return {
        namespacesRequired: ['booking', 'order', 'brand'],
    };
};

export default Index;
