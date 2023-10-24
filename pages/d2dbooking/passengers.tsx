import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Router, { useRouter } from 'next/router';
import parseISO from 'date-fns/parseISO';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { NextPage } from 'next';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';

import {
    BOOKING_ORDER_ERROR,
    BOOKING_ORDER_SENDING,
    BOOKING_ORDER_SUCCESS,
    BookingState,
} from 'store/booking/types';
import {
    RIDE_FETCHING,
    RIDE_POLLING,
    RIDE_SUCCESS,
    RideState,
} from 'store/ride/types';
import SnackbarProvider from 'components/ui/Snackbar/SnackbarProvider';
import { ActionBar } from 'components/ActionBar';
import { AppBar } from 'components/AppBar';
import { BookField } from 'components/NewPassenger';
import { BookParamsDto, RideDto } from 'swagger/client';
import { BookingAction } from 'components/BookingAction';
import { Button } from 'components/ui/Button';
import { CurrencySymbol } from 'utils/currency';
import { DenyBookingDialog } from 'components/DenyBookingDialog';
import { DocumentsState } from 'store/documents/types';
import { LoginForm } from 'components/LoginForm';
import { NewPassengerStep } from 'components/NewPassengerStep';
import { NotifyDialog } from 'components/NotifyDialog';
import { OverlayShimmer } from 'components/OverlayShimmer';
import { ResponsiveDialog } from 'components/ui/ResponsiveDialog';
import { RootState } from 'store';
import { Snackbar } from 'components/ui/Snackbar/Snackbar';
import { Typo } from 'components/Typo/Typo';
import { UserState } from 'store/user/types';
import { ValidBeforeDialog } from 'components/ValidBeforeDialog';
import { approximateRidePrice } from 'utils/booking';
import { bookingOrderSending } from 'store/booking/actions';
import { format } from 'utils/date';
import { useBookingSteps } from 'hooks/useBookingSteps';
import { useCountry } from 'hooks/useCountry';
import { useD2dBookingGuard } from 'hooks/useD2dBookingGuard';
import { useTranslation } from 'i18n';
import { BookingNotValidButton } from 'components/BookingNotValidButton';
import { checkValidPhone } from 'utils/phone';
import { useLoginSuggest } from 'hooks/useLoginSuggest';

const useStyles = makeStyles(
    (theme: Theme) => ({
        root: {
            marginBottom: 164,
        },
        passengerStep: {},
        loginDialogTitle: {
            marginTop: theme.spacing(1),
        },
        loginDialogSubtitle: {
            marginTop: theme.spacing(1),
        },
    }),
    { name: 'D2DBookingPassengers' }
);

