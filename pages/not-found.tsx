import React from 'react';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { NextPage } from 'next';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useRouter } from 'next/router';

import Layout from 'layouts/navigation';
import { Button } from 'components/ui/Button';
import { Desktop } from 'layouts/desktop';
import { NotifyPaper } from 'components/NotifyPaper';
import { usePlatform } from 'hooks/usePlatform';
import { useTranslation } from 'i18n';

const useStyles = makeStyles((theme: Theme) => ({
    container: {
        flex: 1,
    },
}));

const NotFound: NextPage = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const { isCordova, isMobile } = usePlatform();
    const classes = useStyles();

    const goToSearch = () => {
        router.push('/');
    };

    const notifyPaper = (
        <Box
            display="flex"
            justifyContent="center"
            flexDirection="column"
            height="100%"
        >
            <NotifyPaper
                title={t('pageNotFound')}
                subtitle={t('pageNotFoundDesc')}
                actions={
                    <Grid container spacing={2} justify="space-around">
                        <Grid item xs={12} md={4}>
                            <Button
                                onClick={goToSearch}
                                variant="outlined"
                                color="primary"
                                fullWidth
                            >
                                {t('backToSearch')}
                            </Button>
                        </Grid>
                    </Grid>
                }
            />
        </Box>
    );

    if (isCordova || isMobile) {
        return (
            <Layout fullHeight>
                <Container className={classes.container}>
                    {notifyPaper}
                </Container>
            </Layout>
        );
    } else {
        return <Desktop fullHeight>{notifyPaper}</Desktop>;
    }
};

export default NotFound;
