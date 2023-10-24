import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import Card from '@material-ui/core/Card';
import Checkbox from '@material-ui/core/Checkbox';
import Container from '@material-ui/core/Container';
import Cookies from 'universal-cookie';
import Divider from '@material-ui/core/Divider';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Link from 'next/link';
import clsx from 'clsx';
import parseISO from 'date-fns/parseISO';
import { NextPage } from 'next';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import { ActionBar } from 'components/ActionBar';
import { AppBar } from 'components/AppBar';
import { BookingAction } from 'components/BookingAction';
import {
    BookingPaymentSelect,
    PaymentType,
} from 'components/BookingPaymentSelect';
import { Button } from 'components/ui/Button';
import {
    CANCEL_CANCELING,
    CANCEL_SUCCESS,
    CONFIRM_LOADING,
    CONFIRM_SUCCESS,
    PaymentState,
    RECURR_LOADING,
    RECURR_SUCCESS,
} from 'store/payment/types';
import { CardsState } from 'store/credit-cards/types';
import { CountdownButton } from 'components/CountdownButton/CountdownButton';
import { CurrencySymbol } from 'utils/currency';
import { INVOICE_FETCHING, InvoiceState } from 'store/invoice/types';
import {
    LOYALTY_FETCHING,
    LOYALTY_SUCCESS,
    LoyaltyState,
} from 'store/loyalty/types';
import { MilesState } from 'store/miles/types';
import { MobileStepper } from 'components/ui/MobileStepper/MobileStepper';
import { NotifyDialog } from 'components/NotifyDialog';
import { ORDER_ERROR, ORDER_SUCCESS, OrderState } from 'store/order/types';
import {
    MilesAccrualDto,
    OrderConfirmDtoPaymentTypeEnum,
    RideDtoPaymentTypesEnum,
} from 'swagger/client';
import { OverlayShimmer } from 'components/OverlayShimmer';
import { Promocode } from 'components/Promocode';
import { RootState } from 'store';
import { Typo } from 'components/Typo/Typo';
import { calcDynamicPrice } from 'utils/price';
import { format } from 'utils/date';
import { invoiceReset } from 'store/invoice/actions';
import { loyaltyReset } from 'store/loyalty/actions';
import { orderReset } from 'store/order/actions';
import {
    orderCancel,
    paymentConfirm,
    paymentInit,
    paymentRecurr,
} from 'store/payment/actions';
import { useCancelBooking } from 'hooks/useCancelBooking';
import { useTranslation } from 'i18n';
import { Snackbar } from 'components/ui/Snackbar/Snackbar';
import SnackbarProvider from 'components/ui/Snackbar/SnackbarProvider';
import { usePlatform } from 'hooks/usePlatform';
import { DesktopAppBar } from 'components/DesktopAppBar';
import { DesktopBookingRouteCard } from 'components/DesktopBookingRouteCard';
import { DesktopRoute } from 'components/DesktopRoute';
import { DesktopStepper } from 'components/DesktopStepper';
import { DesktopHeading } from 'components/DesktopHeading';
import { CancelBookingDialog } from 'components/CancelBookingDialog';
import { forbiddenPaymentMap, getRelevantPaymentType } from 'utils/booking';
import { ButtonBaseActions } from '@material-ui/core/ButtonBase';
import { PaymentErrorSnackbar } from 'components/PaymentErrorSnackbar';
import { useCountry } from 'hooks/useCountry';
import { useAcquiring } from 'hooks/useAcquiring';
import { getBonusProps } from 'utils/miles';
import { AtlasTheme } from 'typings/atlas-theme';
import { useSAAS } from 'hooks/useSAAS';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        root: {
            marginBottom: 138 + 16, // ActionBar height + 16
        },
        payStep: {
            marginTop: theme.spacing(2),
        },
        promocode: {
            marginTop: theme.spacing(2),
            padding: theme.spacing(2),
        },
        // Mobile only
        iHavePromocodeButton: {
            marginLeft: 'auto',
            display: 'block',
        },
        termsCheckbox: {
            marginBottom: 8,
        },
        desktopTermsCheckbox: {
            marginTop: theme.spacing(2),
        },
        desktopHeading: {
            marginTop: 40,
        },
        desktopContainer: {
            marginTop: 0,
        },
        desktopSection: {
            padding: theme.spacing(3),
        },
        promocodeSection: {
            padding: theme.spacing(2),
        },
        desktopPaymentSelect: {
            boxShadow: theme.atlas.shadows.bottom,
            borderRadius: theme.shape.borderRadius,
        },
        desktopPromocode: {},
        desktopCountdownButton: {
            marginTop: theme.spacing(1),
        },
        marginTop: {
            marginTop: theme.spacing(2),
        },
        agreeLabel: {
            '& > a': {
                color: theme.atlas.palette.text.link,
            },
        },
        invalidCheckbox: {
            color: theme.palette.error.main,
        },
    }),
    { name: 'Payment' }
);

