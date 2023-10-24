import React, { FC } from 'react';
import clsx from 'clsx';
import parseISO from 'date-fns/parseISO';
import { makeStyles, Theme } from '@material-ui/core/styles';

import DropoffPoint from 'components/icons/DropoffPoint';
import PickupPoint from 'components/icons/PickupPoint';
import { VerticalDottedLine } from './VerticalDottedLine';
import { format } from 'utils/date';
import { useSAAS } from 'hooks/useSAAS';
import { AtlasTheme } from 'typings/atlas-theme';

const iconSize = 24;
const iconPadding = 5;

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {},
        container: {
            display: 'flex',
        },

        timeColumn: {
            width: 52,
        },
        time: {
            ...theme.atlas.typography.body4,
            fontWeight: theme.typography.fontWeightMedium,
            color: theme.atlas.palette.background.blueGray80,
        },
        date: {
            ...theme.atlas.typography.body6,
            color: theme.atlas.palette.background.blueGray60,
        },

        iconColumn: {
            width: 32,
            position: 'relative',
        },
        icon: {},
        verticalDottedLine: {
            position: 'absolute',
            left: iconSize / 2 - 1,
            top: iconSize - iconPadding + 1,
        },

        destinationColumn: {},
        city: {
            ...theme.atlas.typography.body4,
            fontWeight: theme.typography.fontWeightMedium,
            color: theme.atlas.palette.text.base,
        },
        stop: {
            ...theme.atlas.typography.body6,
            color: theme.atlas.palette.text.base60,
        },
    }),
    { name: 'DesktopRouteItem' }
);

type DesktopRouteItemProps = {
    className?: string;
    /** Departure or arrival time (ISO 8601 standard) **/
    datetime: string;
    /** City name **/
    city: string;
    /** Stop name **/
    stop: string;
    /** Point type **/
    type: 'pickup' | 'dropoff';
};

export const DesktopRouteItem: FC<DesktopRouteItemProps> = props => {
    const { datetime, city, stop, className, type } = props;
    const classes = useStyles();
    const { isMioTaxi } = useSAAS();

    const dateObj = parseISO(datetime);

    const date = format(dateObj, 'd MMM');
    const time = format(dateObj, 'HH:mm');

    return (
        <div className={clsx(classes.root, className)}>
            <div className={classes.container}>
                <div className={classes.timeColumn}>
                    {isMioTaxi && type === 'dropoff' ? null : (
                        <div className={classes.time}>{time}</div>
                    )}
                    <div className={classes.date}>{date}</div>
                </div>

                <div className={classes.iconColumn}>
                    {type === 'pickup' ? (
                        <VerticalDottedLine
                            className={classes.verticalDottedLine}
                            dots={9}
                        />
                    ) : null}

                    {type === 'pickup' ? (
                        <PickupPoint className={classes.icon} />
                    ) : (
                        <DropoffPoint className={classes.icon} />
                    )}
                </div>

                <div className={classes.destinationColumn}>
                    <div className={classes.city}>{city}</div>
                    <div className={classes.stop}>{stop}</div>
                </div>
            </div>
        </div>
    );
};
