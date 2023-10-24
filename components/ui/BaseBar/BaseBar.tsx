import React, { FC, ReactNode } from 'react';
import AppBar, { AppBarProps } from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles, Theme } from '@material-ui/core/styles';
import upperFirst from 'lodash/upperFirst';
import clsx from 'clsx';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    // @ts-ignore
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            boxShadow: 'unset',
        },
        paddingTop: {
            ...theme.atlas.appBar.paddingTop(0),
        },
        /* Styles applied to the root element if `color="default"`. */
        colorDefault: {
            backgroundColor: theme.palette.background.paper,
            color: theme.atlas.palette.text.base,
        },
        /* Styles applied to the root element if `shadow="bottom"`. */
        shadowBottom: {
            boxShadow: theme.atlas.shadows.bottom,
        },
        /* Styles applied to the root element if `shadow="top"`. */
        shadowTop: {
            boxShadow: theme.atlas.shadows.top,
        },
        /* Styles applied to the root element if `shadow="none"`. */
        shadowNone: {
            boxShadow: 'none',
        },
        /* Styles applied to the `Toolbar` component. */
        toolbar: {
            ...theme.atlas.typography.body1,
            fontWeight: 700,
            justifyContent: ' space-between',
        },
    }),
    { name: 'BaseBar' }
);

export type Props = {
    className?: string;
    children?: ReactNode;
    color?: AppBarProps['color'];
    position?: AppBarProps['position'];
    shadow?:
        | keyof Pick<AtlasTheme['atlas']['shadows'], 'bottom' | 'top'>
        | 'none';
    paddingTop?: boolean;
};

export const BaseBar: FC<Props> = props => {
    const {
        className,
        children = null,
        color = 'default',
        position = 'static',
        shadow = 'bottom',
        paddingTop = true,
    } = props;
    const classes = useStyles();

    return (
        <AppBar
            position={position}
            color={color}
            classes={{
                root: clsx(classes.root, {
                    // @ts-ignore
                    [classes[`shadow${upperFirst(shadow)}`]]: !!shadow,
                    [classes.paddingTop]: paddingTop,
                }),
                colorDefault: classes.colorDefault,
            }}
            className={className}
        >
            <Toolbar className={classes.toolbar}>{children}</Toolbar>
        </AppBar>
    );
};
