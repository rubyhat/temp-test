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

            backgroundColor: theme.palette.common.white,
            color: theme.palette.primary.main,

            '&:hover': {
                backgroundColor: fade(theme.palette.common.white, 0.9),
            },
            '&:active': {
                backgroundColor: fade(theme.palette.common.white, 0.9),
            },
        },
    }),
    { name: 'D2DAppButton' }
);

type D2DAppButtonProps = Omit<ButtonProps, 'variant' | 'classes'>;

export const D2DAppButton: FC<D2DAppButtonProps> = props => {
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
