import React, { useEffect } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { NextPage } from 'next';
import { makeStyles } from '@material-ui/core/styles';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import {
    ReviewOrdersState,
    ReviewOrdersStatus,
} from 'store/reviews/review-orders';
import Layout from 'layouts/navigation';
import SnackbarProvider from 'components/ui/Snackbar/SnackbarProvider';
import { AppBar } from 'components/AppBar';
import { Button } from 'components/ui/Button';
import { NotifyDialog } from 'components/NotifyDialog';
import { NotifyPaper } from 'components/NotifyPaper';
import { OrderDto } from 'swagger/client';
import { ReviewPaper } from 'components/reviews/ReviewPaper';
import { RootState } from 'store';
import { Snackbar } from 'components/ui/Snackbar/Snackbar';
import { useReviewDialog } from 'hooks/useReviewDialog';
import { useTranslation } from 'i18n';

const useStyles = makeStyles(
    theme => ({
        /* Styles applied to the root element. */
        root: {
            marginTop: 16,
            marginBottom: 16,
        },
        /* Styles applied to the loading `div` element when `reviewOrdersStatus === ReviewOrdersStatus.FETCHING`. */
        loading: {
            marginTop: theme.spacing(2),
            textAlign: 'center',
        },
        ReviewPaper: {
            padding: theme.spacing(2),
            backgroundColor: theme.palette.common.white,
        },
    }),
    { name: 'ReviewOrders' }
);

type Props = {};

const ReviewOrders: NextPage<Props> = () => {
    const classes = useStyles();
    const { t } = useTranslation();
    const router = useRouter();

    const { orders, status: reviewOrdersStatus } = useSelector<
        RootState,
        ReviewOrdersState
    >(rootState => rootState.reviewOrders);
    const order: OrderDto | undefined = orders[0];

    const handleBack = () => {
        handleClose();
        router.replace('/');
    };
    const reload = () => router.reload();

    const { handleClose } = useReviewDialog();

    // Scroll fix
    useEffect(() => {
        document.body.style.overflow = 'auto';
    }, []);

    return (
        <Layout>
            <SnackbarProvider>
                <div className={classes.root}>
                    <AppBar
                        title={t('reviewOrder')}
                        position="fixed"
                        textCenter
                        onBack={handleBack}
                    />

                    {reviewOrdersStatus === ReviewOrdersStatus.FETCHING ? (
                        <div className={classes.loading}>
                            <CircularProgress />
                        </div>
                    ) : reviewOrdersStatus === ReviewOrdersStatus.SUCCESS ? (
                        order ? (
                            <ReviewPaper className={classes.ReviewPaper} />
                        ) : (
                            <NotifyPaper title={t('noReviewsTitle')} />
                        )
                    ) : reviewOrdersStatus === ReviewOrdersStatus.ERROR ? (
                        <NotifyDialog
                            open={true}
                            title={t('order:somethingWentWrong')}
                            subtitle={t('order:somethingWentWrongDesc')}
                            actions={
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <Button
                                            onClick={reload}
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                        >
                                            {t('check')}
                                        </Button>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Button
                                            onClick={handleBack}
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
                    ) : null}

                    <Snackbar />
                </div>
            </SnackbarProvider>
        </Layout>
    );
};

export default ReviewOrders;