const D2DBookingPassengers: NextPage = () => {
    const classes = useStyles();
    const router = useRouter();
    const { t } = useTranslation();
    const { country } = useCountry();
    const dispatch = useDispatch();
    const { phone } = useLoginSuggest();

    const { passengers, orderStatus } = useSelector<RootState, BookingState>(
        rootState => rootState.booking
    );
    const { rideInfo: ride, bookParams, status } = useSelector<
        RootState,
        RideState
    >(rootState => rootState.ride);
    const user = useSelector<RootState, UserState>(rootState => rootState.user);
    const { documents } = useSelector<RootState, DocumentsState>(
        rootState => rootState.documents
    );

    const isLoggedIn = !!user.phoneNumber;
    const numberOfPassengers = Object.keys(passengers || {}).length;

    const dialogTitle = ride ? `${ride.from.desc} – ${ride.to.desc}` : '';
    const dialogSubtitle = ride
        ? format(parseISO(ride.departure), 'd MMM, EEEEEE')
        : '';

    // Force login
    const [forceLoginDialog, setForceLoginDialog] = useState(false);
    const handleForceLogin = () => {
        setForceLoginDialog(false);
    };

    // Total price
    const [ticketsPrice, setTicketsPrice] = useState<number>(0);
    useEffect(() => {
        const startPrice = bookParams
            ? approximateRidePrice(bookParams, ride ? ride.paymentTypes : [])
            : 0;
        setTicketsPrice(startPrice);
    }, [bookParams]);
    const handleTicketsPriceChange = (price: number) => setTicketsPrice(price);

    const goToSearch = () => {
        Router.replace('/');
    };
    const handleBooking = () => {
        if (!isLoggedIn) setForceLoginDialog(true);
        dispatch(bookingOrderSending());
    };
    const handleAppBarBack = () => {
        router.back();
    };

    const { isPassengerStepCompleted } = useBookingSteps();
    const isBookingButtonLoading =
        orderStatus === BOOKING_ORDER_SENDING ||
        orderStatus === BOOKING_ORDER_SUCCESS;
    const isBookingButtonDisabled =
        isBookingButtonLoading || !isPassengerStepCompleted;

    const renderPassengersStep = (
        bookParams: BookParamsDto,
        rideInfo: RideDto
    ) => {
        return (
            <GoogleReCaptchaProvider
                reCaptchaKey={process.env.RECAPTCHA_V3_TOKEN}
            >
                <div className={classes.passengerStep}>
                    <SnackbarProvider>
                        <NewPassengerStep
                            bookFields={rideInfo.bookFields as BookField[]} // @todo Backend types
                            ticketTypes={bookParams.ticketTypes}
                            docTypes={bookParams.docTypes}
                            genderTypes={bookParams.genderTypes}
                            passengersNumber={numberOfPassengers}
                            currency={rideInfo.currency as CurrencySymbol} // @todo Backend types
                            documents={documents}
                            onTicketsPriceChange={handleTicketsPriceChange}
                        />
                        <Snackbar />
                    </SnackbarProvider>
                </div>
            </GoogleReCaptchaProvider>
        );
    };

    const renderActionBar = (rideInfo: RideDto) => {
        return (
            <ActionBar>
                <BookingAction
                    price={ticketsPrice}
                    currency={rideInfo.currency as CurrencySymbol} // @todo GDS
                    tickets={numberOfPassengers}
                    button={
                        (isLoggedIn || checkValidPhone(phone)) &&
                        isPassengerStepCompleted ? (
                            <Button
                                onClick={handleBooking}
                                color="primary"
                                fullWidth
                                variant="contained"
                                disabled={isBookingButtonDisabled}
                            >
                                {t('booking:continue')}
                            </Button>
                        ) : (
                            <SnackbarProvider>
                                <BookingNotValidButton>
                                    {t('booking:continue')}
                                </BookingNotValidButton>
                                <Snackbar />
                            </SnackbarProvider>
                        )
                    }
                />
            </ActionBar>
        );
    };

    useD2dBookingGuard();

    return (
        <div className={classes.root}>
            {status === RIDE_SUCCESS ? (
                <>
                    <AppBar
                        title={dialogTitle}
                        subtitle={dialogSubtitle}
                        titleOverflowHidden
                        shadow="none"
                        startIcon="back"
                        backAutoHide={false}
                        onBack={handleAppBarBack}
                    />

                    {renderPassengersStep(
                        bookParams as BookParamsDto,
                        ride as RideDto
                    )}

                    {renderActionBar(ride as RideDto)}
                </>
            ) : null}

            {/* Order */}
            {(status === RIDE_FETCHING ||
                status === RIDE_POLLING ||
                isBookingButtonLoading) && (
                <OverlayShimmer open={true} text={t('booking:sendingOrder')} />
            )}

            {orderStatus === BOOKING_ORDER_ERROR ? (
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
                        </Grid>
                    }
                />
            ) : null}

            {/* Force login */}
            <ResponsiveDialog
                open={forceLoginDialog}
                position="center"
                fullScreen={false}
                fullWidth={true}
            >
                <SnackbarProvider>
                    <LoginForm
                        header={
                            <>
                                <Typo
                                    variant="subtitle"
                                    weight="bold"
                                    align="center"
                                    className={classes.loginDialogTitle}
                                >
                                    {t('booking:littleMoreLeft')}
                                </Typo>

                                <Typo
                                    variant="body1"
                                    align="center"
                                    component="div"
                                    className={classes.loginDialogSubtitle}
                                >
                                    {t('booking:confirmYourNumber', {
                                        context: country,
                                    })}
                                </Typo>
                            </>
                        }
                        disableRememberMe
                        disableForgotPassword
                        onLogin={handleForceLogin}
                    />

                    <Snackbar />
                </SnackbarProvider>
            </ResponsiveDialog>

            {ride ? (
                <DenyBookingDialog
                    availability={ride.bookingAvailable}
                    ride={ride}
                />
            ) : null}

            {ride ? (
                <ValidBeforeDialog
                    departureDate={ride.departure}
                    departureTimezone={ride.from.timezone}
                    validBefore={ride.valid_before}
                />
            ) : null}
        </div>
    );
};

D2DBookingPassengers.getInitialProps = async () => {
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

export default D2DBookingPassengers;
