import React, { FC } from 'react';
import Countdown from 'react-countdown';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { BusLocationDialog } from './BusLocationDialog';
import { OrderDto } from 'swagger/client';
import { Typo } from '../Typo/Typo';
import { formatDaysHoursMinutes } from 'utils/time';
import { useBusLocation } from '../useBusLocation';
import { useTranslation } from 'i18n';

const useStyles = makeStyles(
    (theme: Theme) => ({
        /* Styles applied to the root element. */
        root: {},
    }),
    { name: 'BusLocation' }
);

type Props = {
    order: OrderDto;
    bus: ReturnType<typeof useBusLocation>;
    className?: string;
};

export const BusLocation: FC<Props> = props => {
    const { order, bus, className } = props;
    const classes = useStyles();
    const { t } = useTranslation();

    return (
        <div className={clsx(classes.root, className)}>
            {bus.available ? (
                <BusLocationDialog
                    orderId={order.id}
                    pickupStop={order.pickupStop}
                    dischargeStop={order.dischargeStop}
                    BusLocationMapProps={{
                        enableGeolocateControl: true,
                    }}
                />
            ) : bus.willBeAvailableIn ? (
                <Countdown
                    key={bus.willBeAvailableInDate}
                    date={bus.willBeAvailableInDate}
                    autoStart
                    renderer={({ days, hours, minutes }) => (
                        <Typo color="textPrimary">
                            {t('order:geolocationWillBeAvailableIn', {
                                time: formatDaysHoursMinutes(
                                    {
                                        days,
                                        hours,
                                        minutes,
                                    },
                                    t
                                ),
                            })}
                        </Typo>
                    )}
                />
            ) : null}
        </div>
    );
};
