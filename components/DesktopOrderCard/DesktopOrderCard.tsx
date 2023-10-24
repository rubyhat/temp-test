import React, { FC } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';

import {
    OrderDto,
    OrdersResponseDto,
    OrdersResponseDtoStatusEnum,
} from 'swagger/client';
import { DesktopRoute } from '../DesktopRoute';
import { Typo } from '../Typo/Typo';
import {
    formatDaysHoursMinutes,
    getTimeDifferenceWithTimezone,
} from 'utils/time';
import { useTranslation } from 'i18n';
import { DesktopOrderBusInfo } from './DesktopOrderBusInfo';
import { DesktopOrderInfo } from './DesktopOrderInfo';
import { Button } from '../ui/Button';
import { readableDate } from 'utils/date';
import { useCountry } from 'hooks/useCountry';
import { AtlasTheme } from 'typings/atlas-theme';
import { useSAAS } from 'hooks/useSAAS';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            borderRadius: theme.shape.borderRadius,
            backgroundColor: '#FFF',
            boxShadow: theme.atlas.shadows.bottom,
            padding: theme.spacing(3),
            position: 'relative',
        },
        /* Styles applied to the container `div` element. */
        container: {
            display: 'flex',
            justifyContent: 'space-between',
        },
        route: {
            width: 300,
            display: 'flex',
            justifyContent: 'space-between',

            [theme.breakpoints.down('md')]: {
                width: 132,
            },
        },
        duration: {
            marginLeft: theme.spacing(2),
        },
        busInfo: {
            width: '25%',
        },
        orderInfo: {
            width: '30%',
            display: 'flex',
            justifyContent: 'space-between',
        },
        departureDate: {
            position: 'absolute',
            right: 0,
            bottom: 0,
            lineHeight: 1,
            padding: theme.spacing(1),
        },
    }),
    { name: 'DesktopOrderCard' }
);

type Props = {
    className?: string;
    order: OrdersResponseDto | OrderDto;
    onActionClick?: (
        id: OrdersResponseDto['id'],
        status: OrdersResponseDto['status']
    ) => void;
    compact?: boolean;
    showTicketButton?: boolean;
    showDepartureDate?: boolean;
};

export const DesktopOrderCard: FC<Props> = props => {
    const {
        className,
        order,
        onActionClick,
        compact,
        showTicketButton,
        showDepartureDate,
    } = props;
    const { rideInfo } = order;
    const { t } = useTranslation();
    const { country } = useCountry();
    const classes = useStyles();
    const { isMioTaxi } = useSAAS();

    if (!rideInfo) return null;

    const duration = getTimeDifferenceWithTimezone(
        order.pickupStop.datetime,
        order.dischargeStop.datetime,
        rideInfo.from.timezone as string,
        rideInfo.to.timezone as string
    );
    const displayDuration = formatDaysHoursMinutes(duration, t);

    const handleDetailsClick = () => {
        if (onActionClick)
            onActionClick(
                order.id,
                order.status as OrdersResponseDtoStatusEnum
            );
    };

    return (
        <div className={clsx(classes.root, className)}>
            <div className={classes.container}>
                <div className={classes.route}>
                    <DesktopRoute
                        departureDate={order.pickupStop.datetime}
                        departureCity={rideInfo.from.desc as string}
                        departureStop={order.pickupStop.desc}
                        departureInfo={order.pickupStop.info}
                        arrivalDate={order.dischargeStop.datetime}
                        arrivalCity={rideInfo.to.desc as string}
                        arrivalStop={order.dischargeStop.desc}
                        arrivalInfo={order.dischargeStop.info}
                        compact={compact}
                    />

                    <Typo
                        className={classes.duration}
                        color="textSecondary"
                        component="div"
                    >
                        {!isMioTaxi && displayDuration}
                    </Typo>
                </div>

                <div className={classes.busInfo}>
                    {rideInfo.bus ? (
                        <DesktopOrderBusInfo
                            bus={rideInfo.bus}
                            tickets={order.tickets || []}
                        />
                    ) : null}
                </div>

                <div className={classes.orderInfo}>
                    <DesktopOrderInfo order={order} />

                    <div>
                        <Button
                            onClick={handleDetailsClick}
                            variant="outlined"
                            color="primary"
                        >
                            {t('order:details')}
                        </Button>
                    </div>
                </div>

                {showTicketButton && (order as any).url ? (
                    <div>
                        <Button
                            color="primary"
                            variant="contained"
                            href={(order as any).url}
                        >
                            {t('order:downloadTicket', {
                                context: country,
                            })}
                        </Button>
                    </div>
                ) : null}

                {showDepartureDate ? (
                    <Typo
                        variant="caption"
                        color="textSecondary"
                        className={classes.departureDate}
                        component="div"
                    >
                        {readableDate(rideInfo.departure)}
                    </Typo>
                ) : null}
            </div>
        </div>
    );
};
