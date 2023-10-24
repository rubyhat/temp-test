import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useTranslation } from 'i18n';

import { AtlasTheme } from 'typings/atlas-theme';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

import { AppBar } from 'components/AppBar';
import { LanguageSwittcherAsList } from 'components/LanguageSwittcherAsList';

import { usePlatform } from 'hooks/usePlatform';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {},
        languageListCard: {
            ...theme.atlas.appBar.marginTop(24), // AppBar height + 24,
        },
    }),
    { name: 'LanguageSettings' }
);

const LanguageSettings: NextPage = () => {
    const { t } = useTranslation();
    const classes = useStyles();
    const { isMobile, isCordova } = usePlatform();
    const router = useRouter();

    const handleBack = () => router.back();

    // Страница выбора языка доступна только на моб. сайте и в приложении
    React.useEffect(() => {
        !isMobile && !isCordova && router.push('/profile');
    }, [isMobile, isCordova, router]);

    if (isMobile || isCordova) {
        return (
            <Container>
                <Box className={classes.root}>
                    <AppBar
                        title={t('languageSettingsInApp')}
                        position="fixed"
                        textCenter
                        onBack={handleBack}
                    />

                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Box className={classes.languageListCard}>
                                <LanguageSwittcherAsList />
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        );
    } else {
        return <div></div>;
    }
};

export default LanguageSettings;
