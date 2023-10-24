import React, { useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { LoginForm } from 'components/LoginForm';
import { Snackbar } from 'components/ui/Snackbar/Snackbar';
import SnackbarProvider from 'components/ui/Snackbar/SnackbarProvider';
import Layout from 'layouts/navigation';
import { usePlatform } from 'hooks/usePlatform';
import { Desktop } from 'layouts/desktop';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {},
        /* Styles applied to the login form `div` element. */
        form: {
            marginTop: theme.spacing(2),
        },
        /* Styles applied to the `LoginForm` component (desktop). */
        desktopLoginForm: {
            maxWidth: 700,
            padding: theme.spacing(4),
            borderRadius: theme.shape.borderRadius,
            boxShadow: theme.atlas.shadows.bottom,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    }),
    { name: 'Login' }
);

type Props = {};

const Login: NextPage<Props> = () => {
    const classes = useStyles();
    const router = useRouter();
    const { isDesktop } = usePlatform();

    const handleLogin = () => router.push('/');

    // Scroll fix
    useEffect(() => {
        document.body.style.overflow = 'auto';
    }, []);

    if (isDesktop) {
        return (
            <Desktop>
                <div>
                    <SnackbarProvider>
                        <LoginForm
                            className={classes.desktopLoginForm}
                            onLogin={handleLogin}
                            autocompleteCountryCode
                            disableForgotPassword
                        />

                        <Snackbar />
                    </SnackbarProvider>
                </div>
            </Desktop>
        );
    }

    return (
        <Layout>
            <div className={classes.root}>
                <SnackbarProvider>
                    <div className={classes.form}>
                        <LoginForm
                            onLogin={handleLogin}
                            autocompleteCountryCode
                            disableForgotPassword
                        />
                    </div>

                    <Snackbar />
                </SnackbarProvider>
            </div>
        </Layout>
    );
};

Login.getInitialProps = async () => {
    return {
        namespacesRequired: ['auth', 'brand'],
    };
};

export default Login;
