import React, { useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Router, { useRouter } from 'next/router';
import { NextPage } from 'next';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';

import {
    RIDE_ERROR,
    RIDE_FETCHING,
    RIDE_POLLING,
    RIDE_SUCCESS,
    RideState,
} from 'store/ride/types';
import { BookingStep, useD2dBookingGuard } from 'hooks/useD2dBookingGuard';
import { Button } from 'components/ui/Button';
import { DenyBookingDialog } from 'components/DenyBookingDialog';
import { NotifyDialog } from 'components/NotifyDialog';
import { OverlayShimmer } from 'components/OverlayShimmer';
import { RootState } from 'store';
import { bookingInit } from 'store/booking/actions';
import { useTranslation } from 'i18n';

const useStyles = makeStyles(
    () => ({
        root: {},
    }),
    { name: 'D2DBooking' }
);

const D2DBooking: NextPage = () => {
    const classes = useStyles();
    const router = useRouter();
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const { rideInfo: ride, status } = useSelector<RootState, RideState>(
        rootState => rootState.ride
    );

    const initBooking = () => {
        const {
            id,
            from,
            to,
            date,
            passengers,
            pickup,
            discharge,
        } = router.query as QueryParams;

        dispatch(
            bookingInit({
                numberOfPassengers: Number(passengers || 0),
                rideId: id,
                fromId: from,
                toId: to,
                date,
                pickup,
                discharge,
            })
        );
    };

    const goToSearch = () => {
        Router.replace('/');
    };
    const refetchRide = () => initBooking();

    useEffect(() => {
        initBooking();
    }, []);

    useEffect(() => {
        const bookingAvailable =
            ride && ride.bookingAvailable && ride.bookingAvailable.available;

        if (status === RIDE_SUCCESS && bookingAvailable) {
            router.replace({
                pathname: BookingStep.Pickup,
                query: {
                    ...router.query,
                },
            });
        }
    }, [status]);

    useD2dBookingGuard();

    if (status === RIDE_FETCHING || status === RIDE_POLLING) {
        return <OverlayShimmer open={true} text={t('booking:sendingOrder')} />;
    }

    if (status === RIDE_ERROR) {
        return (
            <NotifyDialog
                open={true}
                title={t('booking:somethingWentWrong')}
                subtitle={t('booking:somethingWentWrongDesc')}
                actions={
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Button
                                onClick={goToSearch}
                                variant="outlined"
                                color="primary"
                                fullWidth
                            >
                                {t('booking:backToSearch')}
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Button
                                onClick={refetchRide}
                                variant="contained"
                                color="secondary"
                                fullWidth
                            >
                                {t('booking:check')}
                            </Button>
                        </Grid>
                    </Grid>
                }
            />
        );
    }

    // status === RIDE_SUCCESS
    return (
        <div className={classes.root}>
            {ride ? (
                <DenyBookingDialog
                    availability={ride.bookingAvailable}
                    ride={ride}
                />
            ) : null}
        </div>
    );
};

type QueryParams = {
    id: string;
    passengers: string;
    from: string;
    to: string;
    date: string;
    pickup?: string;
    discharge?: string;
};

D2DBooking.getInitialProps = async () => {
    return {
        namespacesRequired: [
            'booking',
            'auth',
            'profile',
            'formErrors',
            'brand',
            'search',
        ],
    };
};

export default D2DBooking;
