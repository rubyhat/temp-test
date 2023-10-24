import React from 'react';
import { useSelector } from 'react-redux';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useTranslation } from 'i18n';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import Layout from 'layouts/navigation';
import { AppBar } from 'components/AppBar';
import { RootState } from 'store';
import { CountryState } from 'store/country/types';
import { usePlatform } from 'hooks/usePlatform';
import { Desktop } from 'layouts/desktop';
import { DesktopHeading } from 'components/DesktopHeading';
import { HelpMenuCard } from 'components/HelpMenuCard';
import { useSAAS } from 'hooks/useSAAS';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {},
        /* Styles applied to the container `div` element. */
        container: {
            ...theme.atlas.appBar.paddingTop(56), // AppBar height + 16,
            ...theme.atlas.bottomBar.paddingBottom(56),
            height: `100vh`,
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100vw',
        },
        iframe: {
            border: 'none',
            width: '100%',
            height: '100%',
        },
        desktopCard: {
            backgroundColor: '#FFF',
            borderRadius: theme.shape.borderRadius,
            boxShadow: theme.atlas.shadows.bottom,
            padding: theme.spacing(2),
            height: 'calc(100vh - 120px - 64px - 16px)', // Desktop container height - DesktopHeading height - offset
        },
    }),
    { name: 'ToC' }
);

const Terms: NextPage = () => {
    const { t } = useTranslation();
    const classes = useStyles();
    const { isMobile, isCordova } = usePlatform();
    const { country } = useSelector<RootState, CountryState>(
        rootState => rootState.country
    );
    const { meta } = useSAAS();
    const iframeLink = meta.termsIframeURL[country];

    const router = useRouter();
    const handleBack = () => router.replace('/help');

    if (isMobile || isCordova) {
        return (
            <Layout>
                <div className={classes.root}>
                    <AppBar
                        title={t('termsOfUse')}
                        position="fixed"
                        textCenter
                        onBack={handleBack}
                    />
                    <div className={classes.container}>
                        {iframeLink ? (
                            <iframe
                                className={classes.iframe}
                                title="ps"
                                src={iframeLink}
                            />
                        ) : null}
                    </div>
                </div>
            </Layout>
        );
    } else {
        return (
            <Desktop>
                <DesktopHeading
                    pageTitle={t('termsOfUse')}
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
                                {iframeLink ? (
                                    <iframe
                                        className={classes.iframe}
                                        title="ps"
                                        src={iframeLink}
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

Terms.getInitialProps = async () => {
    return {
        namespacesRequired: ['auth', 'brand'],
    };
};

export default Terms;
