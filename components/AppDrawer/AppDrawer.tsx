import React, { FC } from 'react';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useRouter } from 'next/router';

import { List } from 'components/ui/List/List';
import { useMobileRoutes } from 'hooks/useMobileRoutes';
import { Logo } from '../Logo';
import { CarbusLink } from '../CarbusLink';
import { PwaInstallButton } from 'components/PWAInstallButton';
import { iOS, isCordova, isPWA } from 'utils/platform';
import { usePWA } from 'hooks/usePWA';
import { usePlatform } from 'hooks/usePlatform';

const useStyles = makeStyles(
    (theme: Theme) => ({
        /* Styles applied to the root element. */
        root: {},
        /* Styles applied to the `List` component. */
        list: {
            minWidth: 250,
        },
        /* Pseudo-class applied to the `ListItem` component if `selected={true}`. */
        itemSelected: {
            '&.Mui-selected, &.Mui-selected:hover': {
                backgroundColor: 'unset',
                color: theme.palette.primary.main,
            },
        },
        /* Styles applied to the logo `div` element. */
        logo: {
            padding: theme.spacing(1, 2),
            minHeight: 56,
            display: 'flex',
            alignItems: 'center',
        },
    }),
    { name: 'AppDrawer' }
);

type Props = {
    className?: string;
    open?: boolean;
    onClose: () => void;
};

export const AppDrawer: FC<Props> = props => {
    const { open, onClose, className } = props;
    const classes = useStyles();
    const router = useRouter();
    const routes = useMobileRoutes();
    const {
        pwaSaaSEnabled,
        pwaPromptWasDeferred,
        status: pwaInstallStatus,
    } = usePWA();
    const { inWebView } = usePlatform();

    const showPWAInstallButton =
        pwaSaaSEnabled &&
        pwaPromptWasDeferred &&
        pwaInstallStatus !== 'dismissed' &&
        (!iOS() && !isPWA() && !isCordova && !inWebView);

    const listItemClasses = {
        selected: classes.itemSelected,
    };

    const handleRoute = (pathname: string) => () => {
        router.push(pathname);
        onClose();
    };

    const renderItems = () => (
        <div className={clsx(classes.list)} role="presentation">
            <List>
                {routes.map(route => (
                    <React.Fragment key={route.pathname}>
                        {['/login', '/profile'].includes(route.pathname) ? (
                            <Divider />
                        ) : null}
                        <ListItem
                            onClick={handleRoute(route.pathname)}
                            classes={listItemClasses}
                            button
                            selected={route.pathname === router.pathname}
                        >
                            <ListItemIcon>{route.iconComponent}</ListItemIcon>
                            <ListItemText primary={route.label} />
                        </ListItem>
                    </React.Fragment>
                ))}

                <CarbusLink />
            </List>
        </div>
    );

    return (
        <div className={clsx(classes.root, className)}>
            <Drawer anchor="left" open={open} onClose={onClose}>
                <div className={classes.logo} onClick={onClose}>
                    <Logo dark mini />
                </div>

                <Divider />

                {renderItems()}

                <Divider />

                {showPWAInstallButton ? (
                    <List>
                        <ListItem>
                            <PwaInstallButton />
                        </ListItem>
                    </List>
                ) : null}
            </Drawer>
        </div>
    );
};
