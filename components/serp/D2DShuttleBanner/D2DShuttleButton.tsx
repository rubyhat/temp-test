import React, { FC } from 'react';
import Button, { ButtonProps } from '@material-ui/core/Button';
import clsx from 'clsx';
import { fade, makeStyles, Theme } from '@material-ui/core/styles';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            ...theme.atlas.typography.body1,
            boxShadow: 'unset',
            minHeight: 48,
            textTransform: 'unset',
            borderRadius: theme.atlas.borderRadius.medium,
            '&:hover': {
                boxShadow: 'unset',
            },
        },
        /* Styles applied to the root element if `variant="contained"`. */
        contained: {
            fontWeight: 700,
            '&.Mui-focusVisible': {
                boxShadow: 'unset',
            },

            backgroundColor: fade(theme.palette.common.white, 0.25),
            color: theme.palette.common.white,

            '&:hover': {
                backgroundColor: fade(theme.palette.common.white, 0.35),
            },
            '&:active': {
                backgroundColor: fade(theme.palette.common.white, 0.35),
            },
        },
    }),
    { name: 'D2DShuttleButton' }
);

type D2DShuttleButtonProps = Omit<ButtonProps, 'variant' | 'classes'>;

export const D2DShuttleButton: FC<D2DShuttleButtonProps> = props => {
    const { className, ...other } = props;
    const classes = useStyles();

    return (
        <Button
            className={clsx(classes.root, className)}
            classes={{
                contained: classes.contained,
            }}
            variant="contained"
            {...other}
        />
    );
};
