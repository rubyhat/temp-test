import React, { useEffect } from 'react';
import Router, { useRouter } from 'next/router';
import { NextPage } from 'next';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import { AppBar } from 'components/AppBar';
import { milesFetching } from 'store/miles/actions';
import { useTranslation } from 'i18n';
import { usePlatform } from 'hooks/usePlatform';
import { DesktopHeading } from 'components/DesktopHeading';
import { ProfileMenuCard } from 'components/ProfileMenuCard';
import { MilesBalance } from 'components/MilesBalance/MilesBalance';
import { Desktop } from 'layouts/desktop';
import { RootState } from 'store';
import { BrandState } from 'store/brand/types';
import { isCordova, isServer } from 'utils/platform';
import NotFound from 'pages/not-found';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {},
        /* Styles applied to the container `div` element. */
        container: {
            ...theme.atlas.appBar.marginTop(16), // AppBar height + 16,
            marginBottom: 16,
        },
        /* Styles applied to the content `div` element. */
        content: {
            marginTop: theme.spacing(3),
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(2),
            color: theme.atlas.palette.text.minor,
            fontSize: theme.atlas.typography.body1.fontSize,
        },
        /* Styles applied to the `MilesBalance` component. */
        desktopMilesBalance: {
            borderRadius: theme.shape.borderRadius,
            boxShadow: theme.atlas.shadows.bottom,
            marginBottom: theme.spacing(3),
        },
        /* Styles applied to the content `div` element (desktop). */
        desktopContent: {
            color: theme.atlas.palette.text.minor,
            fontSize: theme.atlas.typography.body1.fontSize,
            '& > *:first-child': {
                marginTop: 0,
            },
        },
    }),
    { name: 'Miles' }
);

type Props = {
    statusCode?: number;
};

const Miles: NextPage<Props> = props => {
    const { statusCode } = props;
    const classes = useStyles();
    const { t } = useTranslation();
    const router = useRouter();
    const dispatch = useDispatch();
    const { isMobile, isCordova } = usePlatform();
    const { brandName } = useSelector<RootState, BrandState>(
        rootState => rootState.brand
    );

    useEffect(() => {
        dispatch(milesFetching());
    }, []);

    // Scroll fix
    useEffect(() => {
        document.body.style.overflow = 'auto';
    }, []);

    const handleBack = () => router.back();

    if (statusCode === 404) {
        return <NotFound />;
    }

    if (isMobile || isCordova) {
        return (
            <div className={classes.root}>
                <AppBar
                    title={t('profile:myMiles')}
                    position="fixed"
                    textCenter
                    onBack={handleBack}
                />

                <div className={classes.container}>
                    <MilesBalance />

                    <div
                        className={classes.content}
                        dangerouslySetInnerHTML={{
                            __html: t('brand:milesAbout', {
                                context: brandName,
                            }),
                        }}
                    />
                </div>
            </div>
        );
    } else {
        return (
            <Desktop>
                <DesktopHeading
                    pageTitle={t('profile:myMiles')}
                    backUrl="/"
                    breadcrumbTitle={t('backToSearch')}
                />

                <Container>
                    <Grid container spacing={2}>
                        <Grid item md={4}>
                            <ProfileMenuCard />
                        </Grid>

                        <Grid item md={8}>
                            <MilesBalance
                                className={classes.desktopMilesBalance}
                            />

                            <div
                                className={classes.desktopContent}
                                dangerouslySetInnerHTML={{
                                    __html: t('brand:milesAbout', {
                                        context: brandName,
                                    }),
                                }}
                            />
                        </Grid>
                    </Grid>
                </Container>
            </Desktop>
        );
    }
};

Miles.getInitialProps = async props => {
    const { store, res } = props;

    // Вернуть 404 для SaaS партнеров у которых
    // которые не поддерживают "Мили"
    let statusCode = 200;
    if (isServer && !isCordova && res) {
        const { partner } = store.getState().brand;
        const isMilesDisabled =
            partner && partner.meta && !partner.meta.milesDisabled;

        if (!isMilesDisabled) {
            statusCode = 404;
            res.statusCode = 404;
        }
    }

    const { user } = store.getState();
    const isLoggedIn = !!user.phoneNumber;

    if (!isLoggedIn) {
        if (process.browser) {
            Router.replace('/login');
        }
    }

    return {
        namespacesRequired: ['profile', 'brand'],
        statusCode,
    };
};

export default Miles;
