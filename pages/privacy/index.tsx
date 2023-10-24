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
import { usePlatform } from 'hooks/usePlatform';
import { Desktop } from 'layouts/desktop';
import { DesktopHeading } from 'components/DesktopHeading';
import { HelpMenuCard } from 'components/HelpMenuCard';
import { AtlasTheme } from 'typings/atlas-theme';
import { PolicyState } from 'store/saasPolicyInfo/types';
import CircularProgress from '@material-ui/core/CircularProgress';

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

const Privacy: NextPage = () => {
    const { t } = useTranslation();
    const classes = useStyles();
    const { isMobile, isCordova } = usePlatform();

    const router = useRouter();
    const handleBack = () => router.replace('/help');
    const { link: policyLink } = useSelector<RootState, PolicyState>(
        rootState => rootState.policy
    );

    if (isMobile || isCordova) {
        return (
            <Layout>
                <div className={classes.root}>
                    <AppBar
                        title={t('termsOfPrivacy')}
                        position="fixed"
                        textCenter
                        onBack={handleBack}
                    />
                    <div className={classes.container}>
                        {policyLink ? (
                            <iframe
                                className={classes.iframe}
                                title="ps"
                                src={policyLink}
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
                    pageTitle={t('termsOfPrivacy')}
                    backUrl="/"
                    breadcrumbTitle={t('backToSearch')}
                />

                <Container>
                    <Grid container spacing={2}>
                        <Grid item md={4}>
                            <HelpMenuCard />
                        </Grid>

                        <Grid item md={8}>
                            {!policyLink && <CircularProgress />}
                            {policyLink ? (
                                <div className={classes.desktopCard}>
                                    <iframe
                                        className={classes.iframe}
                                        title="ps"
                                        src={policyLink}
                                    />
                                </div>
                            ) : null}
                        </Grid>
                    </Grid>
                </Container>
            </Desktop>
        );
    }
};

Privacy.getInitialProps = async () => {
    return {
        namespacesRequired: ['auth', 'brand'],
    };
};

export default Privacy;
