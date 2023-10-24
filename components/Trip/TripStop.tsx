import React, { FC } from 'react';
import clsx from 'clsx';
import parseISO from 'date-fns/parseISO';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { format } from 'utils/date';
import { useTranslation } from 'i18n';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {},
        /* Styles applied to the time container `div` element. */
        timeContainer: {
            display: 'flex',
            alignItems: 'center',
        },
        /* Pseudo-class applied to the time container element if `align="right"` */
        timeContainerAlignRight: {
            textAlign: 'right',
            flexDirection: 'row-reverse',
        },
        /* Styles applied to the time `div` element. */
        time: {
            fontSize: theme.atlas.typography.body2.fontSize,
            lineHeight: '22px',
            fontWeight: theme.typography.fontWeightBold,
        },
        /* Styles applied to the date `div` element. */
        date: {
            ...theme.atlas.typography.body6,
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
        },
        /* Styles applied to the city `div` element. */
        city: {
            ...theme.atlas.typography.body5,
            fontWeight: theme.typography.fontWeightMedium,
            marginTop: 4,
        },
        /* Pseudo-class applied to the city element if `align="right"` */
        cityAlignRight: {
            textAlign: 'right',
        },
        /* Styles applied to the stop `div` element. */
        stop: {
            ...theme.atlas.typography.body6,
            color: theme.atlas.palette.text.trinity,
            marginTop: 4,
        },
        /* Pseudo-class applied to the stop element if `align="right"` */
        stopAlignRight: {
            textAlign: 'right',
        },
    }),
    { name: 'TripStop' }
);

type TripStopProps = {
    className?: string;
    /** ISO 8601 **/
    datetime: string;
    /** City name **/
    city: string;
    /** Stop name **/
    stop: string;
    /** Отобразить дату рядом с временем **/
    showDate?: boolean;
    align?: 'left' | 'right';
    showArrivalTime?: boolean;
};

export const TripStop: FC<TripStopProps> = props => {
    const {
        className,
        align = 'left',
        datetime,
        city,
        stop,
        showDate,
        showArrivalTime = true,
    } = props;
    const classes = useStyles();
    const { t } = useTranslation();

    const dateObj = parseISO(datetime);
    const time = format(dateObj, 'HH:mm');
    const date = format(dateObj, 'd MMM, EEEEEE');

    return (
        <div className={clsx(classes.root, className)}>
            <div
                className={clsx(classes.timeContainer, {
                    [classes.timeContainerAlignRight]: align === 'right',
                })}
            >
                {showArrivalTime && <div className={classes.time}>{time}</div>}
                {showDate && <div className={classes.date}>{date}</div>}
            </div>

            <div
                className={clsx(classes.city, {
                    [classes.cityAlignRight]: align === 'right',
                })}
            >
                {city}
            </div>

            <div
                className={clsx(classes.stop, {
                    [classes.stopAlignRight]: align === 'right',
                })}
            >
                {stop}
            </div>
        </div>
    );
};
