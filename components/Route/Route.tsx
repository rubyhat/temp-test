import React, { FC } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import parseISO from 'date-fns/parseISO';
import clsx from 'clsx';

import { format } from 'utils/date';

import {
    formatDaysHoursMinutes,
    getTimeDifferenceWithTimezone,
} from 'utils/time';
import { useTranslation } from 'i18n';
import { OrderDto, OrdersResponseDto } from 'swagger/client';
import {
    calcApproximateArrivalTime,
    calcApproximateDepartureTime,
} from 'utils/calcD2dTime';
import { AtlasTheme } from 'typings/atlas-theme';
import { useSAAS } from 'hooks/useSAAS';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {},
        /* Styles applied to the root element if `fullWidth={true}`. */
        fullWidth: {
            width: '100%',
        },
        /* Styles applied to the route `div` element. */
        route: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        /* Styles applied to the time `div` element. */
        time: {
            ...theme.atlas.typography.subtitle,
            color: theme.atlas.palette.text.base,
            fontWeight: 700,
            flexBasis: 0,
        },
        /* Styles applied to the date `div` element. */
        date: {
            ...theme.atlas.typography.micro,
            color: theme.atlas.palette.text.minor,
        },
        /* Styles applied to the divider `div` element. */
        divider: {
            ...theme.atlas.typography.caption,
            color: theme.atlas.palette.text.minor,
            borderBottom: `1px solid ${theme.palette.divider}`,
            flexGrow: 1,
            display: 'flex',
            justifyContent: 'space-between',
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
        },
        /* Styles applied to the endpoints `div` element. */
        endpoints: {
            fontSize: 14,
            lineHeight: 1.5,
            color: theme.atlas.palette.text.minor,
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: theme.spacing(1),
        },
        departureName: {
            width: '50%',
            paddingRight: 4,
        },
        arrivalName: {
            width: '50%',
            paddingLeft: 4,
            textAlign: 'right',
        },
        disabled: {
            opacity: 0.5,
        },
    }),
    { name: 'Route' }
);

type Props = {
    /* ISO 8601 */
    departureDate: string;
    /* ISO 8601 */
    arrivalDate: string;
    departureTimezone?: string;
    arrivalTimezone?: string;
    departureName?: string;
    arrivalName?: string;
    departureInfo?: string;
    arrivalInfo?: string;
    fullWidth?: boolean;
    available?: boolean;
    order?: OrderDto | OrdersResponseDto;
    className?: string;
};

export const Route: FC<Props> = props => {
    const {
        departureDate,
        arrivalDate,
        departureName,
        arrivalName,
        departureInfo,
        arrivalInfo,
        departureTimezone = 'Europe/Moscow',
        arrivalTimezone = 'Europe/Moscow',
        fullWidth,
        available = true,
        order,
        className,
    } = props;
    const classes = useStyles();
    const { t } = useTranslation();
    const { isMioTaxi } = useSAAS();

    const localDeparture = parseISO(departureDate);
    const displayDeparture = format(localDeparture, 'HH:mm');
    const localArrival = parseISO(arrivalDate);
    const displayArrival = format(localArrival, 'HH:mm');
    const displayDepartureDate =
        new Date().getDate() !== localDeparture.getDate()
            ? format(localDeparture, 'd LLL')
            : null;
    const displayArrivalDate =
        localArrival.getDate() !== localDeparture.getDate()
            ? format(localArrival, 'd LLL')
            : null;
    const duration = getTimeDifferenceWithTimezone(
        departureDate,
        arrivalDate,
        departureTimezone,
        arrivalTimezone
    );
    const displayDuration = formatDaysHoursMinutes(duration, t);

    // D2D approximate time
    const rideInfo = order && order.rideInfo;
    const pickupStop = order && order.pickupStop;
    const dischargeStop = order && order.dischargeStop;

    const approximateDeparture =
        pickupStop && pickupStop.dynamic
            ? calcApproximateDepartureTime(rideInfo, pickupStop)
            : '';
    const approximateArrival =
        dischargeStop && dischargeStop.dynamic
            ? calcApproximateArrivalTime(rideInfo, dischargeStop)
            : '';

    if (isMioTaxi) {
        return (
            <div
                className={clsx(classes.root, className, {
                    [classes.fullWidth]: fullWidth,
                    [classes.disabled]: !available,
                })}
            >
                <div className={classes.route}>
                    <div className={classes.time}>
                        {approximateDeparture || displayDeparture}
                    </div>
                    {available && (
                        <div className={classes.divider}>
                            <div>{displayDepartureDate}</div>
                        </div>
                    )}
                    {!available && <div>{t('search:noSeats')}</div>}
                </div>
                {departureName ? (
                    <div className={classes.endpoints}>
                        <div className={classes.departureName}>
                            {departureName ? (
                                <div>{`${t('from')}: ${departureName}`}</div>
                            ) : null}
                        </div>
                    </div>
                ) : null}
            </div>
        );
    } else {
        return (
            <div
                className={clsx(classes.root, className, {
                    [classes.fullWidth]: fullWidth,
                    [classes.disabled]: !available,
                })}
            >
                <div className={classes.route}>
                    <div className={classes.time}>
                        {approximateDeparture || displayDeparture}
                    </div>
                    {available && (
                        <div className={classes.divider}>
                            <div>{displayDepartureDate}</div>
                            <div>{displayDuration}</div>
                            <div>{displayArrivalDate}</div>
                        </div>
                    )}
                    {!available && <div>{t('search:noSeats')}</div>}
                    <div className={classes.time}>
                        {approximateArrival || displayArrival}
                    </div>
                </div>
                {departureName || arrivalName ? (
                    <div className={classes.endpoints}>
                        <div className={classes.departureName}>
                            {departureName ? (
                                <div>{`${t('from')}: ${departureName}`}</div>
                            ) : null}
                            {departureInfo ? <div>{departureInfo}</div> : null}
                        </div>
                        <div className={classes.arrivalName}>
                            {arrivalName ? (
                                <div>{`${t('to')}: ${arrivalName}`}</div>
                            ) : null}
                            {arrivalInfo ? <div>{arrivalInfo}</div> : null}
                        </div>
                    </div>
                ) : null}
            </div>
        );
    }
};
