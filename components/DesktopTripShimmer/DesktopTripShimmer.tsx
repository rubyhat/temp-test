import React, { FC } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';

import { Stub } from 'components/Stub/Stub';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            background: '#fff',
            borderRadius: 3,
            boxShadow: theme.atlas.shadows.bottom,
            padding: theme.spacing(2),
        },
        /* Styles applied to the container `div` element. */
        container: {
            display: 'flex',
            justifyContent: 'space-between',
        },
        /* Styles applied to the route `div` element. */
        route: {
            width: 245,
            height: 15,
        },
        /* Styles applied to the details `div` element. */
        details: {
            width: 152,
            height: 15,
        },
        /* Styles applied to the benefits `div` element. */
        benefits: {
            width: 139,
            height: 15,
            marginTop: theme.spacing(1),
        },
        /* Styles applied to the price `div` element. */
        price: {
            width: 47,
            height: 15,
        },
        /* Styles applied to the pricePerSeat `div` element. */
        pricePerSeat: {
            width: 56,
            height: 15,
            marginTop: theme.spacing(1),
        },
        /* Styles applied to the priceButton `div` element. */
        priceButton: {
            width: 187,
            height: 52,
        },
    }),
    { name: 'DesktopTripShimmer' }
);

type Props = {
    className?: string;
};

export const DesktopTripShimmer: FC<Props> = props => {
    const { className } = props;
    const classes = useStyles();

    return (
        <div className={clsx(classes.root, className)}>
            <div className={classes.container}>
                <div className={classes.route}>
                    <Stub />
                </div>

                <div>
                    <div className={classes.details}>
                        <Stub />
                    </div>
                    <div className={classes.benefits}>
                        <Stub />
                    </div>
                </div>

                <div>
                    <div className={classes.price}>
                        <Stub />
                    </div>
                    <div className={classes.pricePerSeat}>
                        <Stub />
                    </div>
                </div>

                <div className={classes.priceButton}>
                    <Stub />
                </div>
            </div>
        </div>
    );
};
