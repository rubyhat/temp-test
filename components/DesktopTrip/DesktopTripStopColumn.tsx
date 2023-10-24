import React, { FC } from 'react';
import clsx from 'clsx';
import parseISO from 'date-fns/parseISO';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { format } from 'utils/date';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {},
        timeContainer: {
            display: 'flex',
            alignItems: 'center',
        },
        time: {
            ...theme.atlas.typography.header2,
            fontWeight: theme.typography.fontWeightBold,
        },
        date: {
            ...theme.atlas.typography.body6,
            marginLeft: theme.spacing(1),
        },
        city: {
            ...theme.atlas.typography.body4,
            fontWeight: theme.typography.fontWeightMedium,
            marginTop: 4,
        },
        stop: {
            ...theme.atlas.typography.body5,
            color: theme.palette.text.secondary,
            marginTop: 4,
        },
    }),
    { name: 'DesktopTripStopColumn' }
);

type DesktopTripStopColumnProps = {
    className?: string;
    /** ISO 8601 **/
    datetime: string;
    /** City name **/
    city: string;
    /** Stop name **/
    stop: string;
    /** Отобразить дату рядом с временем **/
    showDate?: boolean;
    showArrivalTime?: boolean;
};

export const DesktopTripStopColumn: FC<DesktopTripStopColumnProps> = props => {
    const {
        className,
        datetime,
        city,
        stop,
        showDate,
        showArrivalTime = true,
    } = props;
    const classes = useStyles();

    const dateObj = parseISO(datetime);
    const time = format(dateObj, 'HH:mm');
    const date = format(dateObj, 'd MMM, EEEEEE');

    return (
        <div className={clsx(classes.root, className)}>
            <div className={classes.timeContainer}>
                {showArrivalTime && <div className={classes.time}>{time}</div>}
                {showDate && <div className={classes.date}>{date}</div>}
            </div>

            <div className={classes.city}>{city}</div>

            <div className={classes.stop}>{stop}</div>
        </div>
    );
};
