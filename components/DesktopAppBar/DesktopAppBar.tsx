import React, { FC, useState } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import { Snackbar } from '../ui/Snackbar/Snackbar';
import SnackbarProvider from '../ui/Snackbar/SnackbarProvider';
import { BaseBar } from '../ui/BaseBar';
import { Button } from 'components/ui/Button';
import { CarbusLink } from '../CarbusLink';
import { LoginForm } from '../LoginForm';
import { Logo } from 'components/Logo';
import { ResponsiveDialog } from '../ui/ResponsiveDialog';
import { RootState } from 'store';
import { UserState } from 'store/user/types';
import { useTranslation } from 'i18n';
import { useDesktopRoutes } from '../../hooks/useDesktopRoutes';
import { toggleZammad } from '../../utils/toggleZammad';

const useStyles = makeStyles(
    (theme: Theme) => ({
        /* Styles applied to the root element. */
        root: {
            backgroundColor: '#FFF',
            height: 80,
            zIndex: theme.zIndex.appBar,
        },
        /* Styles applied to the `Container` component. */
        container: {
            display: 'flex',
            alignItems: 'center',
            height: '100%',
        },
        /* Styles applied to the left menu `div` element. */
        leftMenu: {
            marginLeft: 60,
        },
        /* Styles applied to the right menu `div` element. */
        rightMenu: {
            marginLeft: 'auto',
        },
        /* Pseudo-class applied to the root element if variant="fixed" */
        variantFixed: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
        },
        authDialog: {
            padding: theme.spacing(4),
        },
    }),
    { name: 'DesktopAppBar' }
);

type Props = {
    variant?: 'static' | 'fixed';
};

export const DesktopAppBar: FC<Props> = props => {
    const { variant = 'static' } = props;
    const classes = useStyles();
    const router = useRouter();
    const { t } = useTranslation();
    const { phoneNumber } = useSelector<RootState, UserState>(
        rootState => rootState.user
    );
    const isLoggedIn = !!phoneNumber;

    const { menu1, menu2 } = useDesktopRoutes(isLoggedIn);

    const [loginDialogOpen, setLoginDialogOpen] = useState(false);
    const [redirectTo, setRedirectTo] = useState('');
    const handleDialogClose = () => {
        document.body.style.overflow = 'auto';
        setLoginDialogOpen(false);
    };
    const handleLoginSuccess = () => {
        if (redirectTo) {
            router.push(redirectTo);
        }

        setRedirectTo('');
        document.body.style.overflow = 'auto';
        setLoginDialogOpen(false);
    };

    const handleRoute = (pathname: string) => () => {
        if (pathname.substring(0, 22) === 'https://help.atlasbus.') {
            window.open(pathname, '_blank');
            return;
        }

        if (pathname === '/onlineChat') {
            toggleZammad();
        } else {
            if (
                (pathname === '/orders' ||
                    pathname === '/profile' ||
                    pathname === '/login') &&
                !isLoggedIn
            ) {
                if (pathname !== '/login') setRedirectTo(pathname);
                document.body.style.overflow = 'true';
                setLoginDialogOpen(true);
                return;
            }

            router.push(pathname);
        }
    };

    return (
        <div
            className={clsx(classes.root, {
                [classes.variantFixed]: variant === 'fixed',
            })}
        >
            <Container className={classes.container}>
                <Logo dark />

                <div className={classes.leftMenu}>
                    {menu1.map(item => (
                        <Button
                            key={item.pathname}
                            startIcon={item.iconComponent}
                            onClick={handleRoute(item.pathname)}
                        >
                            {item.label}
                        </Button>
                    ))}
                </div>

                <div className={classes.rightMenu}>
                    {menu2.map(item => (
                        <Button
                            key={item.pathname}
                            startIcon={item.iconComponent}
                            onClick={handleRoute(item.pathname)}
                            className={item.className || ''}
                        >
                            {item.label}
                        </Button>
                    ))}

                    <CarbusLink />
                </div>
            </Container>

            <ResponsiveDialog
                open={loginDialogOpen}
                onClose={handleDialogClose}
                position="center"
                fullScreen={false}
                maxWidth="md"
                BarComponent={
                    <BaseBar>
                        <div>{t('loginOrSignUp')}</div>

                        <IconButton
                            edge="end"
                            color="primary"
                            onClick={handleDialogClose}
                        >
                            <CloseIcon />
                        </IconButton>
                    </BaseBar>
                }
            >
                <SnackbarProvider>
                    <LoginForm
                        className={classes.authDialog}
                        disableRememberMe
                        autocompleteCountryCode
                        disableForgotPassword
                        onLogin={handleLoginSuccess}
                    />

                    <Snackbar />
                </SnackbarProvider>
            </ResponsiveDialog>
        </div>
    );
};
