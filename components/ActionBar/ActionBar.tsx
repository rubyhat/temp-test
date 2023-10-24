import React, { FC, ReactNode } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';
import upperFirst from 'lodash/upperFirst';
import { AtlasTheme } from 'typings/atlas-theme';
const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            boxShadow: theme.atlas.shadows.top,
            minHeight: 88,
            padding: 16,
            boxSizing: 'border-box',
            backgroundColor: '#FFF',
            zIndex: theme.zIndex.appBar,
            ...theme.atlas.bottomBar.paddingBottom(16),
        },
        /* Styles applied to the root element if `position="fixed"`. */
        positionFixed: {
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
        },
        /* Styles applied to the root element if `position="absolute"`. */
        positionAbsolute: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
        },
        /* Styles applied to the root element if `position="sticky"`. */
        positionSticky: {
            // ⚠️ sticky is not supported by IE 11.
            position: 'sticky',
            bottom: 0,
            left: 0,
            right: 0,
        },
        /* Styles applied to the root element if `position="static"`. */
        positionStatic: {
            position: 'static',
            transform: 'translateZ(0)', // Make sure we can see the elevation.
        },
        /* Styles applied to the root element if `position="relative"`. */
        positionRelative: {
            position: 'relative',
        },
    }),
    { name: 'ActionBar' }
);

type Props = {
    children: ReactNode;
    position?: 'fixed' | 'absolute' | 'sticky' | 'static' | 'relative';
};

export const ActionBar: FC<Props> = props => {
    const { children, position = 'fixed' } = props;
    const classes = useStyles();

    return (
        <div
            className={clsx(classes.root, {
                // @ts-ignore
                [classes[`position${upperFirst(position)}`]]: true,
            })}
        >
            {children}
        </div>
    );
};
