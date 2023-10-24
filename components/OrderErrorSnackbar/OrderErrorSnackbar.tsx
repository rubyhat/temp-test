import React, { FC, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import useSnackBar from '../ui/Snackbar/useSnackbar';
import { OrderDtoStatusEnum } from 'swagger/client';
import { OrderState } from 'store/order/types';
import { RootState } from 'store';
import { useTranslation } from 'i18n';

// Snackbar не отображается если вызывать из
// компонента на одном уровне с <SnackbarProvider />
// @todo добавить <SnackbarProvider /> в _app.tsx
// и удалить этот компонент
export const OrderErrorSnackbar: FC = () => {
    const { order } = useSelector<RootState, OrderState>(
        rootState => rootState.order
    );
    const router = useRouter();
    const [, snackbar] = useSnackBar();
    const { t } = useTranslation();

    const showSnackbar = router.query.snackbar;

    useEffect(() => {
        if (!showSnackbar) return;
        if (!order) return;

        if (
            order.status === OrderDtoStatusEnum.Cancelled ||
            order.status === OrderDtoStatusEnum.Expired
        ) {
            snackbar({
                type: 'show',
                payload: {
                    message: t('order:snackbarOrderCancelled'),
                    variant: 'alert',
                },
            });
        } else if (order.status === OrderDtoStatusEnum.Error) {
            snackbar({
                type: 'show',
                payload: {
                    message: t('order:snackbarOrderError'),
                    variant: 'alert',
                },
            });
        }
    }, [order, showSnackbar]);

    return null;
};
