import React, { useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { ProfileCardWithButton } from 'components/ProfileCardWithButton';
import { useTranslation } from 'i18n';
import { ProfileModalAboutDeleteAccount } from 'components/ProfileDeleteAccount/ProfileModalAboutDeleteAccount';
import { ProfileModalVerifyDeleteAccount } from 'components/ProfileDeleteAccount/ProfileModalVerifyDeleteAccount';
import { ProfileModalDeleteAccountSuccess } from 'components/ProfileDeleteAccount/ProfileModalDeleteAccountSuccess';
import { ProfileModalDeleteAccountFailed } from 'components/ProfileDeleteAccount/ProfileModalDeleteAccountFailed';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import { OrdersState } from 'store/orders/types';
import { ordersRefetching, ordersUpdateState } from 'store/orders/actions';

const useStyles = makeStyles(
    (theme: Theme) => ({
        /* Styles applied to the root element. */
        root: {
            marginBottom: theme.spacing(2),
        },
        borderRadiusSm: {
            [theme.breakpoints.down('sm')]: {
                borderRadius: theme.spacing(1),
            },
        },
    }),
    { name: 'ProfileDeleteAccountCard' }
);

export const ProfileDeleteAccountCard = () => {
    const { t } = useTranslation();
    const classes = useStyles();
    const [openInfoModal, setOpenInfoModal] = React.useState(false);
    const [openVerifyModal, setOpenVerifyModal] = React.useState(false);
    const [openSuccessModal, setOpenSuccessModal] = React.useState(false);
    const [openFailedModal, setOpenFailedModal] = React.useState(false);
    const [failedByOrders, setFailedByOrders] = React.useState(false);
    const [inputPhone, setInputPhone] = React.useState('');

    const dispatch = useDispatch();
    const { orders } = useSelector<RootState, OrdersState>(
        rootState => rootState.orders
    );

    const handleDeleteAccClick = () => {
        setOpenInfoModal(true);
    };

    useEffect(() => {
        dispatch(
            ordersUpdateState({
                type: 'upcoming',
            })
        );
        dispatch(ordersRefetching());
    }, []);

    return (
        <div className={clsx(classes.root)}>
            <ProfileCardWithButton
                button={{
                    variant: 'primary',
                    text: t('profile:deleteAccCardButtonText'),
                    onClick: handleDeleteAccClick,
                }}
                cardText={t('profile:deleteAccCardText')}
                className={classes.borderRadiusSm}
            />
            <ProfileModalAboutDeleteAccount
                isOpen={openInfoModal}
                setIsOpen={setOpenInfoModal}
                openNextModal={setOpenVerifyModal}
            />
            <ProfileModalVerifyDeleteAccount
                isOpen={openVerifyModal}
                setIsOpen={setOpenVerifyModal}
                setOpenSuccessModal={setOpenSuccessModal}
                setOpenFailedModal={setOpenFailedModal}
                setInputPhone={setInputPhone}
                orders={orders}
                setFailedByOrders={setFailedByOrders}
            />
            <ProfileModalDeleteAccountSuccess
                isOpen={openSuccessModal}
                setIsOpen={setOpenSuccessModal}
            />
            <ProfileModalDeleteAccountFailed
                isOpen={openFailedModal}
                setIsOpen={setOpenFailedModal}
                openNextModal={setOpenVerifyModal}
                inputPhone={inputPhone}
                failedByOrders={failedByOrders}
                setFailedByOrders={setFailedByOrders}
            />
        </div>
    );
};
