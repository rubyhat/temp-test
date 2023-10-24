import React, { FC, ReactNode } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';

import { Typo } from '../Typo/Typo';
import { useTranslation } from 'i18n';
import { currencySymbol, CurrencySymbol } from 'utils/currency';
import { useCountry } from 'hooks/useCountry';

const useStyles = makeStyles(
    (theme: Theme) => ({
        /* Styles applied to the root element. */
        root: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        /* Styles applied to the price `div` element. */
        price: {
            minWidth: 128,
        },
    }),
    { name: 'BookingAction' }
);

type Props = {
    button: ReactNode;
    price: number;
    tickets: number;
    currency: CurrencySymbol;
    className?: string;
    currencyMiles?: boolean;
};

export const BookingAction: FC<Props> = props => {
    const {
        price,
        tickets,
        button,
        className,
        currency,
        currencyMiles,
    } = props;
    const classes = useStyles();
    const { t } = useTranslation();
    const { country } = useCountry();

    return (
        <div className={clsx(className, classes.root)}>
            <div className={classes.price}>
                <Typo variant="title" weight="bold" color="textPrimary">
                    {price}{' '}
                    {currencyMiles
                        ? t('booking:miles', { count: price })
                        : currencySymbol[currency]}
                </Typo>
                <Typo variant="caption" color="textSecondary">
                    {tickets}{' '}
                    {t(`booking:ticket${country === 'BY' ? 'BY' : ''}`, {
                        count: tickets,
                    })}
                </Typo>
            </div>

            {button}
        </div>
    );
};
