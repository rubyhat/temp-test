import React, { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';

import useSnackBar from '../ui/Snackbar/useSnackbar';
import { CONFIRM_ERROR, PaymentState, RECURR_ERROR } from 'store/payment/types';
import { RootState } from 'store';
import { useTranslation } from 'i18n';

// Snackbar не отображается если вызывать из
// компонента на одном уровне с <SnackbarProvider />
// @todo добавить <SnackbarProvider /> в _app.tsx
// и удалить этот компонент
export const PaymentErrorSnackbar: FC = () => {
    const { recurrStatus, confirmStatus } = useSelector<
        RootState,
        PaymentState
    >(rootState => rootState.payment);
    const [, snackbar] = useSnackBar();
    const { t } = useTranslation();

    useEffect(() => {
        if (recurrStatus === RECURR_ERROR) {
            snackbar({
                type: 'show',
                payload: {
                    message: t('booking:snackbarOrderRecurrentError'),
                    variant: 'alert',
                },
            });
        }
    }, [recurrStatus]);

    useEffect(() => {
        if (confirmStatus === CONFIRM_ERROR) {
            snackbar({
                type: 'show',
                payload: {
                    message: t('booking:snackbarOrderConfirmationError'),
                    variant: 'alert',
                },
            });
        }
    }, [confirmStatus]);

    return null;
};
