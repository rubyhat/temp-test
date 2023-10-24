import React, { FC } from 'react';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { DesktopRouteItem } from './DesktopRouteItem';
import { SearchDto } from 'swagger/client';
import { useRideWithFilters } from 'hooks/useRideWithFilters';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            backgroundColor: theme.palette.common.white,
            border: `1px solid ${theme.atlas.palette.background.blueGray10}`,
            borderRadius: theme.atlas.borderRadius.medium,
            padding: theme.spacing(1),
        },
        /* Styles applied to the `DesktopRouteItem` component. */
        routeItem: {
            marginTop: theme.spacing(2),
        },
    }),
    { name: 'DesktopRouteCard' }
);

type DesktopRouteCardProps = {
    className?: string;
    ride: SearchDto;
};

export const DesktopRouteCard: FC<DesktopRouteCardProps> = props => {
    const { className, ride } = props;
    const classes = useStyles();

    const {
        departureDate,
        arrivalDate,
        pickupStopName,
        dischargeStopName,
    } = useRideWithFilters(ride);

    return (
        <div className={clsx(classes.root, className)}>
            <DesktopRouteItem
                datetime={departureDate}
                city={ride.from.desc}
                stop={pickupStopName}
                type="pickup"
            />

            <DesktopRouteItem
                className={classes.routeItem}
                datetime={arrivalDate}
                city={ride.to.desc}
                stop={dischargeStopName}
                type="dropoff"
            />
        </div>
    );
};
