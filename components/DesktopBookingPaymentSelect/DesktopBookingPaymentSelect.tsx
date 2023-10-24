import React, { FC } from 'react';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';

import { DesktopBookingPaymentItem } from './DesktopBookingPaymentItem';
import { PaymentState } from 'store/payment/types';
import {
    PaymentType,
    Props as BookingPaymentSelectProps,
} from '../BookingPaymentSelect';
import { RootState } from 'store';
import { RideDtoPaymentTypesEnum } from 'swagger/client';
import { getCardNameByMask } from 'utils/credit-cards';
import { paymentSaveCreditCard } from 'store/payment/actions';
import { useTranslation } from 'i18n';
import { currencySymbol } from 'utils/currency';
import Link from 'next/link';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {},
        /* Styles applied to the `DesktopBookingPaymentItem` component. */
        item: {
            '& ~ &': {
                marginTop: theme.spacing(2),
            },
        },
        /* Styles applied to the forbidden payment type text `div` element. */
        forbiddenPaymentType: {
            color: theme.atlas.palette.text.base,
            marginRight: theme.spacing(2),
            '&>a': {
                color: theme.atlas.palette.text.base,
            },
        },
        forbiddenPaymentTypeLink: {
            color: theme.atlas.palette.text.base,
        },
    }),
    { name: 'DesktopBookingPaymentSelect' }
);

export const DesktopBookingPaymentSelect: FC<
    BookingPaymentSelectProps
> = props => {
    const {
        value,
        onChange,
        className,
        prices,
        milesBalance = 0,
        currency,
        disabled = {
            bank: false,
            cash: false,
            miles: false,
        },
        forbidden = {
            bank: false,
            cash: false,
            miles: false,
        },
        paymentTypes,
        bonus = {
            bank: 0,
            cash: 0,
            miles: 0,
        },
        cards = [],
    } = props;
    const classes = useStyles();
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const { saveCreditCard } = useSelector<RootState, PaymentState>(
        rootState => rootState.payment
    );
    const handleSaveCreditCard = (e: React.ChangeEvent<HTMLInputElement>) =>
        dispatch(paymentSaveCreditCard(e.target.checked));

    const handleChange = (value: PaymentType) => () => {
        onChange(value);
    };

    const cardPaymentAvailable = paymentTypes.includes(
        RideDtoPaymentTypesEnum.Card
    );
    const reccurPaymentAvailable = paymentTypes.includes(
        RideDtoPaymentTypesEnum.Reccur
    );
    const cashPaymentAvailable = paymentTypes.includes(
        RideDtoPaymentTypesEnum.Cash
    );
    const milesPaymentAvailable = paymentTypes.includes(
        RideDtoPaymentTypesEnum.Miles
    );

    const renderCreditCards = () =>
        cards.map(card => (
            <DesktopBookingPaymentItem
                className={classes.item}
                onClick={handleChange(card.id)}
                key={card.id}
                title={getCardNameByMask(card.cardMask)}
                price={prices['bank']}
                currency={currencySymbol[currency]}
                selected={value === card.id}
            />
        ));

    const forbiddenNode = (
        <div className={classes.forbiddenPaymentType}>
            {t('booking:forbiddenPaymentTypeDesc')}{' '}
            <Link href="/profile/rating">
                {t('booking:forbiddenPaymentTypeDetails')}
            </Link>
        </div>
    );

    return (
        <div className={clsx(classes.root, className)}>
            {reccurPaymentAvailable && !disabled.bank && !forbidden.bank
                ? renderCreditCards()
                : null}

            {cardPaymentAvailable ? (
                <DesktopBookingPaymentItem
                    className={classes.item}
                    onClick={handleChange('bank')}
                    title={t('booking:paymentTypeCard')}
                    subtitle={
                        forbidden.bank
                            ? forbiddenNode
                            : t('booking:paymentTypeCardDesc')
                    }
                    price={prices['bank']}
                    currency={currencySymbol[currency]}
                    disabled={disabled.bank || forbidden.bank}
                    selected={value === 'bank'}
                />
            ) : null}

            {cashPaymentAvailable ? (
                <DesktopBookingPaymentItem
                    className={classes.item}
                    onClick={handleChange('cash')}
                    title={t('booking:paymentTypeCash')}
                    subtitle={
                        forbidden.cash
                            ? forbiddenNode
                            : t('booking:paymentTypeCashDesc')
                    }
                    price={prices['cash']}
                    currency={currencySymbol[currency]}
                    disabled={disabled.cash || forbidden.cash}
                    selected={value === 'cash'}
                />
            ) : null}

            {milesPaymentAvailable ? (
                <DesktopBookingPaymentItem
                    className={classes.item}
                    onClick={handleChange('miles')}
                    title={t('booking:paymentTypeMiles')}
                    subtitle={
                        forbidden.miles
                            ? forbiddenNode
                            : milesBalance > 0
                            ? t('booking:paymentTypeMilesAvailableBalance', {
                                  count: milesBalance,
                              })
                            : t('booking:paymentTypeMilesZeroBalance')
                    }
                    price={prices['miles']}
                    currency={t('booking:miles', { count: prices['miles'] })}
                    disabled={disabled.miles || forbidden.miles}
                    selected={value === 'miles'}
                />
            ) : null}
        </div>
    );
};
