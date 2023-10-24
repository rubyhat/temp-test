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
        },
        /* Styles applied to the panel `div` element. */
        panel: {
            padding: theme.spacing(2),

            '& ~ &': {
                borderTop: `1px solid ${theme.palette.divider}`,
            },
        },
        /* Styles applied to the stub `div` element. */
        stub: {
            '& ~ &': {
                marginTop: theme.spacing(1),
            },
        },
        stub1: {
            width: 239,
            height: 15,
        },
        stub2: {
            width: 181,
            height: 15,
        },
        stub3: {
            width: 212,
            height: 15,
        },
    }),
    { name: 'DesktopFiltersShimmer' }
);

export const DesktopFiltersShimmer: FC = () => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <div className={classes.panel}>
                <div className={clsx(classes.stub, classes.stub1)}>
                    <Stub />
                </div>
            </div>

            <div className={classes.panel}>
                <div className={clsx(classes.stub, classes.stub2)}>
                    <Stub />
                </div>
            </div>

            <div className={classes.panel}>
                <div className={clsx(classes.stub, classes.stub3)}>
                    <Stub />
                </div>
            </div>
        </div>
    );
};
