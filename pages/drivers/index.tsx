import React, { useRef, useEffect } from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { NextPage } from 'next';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { Desktop } from 'layouts/desktop';
import { DesktopHeading } from 'components/DesktopHeading';
import { HelpMenuCard } from 'components/HelpMenuCard';
import { useTranslation } from 'i18n';
import Head from 'next/head';
import { useSAAS } from 'hooks/useSAAS';
import NotFound from 'pages/not-found';
import { isCordova, isServer } from 'utils/platform';
import { AtlasTheme } from 'typings/atlas-theme';

import Layout from 'layouts/navigation';
import { usePlatform } from 'hooks/usePlatform';
import { AppBar } from 'components/AppBar';
import { useRouter } from 'next/router';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {},
        desktopCard: {
            backgroundColor: '#FFF',
            borderRadius: theme.shape.borderRadius,
            boxShadow: theme.atlas.shadows.bottom,
            padding: theme.spacing(2),
        },
        iframe: {
            width: '100%',
            minHeight: 1000,
        },
    }),
    { name: 'Drivers' }
);

type Props = {
    statusCode?: number;
};

const Drivers: NextPage<Props> = props => {
    const { statusCode } = props;

    const classes = useStyles();
    const { t } = useTranslation();
    const { meta } = useSAAS();
    const { isMobile, isCordova } = usePlatform();

    const router = useRouter();
    const handleBack = () => router.replace('/help');

    // Scroll fix
    useEffect(() => {
        document.body.style.overflow = 'auto';
    }, []);

    if (statusCode === 404) {
        return <NotFound />;
    }

    if (isMobile || isCordova) {
        return (
            <Layout>
                <AppBar
                    title={t('forDrivers')}
                    position="fixed"
                    textCenter
                    onBack={handleBack}
                />
                <Container>
                    <Grid item md={8}>
                        <div className={classes.desktopCard}>
                            {meta.driversIframeURL ? (
                                <iframe
                                    title="Атлас для водителей"
                                    src={meta.driversIframeURL}
                                    frameBorder="0"
                                    name="ya-form-5e4aa2b46a3a830112c15228"
                                    className={classes.iframe}
                                />
                            ) : null}
                        </div>
                    </Grid>
                    {/* </Grid> */}
                </Container>
            </Layout>
        );
    } else {
        return (
            <Desktop>
                <Head>
                    <script src="https://yastatic.net/q/forms-frontend-ext/_/embed.js" />
                </Head>
                <DesktopHeading
                    pageTitle={t('forDrivers')}
                    backUrl="/"
                    breadcrumbTitle={t('backToSearch')}
                />
                <Container>
                    <Grid container spacing={2}>
                        <Grid item md={4}>
                            <HelpMenuCard />
                        </Grid>

                        <Grid item md={8}>
                            <div className={classes.desktopCard}>
                                {meta.driversIframeURL ? (
                                    <iframe
                                        title="Атлас для водителей"
                                        src={meta.driversIframeURL}
                                        frameBorder="0"
                                        name="ya-form-5e4aa2b46a3a830112c15228"
                                        className={classes.iframe}
                                    />
                                ) : null}
                            </div>
                        </Grid>
                    </Grid>
                </Container>
            </Desktop>
        );
    }
};

Drivers.getInitialProps = async ctx => {
    const { res, store } = ctx;

    // Вернуть 404 для SaaS партнеров которые не указали
    // ссылку на страницу "Для водителей"
    let statusCode = 200;
    if (isServer && !isCordova && res) {
        const { partner } = store.getState().brand;
        const hasSaaSDriversPage =
            partner && partner.meta && (partner.meta as any).driversURL;

        if (!hasSaaSDriversPage) {
            statusCode = 404;
            res.statusCode = 404;
        }
    }

    return {
        namespacesRequired: ['auth', 'brand'],
        statusCode,
    };
};

export default Drivers;
