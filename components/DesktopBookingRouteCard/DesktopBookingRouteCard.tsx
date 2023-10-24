import React, { FC, ReactNode } from 'react';
import Divider from '@material-ui/core/Divider';
import clsx from 'clsx';
import parseISO from 'date-fns/parseISO';
import { format } from 'utils/date';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { useTranslation } from 'i18n';
import { Typo } from 'components/Typo/Typo';
import {
    formatDaysHoursMinutes,
    getTimeDifferenceWithTimezone,
} from 'utils/time';
import { formatPrice } from 'utils/price';
import { currencySymbol, CurrencySymbol } from 'utils/currency';
import { AtlasTheme } from 'typings/atlas-theme';
import { useSAAS } from 'hooks/useSAAS';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            borderRadius: theme.shape.borderRadius,
            boxShadow: theme.atlas.shadows.bottom,
            backgroundColor: '#FFF',
        },
        /* Styles applied to the header `div` element. */
        header: {
            padding: theme.spacing(2),
        },
        /* Styles applied to the route `div` element. */
        route: {
            display: 'flex',
            justifyContent: 'space-between',
            padding: theme.spacing(2),
        },
        /* Styles applied to the duration `div` element. */
        duration: {
            color: theme.atlas.palette.text.minor,
        },
    }),
    { name: 'DesktopBookingRouteCard' }
);

type Props = {
    departureDate: string; // ISO
    departureTimezone: string;
    arrivalDate: string; // ISO
    arrivalTimezone: string;
    passengers: number;
    price?: number;
    currency?: CurrencySymbol;
    route: ReactNode;
    className?: string;
};

export const DesktopBookingRouteCard: FC<Props> = props => {
    const {
        departureDate,
        departureTimezone,
        arrivalDate,
        arrivalTimezone,
        passengers,
        route,
        className,
        price,
        currency,
    } = props;
    const classes = useStyles();
    const { t } = useTranslation();

    const formattedDate = format(parseISO(departureDate), 'd MMM, EEEEEE');
    const priceStr =
        price && currency
            ? ` · ${formatPrice(price, currencySymbol[currency])}`
            : '';
    const title = `${formattedDate} · ${passengers} ${t('people', {
        count: passengers,
    })}${priceStr}`;

    const duration = getTimeDifferenceWithTimezone(
        departureDate,
        arrivalDate,
        departureTimezone,
        arrivalTimezone
    );
    const displayDuration = formatDaysHoursMinutes(duration, t);
    const { isMioTaxi } = useSAAS();

    return (
        <div className={clsx(classes.root, className)}>
            {!isMioTaxi && (
                <>
                    <div className={classes.header}>
                        <Typo color="textSecondary">{title}</Typo>
                    </div>
                    <Divider variant="fullWidth" />
                </>
            )}

            <div className={classes.route}>
                {route}
                {!isMioTaxi && (
                    <div className={classes.duration}>{displayDuration}</div>
                )}
            </div>
        </div>
    );
};
