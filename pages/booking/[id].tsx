import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import Router, { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import parseISO from 'date-fns/parseISO';
import Grid from '@material-ui/core/Grid';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import NoSsr from '@material-ui/core/NoSsr';

import { BookParamsDto, RecaptchaResponseDto, RideDto } from 'swagger/client';
import { AppBar } from 'components/AppBar';
import { MobileStepper } from 'components/ui/MobileStepper/MobileStepper';
import { NewPassengerStep } from 'components/NewPassengerStep';
import { RootState } from 'store';
import {
    BOOKING_ORDER_ERROR,
    BOOKING_ORDER_SENDING,
    BOOKING_ORDER_SUCCESS,
    BookingState,
} from 'store/booking/types';
import {
    bookingInit,
    bookingOrderSending,
    bookingUpdateState,
} from 'store/booking/actions';
import { ActionBar } from 'components/ActionBar';
import { BookingAction } from 'components/BookingAction';
import { OverlayShimmer } from 'components/OverlayShimmer';
import {
    RIDE_ERROR,
    RIDE_FETCHING,
    RIDE_POLLING,
    RIDE_SUCCESS,
    RIDE_UPDATING,
    RideState,
} from 'store/ride/types';
import { Button } from 'components/ui/Button';
import { NotifyDialog } from 'components/NotifyDialog';
import { UserState } from 'store/user/types';
import { ResponsiveDialog } from 'components/ui/ResponsiveDialog';
import { LoginForm } from 'components/LoginForm';
import { BookField } from 'components/NewPassenger';
import { useTranslation } from 'i18n';
import { format } from 'utils/date';
import { CurrencySymbol } from 'utils/currency';
import { DocumentsState } from 'store/documents/types';

import { Typo } from 'components/Typo/Typo';
import { BookingStopsStep } from 'components/BookingStopsStep';
import { useBookingSteps } from 'hooks/useBookingSteps';
import { useCancelBooking } from 'hooks/useCancelBooking';

import SnackbarProvider from 'components/ui/Snackbar/SnackbarProvider';
import { Snackbar } from 'components/ui/Snackbar/Snackbar';
import { usePlatform } from 'hooks/usePlatform';
import { DesktopHeading } from 'components/DesktopHeading';
import { DesktopRoute } from 'components/DesktopRoute';
import { DesktopBookingRouteCard } from 'components/DesktopBookingRouteCard';
import { DesktopStepper } from 'components/DesktopStepper';
import { DesktopPassengersStep } from 'components/DesktopPassengersStep';
import { Desktop } from 'layouts/desktop';
import { CancelBookingDialog } from 'components/CancelBookingDialog';
import { ValidBeforeDialog } from 'components/ValidBeforeDialog';
import { DenyBookingDialog } from 'components/DenyBookingDialog';
import { useCountry } from 'hooks/useCountry';
import { BookingRideDetailsDialog } from 'components/BookingRideDetailsDialog';
import { rideMinPrice } from 'utils/ride';
import { D2DAppBanner } from 'components/serp/D2DAppBanner';
import { useSAAS } from 'hooks/useSAAS';
import { BookingNotValidButton } from 'components/BookingNotValidButton';
import { useLoginSuggest } from 'hooks/useLoginSuggest';
import { checkValidPhone } from 'utils/phone';
import { MobileSeatStep } from 'components/MobileSeatStep';
import { Divider } from '@material-ui/core';
import { PassengerAndSeatNumber } from 'components/PassengerAndSeatNumber';
import { SelectSeatsNoSeatsCard } from 'components/SelectSeatsNoSeatsCard';

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
        marginTop: {
            marginTop: theme.spacing(2),
        },
        /* Styles applied to the step `BookingStopsStep` component (mobile only). */
        bookingStopsStep: {
            marginTop: theme.spacing(2),
        },
        /* Styles applied to the `D2DAppBanner` (desktop). */
        d2dAppBanner: {
            marginTop: theme.spacing(2),
        },
        desktopBookingRouteCard: {
            borderRadius: theme.spacing(1),
        },
        submitButton: {
            borderRadius: theme.spacing(1),
        },
        seatingSchemeWrap: {
            padding: theme.spacing(2),
            borderRadius: theme.spacing(1),
            background: '#fff',
            [theme.breakpoints.up('md')]: {
                boxShadow:
                    '0px 1px 8px 1px rgba(0, 0, 0, 0.08), 0px 0px 16px 2px rgba(0, 0, 0, 0.04), 0px -1px 2px rgba(0, 0, 0, 0.04)',
                margin: theme.spacing(2),
            },
        },
        divider: {
            margin: '24px 0',
            background: '#e2e2e2',
        },
    }),
    { name: 'Booking' }
);

