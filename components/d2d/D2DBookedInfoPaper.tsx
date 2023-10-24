import React, { FC } from 'react';
import ErrorIcon from '@material-ui/icons/Error';
import clsx from 'clsx';
import { TFunction } from 'next-i18next';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { OrderDto, OrdersResponseDto, RideDto } from 'swagger/client';
import { formatDaysHoursMinutes } from 'utils/time';
import { useTranslation } from 'i18n';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            background: theme.atlas.gradients.active,
            borderRadius: theme.atlas.borderRadius.medium,
            padding: theme.spacing(2),
            color: theme.palette.text.secondary,
        },
        container: {
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
        },
        icon: {
            marginRight: theme.spacing(2),
        },
    }),
    { name: 'D2DBookedInfoPaper' }
);

type D2DBookedInfoPaperProps = {
    ride: RideDto;
    order: OrderDto | OrdersResponseDto;
    className?: string;
};

export const D2DBookedInfoPaper: FC<D2DBookedInfoPaperProps> = props => {
    const { className, ride, order } = props;
    const { pickupStop, dischargeStop } = order;
    const classes = useStyles();
    const { t } = useTranslation();

    const timeBeforeDeparture = calculateTimeBeforeDeparture(
        ride.dynamicConfig.prepareTime,
        t
    );

    return (
        <div className={clsx(classes.root, className)}>
            <div className={classes.container}>
                <ErrorIcon className={classes.icon} color="primary" />

                {pickupStop.dynamic && dischargeStop.dynamic ? (
                    <div>
                        {t('order:d2dBookedInfoPaperPickupDischargeStopText', {
                            time: timeBeforeDeparture,
                        })}
                    </div>
                ) : pickupStop.dynamic ? (
                    <div>
                        {t('order:d2dBookedInfoPaperPickupStopText', {
                            time: timeBeforeDeparture,
                        })}
                    </div>
                ) : dischargeStop.dynamic ? (
                    <div>
                        {t('order:d2dBookedInfoPaperDischargeStopText', {
                            time: timeBeforeDeparture,
                        })}
                    </div>
                ) : null}
            </div>
        </div>
    );
};

function calculateTimeBeforeDeparture(totalMinutes: number, t: TFunction) {
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = Math.floor(totalMinutes % 60);

    return formatDaysHoursMinutes(
        {
            days,
            hours,
            minutes,
        },
        t
    );
}