type Props = {};

const cookies = new Cookies();
const termsAgreeCookieKey = 'terms-agree';

const Payment: NextPage<Props> = props => {
    const classes = useStyles();
    const router = useRouter();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { country } = useCountry();
    const { isCordova, isMobile } = usePlatform();
    const orderId = router.query.id as string; // @todo use `order.id` instead
    const { isMioTaxi } = useSAAS();

    const {
        cardPaymentOnline,
        milesPaymentOnline,

        savedCardsLoading,
        invoiceLoading,
        milesBalanceLoading,

        cancelStatus,
        confirmStatus,
        recurrStatus,

        paymentInitSuccess,
    } = useSelector<RootState, PaymentState>(rootState => rootState.payment);
    const { order, status: orderStatus } = useSelector<RootState, OrderState>(
        rootState => rootState.order
    );
    const ride = order && order.rideInfo;
    const tickets = order && order.tickets;

    // Итоговое количество начисляемых миль
    const [miles, setMiles] = React.useState<MilesAccrualDto>({
        card: 0,
        cash: 0,
    });

    React.useEffect(() => {
        if (order) {
            const tickets = order.tickets;
            let totalCardMiles = 0;
            let totalCashMiles = 0;

            tickets &&
                tickets.forEach(ticket => {
                    totalCardMiles += ticket.milesAccrual.card;
                    totalCashMiles += ticket.milesAccrual.cash;
                });
            setMiles({ card: totalCardMiles, cash: totalCashMiles });
        }
    }, [order]);

    // Cards
    const { cards } = useSelector<RootState, CardsState>(
        rootState => rootState.cards
    );

    // Loyalty
    const loyalty = useSelector<RootState, LoyaltyState>(
        rootState => rootState.loyalty
    );

    const loyaltyLoading = loyalty.status === LOYALTY_FETCHING;
    const promocodeAvailable =
        order &&
        ride &&
        ride.paymentTypes.includes(RideDtoPaymentTypesEnum.AtlasPromocode);
    const [promocodeVisibility, setPromocodeVisibility] = useState(false);
    const showPromocode = () => setPromocodeVisibility(true);
    const isOneHundredPercentDiscount =
        loyalty.status === LOYALTY_SUCCESS && loyalty.onlinePrice === 0;
    useEffect(() => {
        if (isOneHundredPercentDiscount) {
            // Нет смысл оплачивать картой если сумма к оплате равна 0 руб.
            // Меняем дефолтный способ оплаты на "наличные".
            setPaymentType('cash');
        }
    }, [isOneHundredPercentDiscount]);

    // Miles
    const { balance: milesBalance } = useSelector<RootState, MilesState>(
        rootState => rootState.miles
    );

    const { price, onlinePrice, milesPrice } = loyalty;
    const prices = {
        bank: order ? onlinePrice : 0,
        cash: order ? price : 0,
        miles: milesPrice,
    };
    const bonusProp = getBonusProps(ride);

    const hasNotEnoughMiles = milesBalance === 0 || milesBalance < milesPrice;
    const disabledPaymentMethods = {
        bank: ride
            ? !ride.paymentTypes.includes(RideDtoPaymentTypesEnum.Card) ||
              !cardPaymentOnline ||
              isOneHundredPercentDiscount
            : false,
        cash: ride
            ? !ride.paymentTypes.includes(RideDtoPaymentTypesEnum.Cash)
            : false,
        miles: ride
            ? !ride.paymentTypes.includes(RideDtoPaymentTypesEnum.Miles) ||
              hasNotEnoughMiles ||
              !milesPaymentOnline
            : false,
    };

    // @todo MORDA-415: Исчезает forbiddenPaymentTypes в ответе /orders/:id
    // после автоотмены заказа
    const forbiddenPaymentMethods = ride
        ? forbiddenPaymentMap(ride.forbiddenPaymentTypes || [])
        : undefined;

    useEffect(() => {
        dispatch(paymentInit(orderId));
    }, [orderId]);

    useEffect(() => {
        if (ride && forbiddenPaymentMethods) {
            // устанавливаем по умолчанию первый доступный способ оплаты
            setPaymentType(
                getRelevantPaymentType(
                    ride.paymentTypes,
                    disabledPaymentMethods,
                    forbiddenPaymentMethods,
                    cards
                )
            );
        }
    }, [ride, cards, milesBalance, cardPaymentOnline, milesPaymentOnline]);

    // Scroll fix
    useEffect(() => {
        document.body.style.overflow = 'auto';
    }, []);

    // AppBar
    const dialogTitle = ride ? `${ride.from.desc} – ${ride.to.desc}` : '';
    const dialogSubtitle = ride
        ? format(parseISO(ride.departure), 'd MMM, EEEEEE')
        : '';
    const handleAppBarCancel = () => {
        setCancelDialogOpen(true);
    };
    const goToSearch = () => {
        document.body.style.overflow = 'auto';
        setCancelDialogOpen(false);
        router.beforePopState(() => true);

        router.replace('/');
    };
    const reload = () => {
        router.reload();
    };

    // Steps
    const activeStep = 2;
    const steps = [
        t('booking:pickupDropoffPoints'),
        t('booking:passengers'),
        t('booking:confirmation'),
    ];
    const completed = {
        0: false,
        1: false,
        2: true,
    };
    const disabled = {
        0: true,
        1: true,
        2: false,
    };
    const handleStep = () => {};

    // Countdown
    const [timeoutDialogOpen, setTimeoutDialogOpen] = useState(false);
    const [countdownDate, setCountdownDate] = useState(
        Date.now() + 15 * 60 * 1000
    );
    const handleTimeout = () => {
        setTimeoutDialogOpen(true);
    };
    useEffect(() => {
        if (order && order.expiresIn) {
            if (order.expiresIn <= 0) {
                handleTimeout();
            } else {
                setCountdownDate(Date.now() + order.expiresIn * 1000);
            }
        }
    }, [order]);

    // Terms agree
    const [termsAgree, setTermsAgree] = useState(false);
    const [termsValid, setTermsValid] = useState(true);
    const termsRef = useRef<HTMLInputElement>();
    // see https://github.com/mui-org/material-ui/issues/13761#issuecomment-443415092
    const termsActionsRef = useRef<ButtonBaseActions>();
    const handleTermsAgree = (
        e: ChangeEvent<HTMLInputElement>,
        checked: boolean
    ) => {
        setTermsAgree(checked);
        cookies.set(termsAgreeCookieKey, checked, {
            maxAge: 3600 * 24 * 90,
        });
        if (process.browser && window.localStorage) {
            if (checked) {
                localStorage.setItem(termsAgreeCookieKey, 'true');
            }
        }
    };
    // Обернул в useEffect чтобы не выполнять на стороне сервера
    useEffect(() => {
        if (process.browser && window.localStorage) {
            if (
                localStorage.getItem(termsAgreeCookieKey) ||
                // @todo: когда нибудь удалить
                cookies.get(termsAgreeCookieKey) === 'true'
            ) {
                setTermsAgree(true);
            }
        }
    }, []);
    const termsAgreeLabelText = (
        <Typo className={classes.agreeLabel} color="textPrimary">
            <span>{t('booking:iAgreeWithTermsText')} </span>
            <Link href="/terms">{t('booking:iAgreeWithTermsLink')}</Link>
        </Typo>
    );

    // Acquiring
    const { openAcquiringConfirmationURL } = useAcquiring();

    // Payment
    const [paymentType, setPaymentType] = useState<PaymentType | ''>(''); // @todo relevant payment
    const handlePaymentTypeChange = (value: PaymentType) =>
        setPaymentType(value);
    const handlePay = (orderId: string) => () => {
        if (!termsAgree) {
            setTermsValid(false);
            if (termsRef.current && termsActionsRef.current) {
                termsRef.current.focus();
                termsActionsRef.current.focusVisible();
            }
            return;
        }
        const isRecurrentPaymentType = typeof paymentType === 'number';
        const cardId = isRecurrentPaymentType ? paymentType : null;

        if (cardId) {
            dispatch(paymentRecurr(orderId, cardId));
        } else if (paymentType === 'bank') {
            openAcquiringConfirmationURL();
        } else if (paymentType === 'cash' || paymentType === 'miles') {
            dispatch(
                paymentConfirm(
                    orderId,
                    paymentType as OrderConfirmDtoPaymentTypeEnum
                )
            ); // @todo type
        }
    };

    const { status: invoiceStatus } = useSelector<RootState, InvoiceState>(
        rootState => rootState.invoice
    );

    // CancelBooking
    const { cancelDialogOpen, setCancelDialogOpen } = useCancelBooking();
    const handleCancelDialogClose = () => {
        document.body.style.overflow = 'auto';
        setCancelDialogOpen(false);
    };
    const handleCancel = () => {
        document.body.style.overflow = 'auto';
        setCancelDialogOpen(false);
        router.beforePopState(() => true);
        if (order) dispatch(orderCancel(orderId));
        goToSearch();
    };

    const isPayButtonLoading =
        confirmStatus === CONFIRM_LOADING ||
        confirmStatus === CONFIRM_SUCCESS ||
        recurrStatus === RECURR_LOADING ||
        recurrStatus === RECURR_SUCCESS;

    const isPayButtonDisabled =
        isPayButtonLoading ||
        (invoiceStatus === INVOICE_FETCHING && paymentType === 'bank') ||
        !paymentType;

    const isLoadingOrder =
        !paymentInitSuccess ||
        savedCardsLoading ||
        invoiceLoading ||
        milesBalanceLoading ||
        loyaltyLoading;

    if (isCordova || isMobile) {
        return (
            <div className={classes.root}>
                {orderStatus === ORDER_SUCCESS && order && ride && tickets ? (
                    <>
                        <AppBar
                            title={dialogTitle}
                            subtitle={dialogSubtitle}
                            titleOverflowHidden
                            shadow="none"
                            startIcon="close"
                            backAutoHide={false}
                            onBack={handleAppBarCancel}
                        />

                        {!isMioTaxi && (
                            <MobileStepper
                                activeStep={activeStep}
                                completed={completed}
                                steps={steps}
                                onChange={handleStep}
                            />
                        )}

                        <div className={classes.payStep}>
                            <BookingPaymentSelect
                                value={paymentType}
                                onChange={handlePaymentTypeChange}
                                prices={prices}
                                bonus={bonusProp}
                                disabled={disabledPaymentMethods}
                                forbidden={forbiddenPaymentMethods}
                                paymentTypes={ride.paymentTypes}
                                milesBalance={milesBalance}
                                accruedMiles={miles}
                                currency={ride.currency as CurrencySymbol} // @todo Backend type
                                cards={cards}
                                milesAward={
                                    ride.atlasMeta && ride.atlasMeta.miles
                                        ? ride.atlasMeta.miles.card ||
                                          ride.atlasMeta.miles.cash
                                        : 0
                                }
                            />

                            <SnackbarProvider>
                                {promocodeAvailable ? (
                                    <>
                                        {!promocodeVisibility ? (
                                            <Button
                                                onClick={showPromocode}
                                                color="primary"
                                                className={
                                                    classes.iHavePromocodeButton
                                                }
                                            >
                                                {t('booking:iHavePromocode')}
                                            </Button>
                                        ) : null}

                                        {promocodeVisibility ? (
                                            <Promocode
                                                className={classes.promocode}
                                                orderId={orderId}
                                            />
                                        ) : null}
                                    </>
                                ) : null}
                                <Snackbar />
                            </SnackbarProvider>
                        </div>

                        <ActionBar>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={termsAgree}
                                        onChange={handleTermsAgree}
                                        color="primary"
                                        inputRef={ref => {
                                            if (ref) {
                                                termsRef.current = ref;
                                            }
                                        }}
                                        classes={{
                                            root: clsx({
                                                [classes.invalidCheckbox]:
                                                    !termsValid && !termsAgree,
                                            }),
                                        }}
                                        action={action => {
                                            if (action) {
                                                termsActionsRef.current = action;
                                            }
                                        }}
                                    />
                                }
                                label={termsAgreeLabelText}
                                className={classes.termsCheckbox}
                            />

                            <BookingAction
                                price={calcDynamicPrice(
                                    paymentType,
                                    loyalty,
                                    0
                                )}
                                currency={ride.currency as CurrencySymbol}
                                currencyMiles={paymentType === 'miles'}
                                tickets={tickets.length}
                                button={
                                    <CountdownButton
                                        onClick={handlePay(orderId)}
                                        onComplete={handleTimeout}
                                        date={countdownDate}
                                        color="secondary"
                                        fullWidth
                                        disabled={isPayButtonDisabled}
                                        loading={isPayButtonLoading}
                                    >
                                        {paymentType === 'cash'
                                            ? t('booking:book')
                                            : t('booking:pay')}
                                    </CountdownButton>
                                }
                            />
                        </ActionBar>
                    </>
                ) : orderStatus === ORDER_ERROR ? (
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
                                        onClick={reload}
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

                {isLoadingOrder ? (
                    <OverlayShimmer
                        open={true}
                        text={t('order:loadingOrder')}
                    />
                ) : null}

                <OverlayShimmer
                    open={
                        cancelStatus === CANCEL_CANCELING ||
                        cancelStatus === CANCEL_SUCCESS
                    }
                    text={t('booking:bookingCancelling', {
                        context: country,
                    })}
                />

                <CancelBookingDialog
                    open={cancelDialogOpen}
                    onContinue={handleCancelDialogClose}
                    onCancel={handleCancel}
                />

                <NotifyDialog
                    open={timeoutDialogOpen}
                    title={t('booking:bookingTimeExpired', {
                        context: country,
                    })}
                    subtitle={t('booking:bookingTimeExpiredDesc')}
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

                <SnackbarProvider>
                    <PaymentErrorSnackbar />

                    <Snackbar />
                </SnackbarProvider>
            </div>
        );
    } else {
        return (
            <div className={classes.root}>
                {orderStatus === ORDER_SUCCESS && order && ride && tickets ? (
                    <>
                        <DesktopAppBar />

                        <DesktopHeading
                            className={classes.desktopHeading}
                            pageTitle={t('booking:payment')}
                            backUrl="/"
                            useRouterBack
                            breadcrumbTitle={t('goBack')}
                        />

                        <Container className={classes.desktopContainer}>
                            <Grid container spacing={2}>
                                <Grid item md={4}>
                                    <DesktopBookingRouteCard
                                        departureDate={
                                            order.pickupStop.datetime
                                        }
                                        departureTimezone={
                                            order.pickupStop.timezone
                                        }
                                        arrivalDate={
                                            order.dischargeStop.datetime
                                        }
                                        arrivalTimezone={
                                            order.dischargeStop.timezone
                                        }
                                        passengers={tickets.length}
                                        route={
                                            <DesktopRoute
                                                departureDate={
                                                    order.pickupStop.datetime
                                                }
                                                arrivalDate={
                                                    order.dischargeStop.datetime
                                                }
                                                departureCity={
                                                    ride.from.desc || '' // @todo GDS type
                                                } // @todo back types
                                                arrivalCity={
                                                    ride.to.desc || '' // @todo GDS type
                                                }
                                                departureStop={
                                                    order.pickupStop.desc
                                                }
                                                arrivalStop={
                                                    order.dischargeStop.desc
                                                }
                                            />
                                        }
                                    />

                                    {!isMioTaxi && (
                                        <DesktopStepper
                                            className={classes.marginTop}
                                            activeStep={activeStep}
                                            completed={completed}
                                            disabled={disabled}
                                            onChange={handleStep}
                                            steps={steps}
                                        />
                                    )}

                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={termsAgree}
                                                onChange={handleTermsAgree}
                                                color="primary"
                                                inputRef={ref => {
                                                    if (ref) {
                                                        termsRef.current = ref;
                                                    }
                                                }}
                                                classes={{
                                                    root: clsx({
                                                        [classes.invalidCheckbox]:
                                                            !termsValid &&
                                                            !termsAgree,
                                                    }),
                                                }}
                                                action={action => {
                                                    if (action) {
                                                        termsActionsRef.current = action;
                                                    }
                                                }}
                                            />
                                        }
                                        label={termsAgreeLabelText}
                                        className={classes.desktopTermsCheckbox}
                                    />

                                    <CountdownButton
                                        className={
                                            classes.desktopCountdownButton
                                        }
                                        onClick={handlePay(orderId)}
                                        onComplete={handleTimeout}
                                        date={countdownDate}
                                        color="secondary"
                                        fullWidth
                                        disabled={isPayButtonDisabled}
                                        loading={isPayButtonLoading}
                                    >
                                        {paymentType === 'cash'
                                            ? t('booking:book')
                                            : t('booking:pay')}
                                    </CountdownButton>
                                </Grid>
                                <Grid item md={8}>
                                    <Card>
                                        <div className={classes.desktopSection}>
                                            <BookingPaymentSelect
                                                accruedMiles={miles}
                                                className={
                                                    classes.desktopPaymentSelect
                                                }
                                                value={paymentType}
                                                onChange={
                                                    handlePaymentTypeChange
                                                }
                                                prices={prices}
                                                bonus={bonusProp}
                                                disabled={
                                                    disabledPaymentMethods
                                                }
                                                forbidden={
                                                    forbiddenPaymentMethods
                                                }
                                                paymentTypes={ride.paymentTypes}
                                                milesBalance={milesBalance}
                                                currency={
                                                    ride.currency as CurrencySymbol
                                                }
                                                cards={cards}
                                                milesAward={
                                                    ride.atlasMeta &&
                                                    ride.atlasMeta.miles
                                                        ? ride.atlasMeta.miles
                                                              .card ||
                                                          ride.atlasMeta.miles
                                                              .cash
                                                        : 0
                                                }
                                                disablePadding
                                            />
                                        </div>

                                        <Divider variant="fullWidth" />

                                        <div
                                            className={classes.promocodeSection}
                                        >
                                            <SnackbarProvider>
                                                {promocodeAvailable ? (
                                                    <>
                                                        {!promocodeVisibility ? (
                                                            <Button
                                                                onClick={
                                                                    showPromocode
                                                                }
                                                                color="primary"
                                                            >
                                                                {t(
                                                                    'booking:iHavePromocode'
                                                                )}
                                                            </Button>
                                                        ) : null}

                                                        {promocodeVisibility ? (
                                                            <Promocode
                                                                className={
                                                                    classes.desktopPromocode
                                                                }
                                                                orderId={
                                                                    orderId
                                                                }
                                                            />
                                                        ) : null}
                                                    </>
                                                ) : null}
                                                <Snackbar />
                                            </SnackbarProvider>
                                        </div>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Container>
                    </>
                ) : orderStatus === ORDER_ERROR ? (
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
                                        onClick={reload}
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

                {isLoadingOrder ? (
                    <OverlayShimmer
                        open={true}
                        text={t('order:loadingOrder')}
                    />
                ) : null}

                <CancelBookingDialog
                    open={cancelDialogOpen}
                    onContinue={handleCancelDialogClose}
                    onCancel={handleCancel}
                />

                <NotifyDialog
                    open={timeoutDialogOpen}
                    title={t('booking:bookingTimeExpired', {
                        context: country,
                    })}
                    subtitle={t('booking:bookingTimeExpiredDesc')}
                    actions={
                        <Grid container spacing={2} justify="center">
                            <Grid item xs={12} md={8}>
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

                <SnackbarProvider>
                    <PaymentErrorSnackbar />

                    <Snackbar />
                </SnackbarProvider>
            </div>
        );
    }
};

Payment.getInitialProps = async ctx => {
    const { store } = ctx;

    store.dispatch(orderReset());
    store.dispatch(invoiceReset());
    store.dispatch(loyaltyReset());

    return {
        namespacesRequired: ['booking', 'order', 'brand'],
    };
};

export default Payment;