const Booking: NextPage = () => {
    const classes = useStyles();
    const router = useRouter();
    const { t } = useTranslation();
    const { country } = useCountry();
    const { isDesktop } = usePlatform();
    const { meta, isMioTaxi } = useSAAS();
    const { phone } = useLoginSuggest();

    const {
        passengers,
        orderStatus,
        seatingRequired,
        selectedSeats,
    } = useSelector<RootState, BookingState>(rootState => rootState.booking);
    const { rideInfo: ride, bookParams, status } = useSelector<
        RootState,
        RideState
    >(rootState => rootState.ride);
    const user = useSelector<RootState, UserState>(rootState => rootState.user);
    const { documents } = useSelector<RootState, DocumentsState>(
        rootState => rootState.documents
    );
    const {
        steps,
        completed,
        disabled,
        activeStep,
        handleStep,
        isPassengersStep,
        isPassengerStepCompleted,
        isSeatsStep,
        isStopsStep,
    } = useBookingSteps();
    const dispatch = useDispatch();

    const isSeatingSchemeEnable = () => {
        if (ride && ride.seatingScheme) {
            return ride.seatingScheme;
        }
        return [];
    };

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

    // CancelBooking
    const { cancelDialogOpen, setCancelDialogOpen } = useCancelBooking();
    const handleCancelDialogClose = () => {
        document.body.style.overflow = 'auto';
        setCancelDialogOpen(false);
    };

    // Ride details dialog
    const [rideDetailsOpen, setRideDetailsOpen] = useState(false);

    // Total price
    const [ticketsPrice, setTicketsPrice] = useState<number>(0);
    useEffect(() => {
        const startPrice = bookParams
            ? bookParams.ticketTypes.reduce(
                  (acc, tt) =>
                      acc +
                      rideMinPrice(
                          tt[0].price,
                          tt[0].onlinePrice,
                          ride ? ride.paymentTypes : []
                      ),
                  0
              )
            : 0;
        setTicketsPrice(startPrice);
    }, [bookParams]);
    const handleTicketsPriceChange = (price: number) => setTicketsPrice(price);

    const goToSearch = () => {
        document.body.style.overflow = 'auto';
        setCancelDialogOpen(false);
        router.beforePopState(() => true);
        if (window.history.length > 1) {
            Router.back();
        } else {
            Router.replace('/');
        }
    };
    const initBooking = () => {
        const {
            id: queryId,
            from,
            to,
            date,
            passengers,
            pickup,
            discharge,
        } = router.query as QueryParams;

        //TODO: remove after editing the backend
        const id = queryId.replace('compas', 'atlas');

        dispatch(
            bookingInit({
                numberOfPassengers: Number(passengers || 0),
                rideId: id,
                fromId: from,
                toId: to,
                date,
                pickup,
                discharge,
                seatingScheme: (ride && ride.seatingScheme) || undefined,
                seatingRequired: Boolean(ride && ride.seatingRequired),
            })
        );
    };
    const refetchRide = () => initBooking();
    const handleBooking = () => {
        if (!isLoggedIn) setForceLoginDialog(true);
        dispatch(bookingOrderSending());
    };
    const handleAppBarCancel = () => {
        setCancelDialogOpen(true);
    };

    useEffect(() => {
        initBooking();
    }, []);

    useEffect(() => {
        dispatch(
            bookingUpdateState({
                seatingRequired: (ride && ride.seatingRequired) || false,
            })
        );
    }, [ride, dispatch]);

    const isEnoughSeats = ride && ride.freeSeats >= numberOfPassengers;
    const isBookingButtonLoading =
        orderStatus === BOOKING_ORDER_SENDING ||
        orderStatus === BOOKING_ORDER_SUCCESS;
    const isBookingButtonDisabled =
        isBookingButtonLoading ||
        !completed[activeStep] ||
        (isSeatingSchemeEnable().length > 0 &&
            seatingRequired &&
            selectedSeats.length !== numberOfPassengers &&
            !isEnoughSeats);

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
                            paymentTypes={rideInfo.paymentTypes}
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
                        isStopsStep ? (
                            <Button
                                onClick={() => handleStep(1)}
                                color="primary"
                                fullWidth
                                variant="contained"
                                disabled={!completed[activeStep]}
                            >
                                {t('booking:continue')}
                            </Button>
                        ) : isPassengersStep ? (
                            (isLoggedIn || checkValidPhone(phone)) &&
                            isPassengerStepCompleted ? (
                                <Button
                                    onClick={() =>
                                        isSeatingSchemeEnable().length > 0 &&
                                        seatingRequired
                                            ? handleStep(2)
                                            : handleBooking()
                                    }
                                    color="primary"
                                    fullWidth
                                    variant="contained"
                                    disabled={
                                        !isSeatingSchemeEnable().length &&
                                        isBookingButtonDisabled
                                    }
                                >
                                    {t('booking:continue')}
                                </Button>
                            ) : (
                                <>
                                    <SnackbarProvider>
                                        <BookingNotValidButton>
                                            {t('booking:continue')}
                                        </BookingNotValidButton>
                                        <Snackbar />
                                    </SnackbarProvider>
                                </>
                            )
                        ) : (
                            <Button
                                onClick={handleBooking}
                                color="primary"
                                fullWidth
                                variant="contained"
                                disabled={
                                    !completed[activeStep] ||
                                    isBookingButtonDisabled
                                }
                            >
                                {t('booking:continue')}
                            </Button>
                        )
                    }
                />
            </ActionBar>
        );
    };

    if (isDesktop)
        return (
            <Desktop>
                {(status === RIDE_SUCCESS || status === RIDE_UPDATING) &&
                ride &&
                bookParams ? (
                    <>
                        <DesktopHeading
                            pageTitle={
                                activeStep === 0
                                    ? isMioTaxi
                                        ? 'Откуда вас забрать?'
                                        : t('booking:pickupDropoffPoints')
                                    : t('booking:passengers')
                            }
                            backUrl="/"
                            useRouterBack
                            breadcrumbTitle={t('goBack')}
                        />

                        <Container>
                            <Grid container spacing={2}>
                                <Grid item md={4}>
                                    <DesktopBookingRouteCard
                                        className={
                                            classes.desktopBookingRouteCard
                                        }
                                        departureDate={ride.departure}
                                        departureTimezone={
                                            ride.from.timezone as string // @todo type
                                        }
                                        arrivalDate={
                                            ride.arrival as string // @todo type
                                        }
                                        arrivalTimezone={
                                            ride.to.timezone as string // @todo type
                                        }
                                        passengers={numberOfPassengers}
                                        route={
                                            <DesktopRoute
                                                departureDate={ride.departure}
                                                arrivalDate={
                                                    ride.arrival as string // @todo type
                                                }
                                                departureCity={
                                                    ride.from.desc || '' // @todo GDS type
                                                } // @todo back types
                                                arrivalCity={
                                                    ride.to.desc || '' // @todo GDS type
                                                }
                                            />
                                        }
                                        price={ticketsPrice}
                                        currency={
                                            ride.currency as CurrencySymbol
                                        }
                                    />

                                    {!isMioTaxi && (
                                        <DesktopStepper
                                            className={classes.marginTop}
                                            activeStep={activeStep}
                                            completed={completed}
                                            disabled={disabled} // @todo disabled
                                            onChange={handleStep}
                                            steps={steps}
                                        />
                                    )}
                                    {isStopsStep ? (
                                        <Button
                                            onClick={() => handleStep(1)}
                                            color="primary"
                                            fullWidth
                                            variant="contained"
                                            disabled={!completed[activeStep]}
                                            className={classes.submitButton}
                                        >
                                            {t('booking:continue')}
                                        </Button>
                                    ) : isPassengersStep ? (
                                        (isLoggedIn ||
                                            checkValidPhone(phone)) &&
                                        isPassengerStepCompleted ? (
                                            <Button
                                                onClick={() =>
                                                    isSeatingSchemeEnable()
                                                        .length > 0 &&
                                                    seatingRequired
                                                        ? handleStep(2)
                                                        : handleBooking()
                                                }
                                                color="primary"
                                                fullWidth
                                                variant="contained"
                                                disabled={
                                                    !isSeatingSchemeEnable()
                                                        .length &&
                                                    isBookingButtonDisabled
                                                }
                                                className={classes.submitButton}
                                            >
                                                {t('booking:continue')}
                                            </Button>
                                        ) : (
                                            <>
                                                <SnackbarProvider>
                                                    <BookingNotValidButton>
                                                        {t('booking:continue')}
                                                    </BookingNotValidButton>
                                                    <Snackbar />
                                                </SnackbarProvider>
                                            </>
                                        )
                                    ) : (
                                        <Button
                                            onClick={handleBooking}
                                            color="primary"
                                            fullWidth
                                            variant="contained"
                                            disabled={
                                                !completed[activeStep] ||
                                                isBookingButtonDisabled
                                            }
                                            className={classes.submitButton}
                                        >
                                            {t('booking:continue')}
                                        </Button>
                                    )}
                                </Grid>

                                <Grid item md={8}>
                                    {activeStep === 0 ? (
                                        <>
                                            <BookingStopsStep ride={ride} />
                                            {ride.dynamicMode &&
                                            meta.d2dAppBannerEnabled ? (
                                                <NoSsr>
                                                    <D2DAppBanner
                                                        className={
                                                            classes.d2dAppBanner
                                                        }
                                                    />
                                                </NoSsr>
                                            ) : null}
                                        </>
                                    ) : activeStep === 1 ? (
                                        <DesktopPassengersStep
                                            bookFields={
                                                ride.bookFields as BookField[]
                                            } // @todo Backend types
                                            ticketTypes={bookParams.ticketTypes}
                                            docTypes={bookParams.docTypes}
                                            genderTypes={bookParams.genderTypes}
                                            passengersNumber={
                                                numberOfPassengers
                                            }
                                            currency={
                                                ride.currency as CurrencySymbol
                                            } // @todo Backend types
                                            documents={documents}
                                            onTicketsPriceChange={
                                                handleTicketsPriceChange
                                            }
                                            paymentTypes={ride.paymentTypes}
                                        />
                                    ) : activeStep === 2 &&
                                      isSeatingSchemeEnable().length > 0 ? (
                                        <div
                                            className={
                                                classes.seatingSchemeWrap
                                            }
                                        >
                                            {!isEnoughSeats && (
                                                <SelectSeatsNoSeatsCard />
                                            )}
                                            <PassengerAndSeatNumber
                                                numberOfPassengers={
                                                    numberOfPassengers
                                                }
                                            />
                                            <Divider
                                                className={classes.divider}
                                            />
                                            <MobileSeatStep
                                                seatingScheme={isSeatingSchemeEnable()}
                                                numberOfPassengers={
                                                    numberOfPassengers
                                                }
                                            />
                                        </div>
                                    ) : null}
                                </Grid>
                            </Grid>
                        </Container>
                    </>
                ) : status === RIDE_FETCHING || status === RIDE_POLLING ? (
                    <></>
                ) : status === RIDE_ERROR ? (
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
                ) : null}

                {/* Order */}
                {(status === RIDE_FETCHING ||
                    status === RIDE_POLLING ||
                    isBookingButtonLoading) && (
                    <OverlayShimmer
                        open={true}
                        text={t('booking:sendingOrder')}
                    />
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

                <CancelBookingDialog
                    open={cancelDialogOpen}
                    onContinue={handleCancelDialogClose}
                    onCancel={goToSearch}
                />

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
            </Desktop>
        );

    return (
        <div className={classes.root}>
            {status === RIDE_SUCCESS || status === RIDE_UPDATING ? (
                <>
                    <AppBar
                        title={dialogTitle}
                        subtitle={dialogSubtitle}
                        titleOverflowHidden
                        shadow="none"
                        startIcon="close"
                        backAutoHide={false}
                        onBack={handleAppBarCancel}
                        endIcon={
                            <IconButton
                                onClick={() => {
                                    document.body.style.overflow = 'hidden';
                                    setRideDetailsOpen(true);
                                }}
                                color="primary"
                                edge="end"
                            >
                                <MoreHorizIcon />
                            </IconButton>
                        }
                    />

                    {!isMioTaxi && (
                        <MobileStepper
                            activeStep={activeStep}
                            completed={completed}
                            steps={steps}
                            onChange={handleStep}
                        />
                    )}

                    {activeStep === 0 ? (
                        <BookingStopsStep
                            ride={ride as RideDto}
                            className={classes.bookingStopsStep}
                        />
                    ) : activeStep === 1 ? (
                        renderPassengersStep(
                            bookParams as BookParamsDto,
                            ride as RideDto
                        )
                    ) : activeStep === 2 ? (
                        isSeatingSchemeEnable().length > 0 && (
                            <div className={classes.seatingSchemeWrap}>
                                {!isEnoughSeats && <SelectSeatsNoSeatsCard />}
                                <MobileSeatStep
                                    seatingScheme={isSeatingSchemeEnable()}
                                    numberOfPassengers={numberOfPassengers}
                                />
                            </div>
                        )
                    ) : null}

                    {renderActionBar(ride as RideDto)}
                </>
            ) : status === RIDE_FETCHING || status === RIDE_POLLING ? (
                <></>
            ) : status === RIDE_ERROR ? (
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

            <CancelBookingDialog
                open={cancelDialogOpen}
                onContinue={handleCancelDialogClose}
                onCancel={goToSearch}
            />

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

            {ride ? (
                <BookingRideDetailsDialog
                    open={rideDetailsOpen}
                    onClose={() => {
                        document.body.style.overflow = 'auto';
                        setRideDetailsOpen(false);
                    }}
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

Booking.getInitialProps = async props => {
    const { query, store } = props;
    const {
        id,
        passengers,
        from: fromId,
        to: toId,
        date,
    } = query as QueryParams;

    return {
        passengers: Number(passengers || 0),
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

export default Booking;
