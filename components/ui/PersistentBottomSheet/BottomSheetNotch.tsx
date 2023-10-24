import React, { FC } from 'react';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            display: 'flex',
            justifyContent: 'space-around',
        },
        notch: {
            width: 50,
            height: 5,
            borderRadius: 1000,
            background: theme.atlas.palette.divider.default,
        },
    }),
    { name: 'BottomSheetNotch' }
);

export type BottomSheetNotchProps = {
    className?: string;
};

export const BottomSheetNotch: FC<BottomSheetNotchProps> = props => {
    const { className } = props;
    const classes = useStyles();

    return (
        <div className={clsx(classes.root, className)}>
            <div className={classes.notch} />
        </div>
    );
};
