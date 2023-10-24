import { SagaIterator } from 'redux-saga';
import Router from 'next/router';

import { isCordova } from 'utils/platform';

export function* goToOrder(
    orderId: string,
    withSnackbar: boolean
): SagaIterator {
    if (isCordova) {
        Router.replace({
            pathname: '/order',
            query: {
                id: orderId,
                snackbar: withSnackbar || '',
            },
        });
    } else {
        Router.replace(
            {
                pathname: '/order/[id]',
                query: {
                    snackbar: withSnackbar || '',
                },
            },
            {
                pathname: `/order/${orderId}`,
            }
        );
    }
}
