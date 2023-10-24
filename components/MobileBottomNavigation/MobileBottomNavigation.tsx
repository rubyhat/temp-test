import React, { ChangeEvent, FC, ReactElement } from 'react';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root `BottomNavigation` component. */
        root: {
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            boxShadow: theme.atlas.shadows.top,
            ...theme.atlas.bottomBar.height(56),
            ...theme.atlas.bottomBar.paddingBottom(0),
        },
        /* Styles applied to the `BottomNavigationAction` component. */
        actionRoot: {
            color: theme.atlas.palette.text.minor,
            minWidth: 'unset',
        },
        /* Styles applied to the `BottomNavigationAction` component. */
        actionLabel: {
            fontSize: theme.atlas.typography.micro.fontSize,
            fontWeight: 700,
            marginTop: theme.spacing(0.5),
            '&.Mui-selected': {
                fontSize: theme.atlas.typography.micro.fontSize,
            },
        },
    }),
    { name: 'MobileBottomNavigation' }
);

type MobileBottomNavigationItem = {
    pathname: string;
    label: string;
    iconComponent: ReactElement;
};

type Props = {
    // Router pathname
    value: string;
    onChange: (pathname: string) => void;
    items: MobileBottomNavigationItem[];
};

export const MobileBottomNavigation: FC<Props> = props => {
    const { value, onChange, items } = props;
    const classes = useStyles();

    const handleChange = (event: ChangeEvent<{}>, value: string) => {
        onChange(value);
    };

    const renderItems = () =>
        items.map(item => (
            <BottomNavigationAction
                classes={{
                    root: classes.actionRoot,
                    label: classes.actionLabel,
                }}
                value={item.pathname}
                key={item.pathname}
                label={item.label}
                icon={item.iconComponent}
            />
        ));

    return (
        <BottomNavigation
            value={value}
            onChange={handleChange}
            showLabels
            className={classes.root}
        >
            {renderItems()}
        </BottomNavigation>
    );
};
