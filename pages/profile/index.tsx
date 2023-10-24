import React, { useEffect } from 'react';
import { NextPage } from 'next';
import Router, { useRouter } from 'next/router';
import { batch, useDispatch, useSelector } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Cookies from 'universal-cookie';

import { ProfileMenuList } from 'components/ProfileMenuList';
import { useTranslation } from 'i18n';
import { authReset } from 'store/auth/actions';
import { userFetching, userLogout } from 'store/user/actions';
import Layout from 'layouts/navigation';
import { ProfileCard } from 'components/ProfileCard';
import { RootState } from 'store';
import { UserState } from 'store/user/types';
import { usePlatform } from 'hooks/usePlatform';
import { Desktop } from 'layouts/desktop';
import { DesktopHeading } from 'components/DesktopHeading';
import { ProfileMenuCard } from 'components/ProfileMenuCard';
import { useSAAS } from 'hooks/useSAAS';
import { milesFetching } from 'store/miles/actions';
import { ReferralMilesBalance } from 'components/referral/ReferralMilesBalance';
import { ReferralPromocode } from 'components/referral/ReferralPromocode';
import { userReferralFetch, UserReferralState } from 'store/user-referral';
import SnackbarProvider from 'components/ui/Snackbar/SnackbarProvider';
import { Snackbar } from 'components/ui/Snackbar/Snackbar';
import { DebuggingMenu } from 'components/DebuggingMenu';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {},
        /* Styles applied to the container `div` element. */
        container: {
            marginTop: 16,
            marginBottom: 16,
            padding: '0 16px',
        },
        DebuggingMenu: {
            marginTop: theme.spacing(2),
        },
        marginTop: {
            marginTop: theme.spacing(2),
        },
        desktopProfileCard: {
            borderRadius: theme.shape.borderRadius,
            boxShadow: theme.atlas.shadows.bottom,
            padding: theme.spacing(2),
        },
        ReferralMilesBalance: {
            marginTop: theme.spacing(2),
        },
        ReferralPromocode: {
            marginTop: theme.spacing(2),
        },
    }),
    { name: 'Profile' }
);

type Props = {};

const cookies = new Cookies();
const referralPromocodeDebugCookieKey = 'referral-promocode-debug';

const Profile: NextPage<Props> = () => {
    const classes = useStyles();
    const router = useRouter();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { phoneNumber, isAdmin } = useSelector<RootState, UserState>(
        rootState => rootState.user
    );
    const { isMobile, isCordova } = usePlatform();
    const { meta } = useSAAS();

    const {
        available: userReferralPromocodeAvailable,
        status: userReferralPromocodeStatus,
    } = useSelector<RootState, UserReferralState>(
        rootState => rootState.userReferral
    );

    const handleProfileItemClick = (pathname: string) => {
        if (pathname === '/logout') {
            batch(() => {
                dispatch(authReset());
                dispatch(userLogout());
            });

            router.push('/');

            return;
        }

        router.push(pathname);
    };

    const items = [
        { pathname: '/profile/settings', label: t('profile:settings') },
        { pathname: '/profile/passengers', label: t('profile:myPassengers') },
        { pathname: '/profile/cards', label: t('profile:myCreditCards') },
        {
            pathname: '/profile/miles',
            label: t('profile:myMiles'),
            disabled: meta.milesDisabled,
        },
        {
            pathname: '/profile/rating',
            label: t('profile:myKarma'),
            disabled: meta.ratingDisabled,
        },
        { pathname: '/logout', label: t('profile:logout') },
    ].filter(page => !page.disabled);

    useEffect(() => {
        dispatch(userFetching());
    }, []);

    useEffect(() => {
        dispatch(milesFetching());
    }, []);

    useEffect(() => {
        dispatch(userReferralFetch());
    }, []);

    // Scroll fix
    useEffect(() => {
        document.body.style.overflow = 'auto';
        document.body.classList.remove('ptr--top');
    }, []);

    if (isMobile || isCordova) {
        return (
            <Layout>
                <div className={classes.root}>
                    <div className={classes.container}>
                        <ProfileCard phone={phoneNumber} />

                        <ProfileMenuList
                            className={classes.marginTop}
                            items={items}
                            onClick={handleProfileItemClick}
                        />

                        {isAdmin ? (
                            <DebuggingMenu
                                className={classes.DebuggingMenu}
                                onClick={pathname => router.push(pathname)}
                            />
                        ) : null}

                        {!meta.milesDisabled ? (
                            <ReferralMilesBalance
                                className={classes.ReferralMilesBalance}
                            />
                        ) : null}

                        {!meta.milesDisabled &&
                        userReferralPromocodeAvailable &&
                        userReferralPromocodeStatus === 'success' ? (
                            <SnackbarProvider>
                                <ReferralPromocode
                                    className={classes.ReferralPromocode}
                                />

                                <Snackbar />
                            </SnackbarProvider>
                        ) : null}
                    </div>
                </div>
            </Layout>
        );
    } else {
        return (
            <Desktop>
                <DesktopHeading
                    pageTitle={t('profile')}
                    backUrl="/"
                    breadcrumbTitle={t('backToSearch')}
                />

                <Container>
                    <Grid container spacing={2}>
                        <Grid item md={4}>
                            <ProfileMenuCard />
                        </Grid>

                        <Grid item md={8}>
                            <ProfileCard
                                className={classes.desktopProfileCard}
                                phone={phoneNumber}
                            />
                        </Grid>
                    </Grid>
                </Container>
            </Desktop>
        );
    }
};

Profile.getInitialProps = async props => {
    const { store, res = null } = props;

    const { user } = store.getState();
    const isLoggedIn = !!user.phoneNumber;

    if (!isLoggedIn) {
        if (process.browser) {
            Router.replace('/login');
        }
    }

    return {
        namespacesRequired: ['profile', 'brand'],
    };
};

export default Profile;
