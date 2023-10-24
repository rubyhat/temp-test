import React, { FC } from 'react';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { Stub } from '../Stub/Stub';

const useStyles = makeStyles(
    (theme: Theme) => ({
        /* Styles applied to the root element. */
        root: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: theme.spacing(2),
            minWidth: 120,
            height: 85,
            [theme.breakpoints.up('md')]: {
                minWidth: 148,
            },
            textAlign: 'left',
            alignItems: 'flex-start',
        },
        price: {
            width: 77,
            height: 20,
        },
        date: {
            width: 77,
            height: 15,
        },
    }),
    { name: 'PriceCalendarShimmer' }
);

type Props = {
    className?: string;
};

export const PriceCalendarShimmer: FC<Props> = props => {
    const { className } = props;
    const classes = useStyles();

    return (
        <div className={clsx(classes.root, className)}>
            <div className={classes.price}>
                <Stub />
            </div>
            <div className={classes.date}>
                <Stub />
            </div>
        </div>
    );
};
