import React, { useEffect } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { NextPage } from 'next';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import Layout from 'layouts/navigation';
import { AppBar } from 'components/AppBar';
import { Desktop } from 'layouts/desktop';
import { DesktopHeading } from 'components/DesktopHeading';
import { HelpMenuCard } from 'components/HelpMenuCard';
import {
    PARTNERS_FETCHING,
    PARTNERS_SUCCESS,
    PartnersState,
} from 'store/partners/types';
import { PartnersTable } from 'components/PartnersTable';
import { RootState } from 'store';
import { partnersFetching } from 'store/partners/actions';
import { usePlatform } from 'hooks/usePlatform';
import { useTranslation } from 'i18n';

const useStyles = makeStyles(
    (theme: Theme) => ({
        /* Styles applied to the root element. */
        root: {},
        /* Styles applied to the container `div` element. */
        container: {
            marginTop: 16,
            marginBottom: 16,
        },
        /* Styles applied to the loading `div` element when `status === PARTNERS_FETCHING`. */
        loading: {
            marginTop: theme.spacing(2),
            textAlign: 'center',
        },
    }),
    { name: 'Partners' }
);

const Partners: NextPage = () => {
    const classes = useStyles();
    const { t } = useTranslation();
    const { isMobile, isCordova } = usePlatform();
    const router = useRouter();
    const dispatch = useDispatch();
    const { status } = useSelector<RootState, PartnersState>(
        rootState => rootState.partners
    );

    const handleBack = () => router.replace('/help');

    useEffect(() => {
        dispatch(partnersFetching());
    }, []);

    if (isMobile || isCordova) {
        return (
            <Layout>
                <div className={classes.root}>
                    <AppBar
                        title={t('partners')}
                        position="fixed"
                        textCenter
                        onBack={handleBack}
                    />
                    <div className={classes.container}>
                        {status === PARTNERS_SUCCESS ? <PartnersTable /> : null}

                        {status === PARTNERS_FETCHING ? (
                            <div className={classes.loading}>
                                <CircularProgress />
                            </div>
                        ) : null}
                    </div>
                </div>
            </Layout>
        );
    } else {
        return (
            <Desktop>
                <DesktopHeading
                    pageTitle={t('partnersTitleBY')}
                    backUrl="/"
                    breadcrumbTitle={t('backToSearch')}
                />

                <Container>
                    <Grid container spacing={2}>
                        <Grid item md={4}>
                            <HelpMenuCard />
                        </Grid>

                        <Grid item md={8}>
                            {status === PARTNERS_SUCCESS ? (
                                <PartnersTable />
                            ) : null}

                            {status === PARTNERS_FETCHING ? (
                                <div className={classes.loading}>
                                    <CircularProgress />
                                </div>
                            ) : null}
                        </Grid>
                    </Grid>
                </Container>
            </Desktop>
        );
    }
};

export default Partners;
