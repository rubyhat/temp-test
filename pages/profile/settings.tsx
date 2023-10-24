import React from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

import { AppBar } from 'components/AppBar';
import { useTranslation } from 'i18n';
import { usePlatform } from 'hooks/usePlatform';
import { DesktopHeading } from 'components/DesktopHeading';
import { ProfileMenuCard } from 'components/ProfileMenuCard';
import { Desktop } from 'layouts/desktop';

import { ProfileDeleteAccountCard } from 'components/ProfileDeleteAccount/ProfileDeleteAccountCard';
import { ChangeLanguageCard } from 'components/ChangeLanguageCard';

import { AtlasTheme } from 'typings/atlas-theme';
const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {},
        /* Styles applied to the container `div` element. */
        marginTop: {
            ...theme.atlas.appBar.marginTop(24), // AppBar height + 24,
        },
        changeLanguageCard: {
            marginBottom: 10,
        },
        deleteAccountCard: {},
    }),
    { name: 'Settings' }
);

const Settings: NextPage = () => {
    const classes = useStyles();
    const { t } = useTranslation();
    const router = useRouter();
    const { isMobile, isCordova } = usePlatform();

    const handleBack = () => router.back();

    if (isMobile || isCordova) {
        return (
            <Container>
                <AppBar
                    title={t('profile:settings')}
                    position="fixed"
                    textCenter
                    onBack={handleBack}
                />

                <Grid container spacing={2}>
                    <Grid item xs={12} className={classes.marginTop}>
                        <Box className={classes.changeLanguageCard}>
                            <ChangeLanguageCard />
                        </Box>
                        <Box className={classes.deleteAccountCard}>
                            <ProfileDeleteAccountCard />
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        );
    } else {
        return (
            <Desktop>
                <DesktopHeading
                    pageTitle={t('profile:settings')}
                    backUrl="/"
                    breadcrumbTitle={t('backToSearch')}
                />

                <Container>
                    <Grid container spacing={2}>
                        <Grid item md={4}>
                            <ProfileMenuCard />
                        </Grid>

                        <Grid item md={8}>
                            <ProfileDeleteAccountCard />
                        </Grid>
                    </Grid>
                </Container>
            </Desktop>
        );
    }
};

export default Settings;
