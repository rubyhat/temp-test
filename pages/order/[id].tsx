import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import Router, { useRouter } from 'next/router';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { batch, useDispatch, useSelector } from 'react-redux';
import Container from '@material-ui/core/Container';

import { AppBar } from 'components/AppBar';
import { Button } from 'components/ui/Button';
import { RideDetailsList } from 'components/RideDetailsList';
import { Route } from 'components/Route';
import { Typo } from 'components/Typo/Typo';
import { useTranslation } from 'i18n';
import { formatBusColor, formatBusName, formatRideName } from 'utils/ride';
import { orderFetching } from 'store/order/actions';
import { RootState } from 'store';
import {
    ORDER_ERROR,
    ORDER_FETCHING,
    ORDER_POLLING,
    ORDER_SUCCESS,
    OrderState,
} from 'store/order/types';
import { format } from 'utils/date';
import parseISO from 'date-fns/parseISO';
import { OrderTicket } from 'components/OrderTicket';
import { OverlayShimmer } from 'components/OverlayShimmer';
import { NotifyDialog } from 'components/NotifyDialog';
import { CurrencySymbol } from 'utils/currency';
import { ticketCancel } from 'store/ticket/actions';
import { TICKET_SUCCESS, TicketState } from 'store/ticket/types';
import SnackbarProvider from 'components/ui/Snackbar/SnackbarProvider';
import { Snackbar } from 'components/ui/Snackbar/Snackbar';
import { useBusLocation } from 'components/useBusLocation';
import { usePlatform } from 'hooks/usePlatform';
import { Desktop } from 'layouts/desktop';
import { DesktopHeading } from 'components/DesktopHeading';
import { DesktopOrderTicket } from 'components/DesktopOrderTicket';
import { DesktopBookingRouteCard } from 'components/DesktopBookingRouteCard';
import { DesktopRoute } from 'components/DesktopRoute';
import { DesktopOrderBusDetailsCard } from 'components/DesktopOrderBusDetailsCard';
import { OrderStatusList } from 'components/OrderStatusList';
import { BusLocation } from 'components/BusLocation';
import { OrderErrorSnackbar } from 'components/OrderErrorSnackbar';
import { CarrierPhonesList } from 'components/CarrierPhonesList';
import { CarrierPhonesCard } from 'components/CarrierPhonesCard';
import { usePullToRefresh } from 'hooks/usePullToRefresh';
import { MapStopsPreviewDialog } from 'components/MapStopsPreviewDialog/MapStopsPreviewDialog';
import { D2DBookedInfoPaper } from 'components/d2d/D2DBookedInfoPaper';
import { useCallCenterOrCarrierPhones } from 'hooks/useCallCenterOrCarrierPhones';
import DriverInfoCard from 'components/DriverInfoCard/DriverInfoCard';
import { AtlasTheme } from 'typings/atlas-theme';
import { useSAAS } from 'hooks/useSAAS';
type Props = {
    id: string;
};

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            paddingBottom: 104,
        },
        /* Styles applied to the `Container` component. */
        container: {
            ...theme.atlas.appBar.marginTop(16), // AppBar height + 16,
            marginBottom: 16,
        },
        /* Styles applied to the `List` component. */
        list: {
            backgroundColor: '#FFF',
        },
        /* Styles applied to the route `div` element. */
        route: {
            backgroundColor: '#FFF',
            marginTop: theme.spacing(2),
            padding: theme.spacing(2),
        },
        /* Styles applied to the route `Button` component. */
        routeButton: {
            marginTop: theme.spacing(2),
        },
        D2DBookedInfoPaper: {
            marginTop: theme.spacing(2),
        },
        /* Styles applied to the tickets `div` element. */
        tickets: {},
        /* Styles applied to the ticket actions `div` element. */
        actions: {
            backgroundColor: '#FFF',
            padding: theme.spacing(2),
            marginTop: theme.spacing(2),
        },
        /* Styles applied to the order created date `div` element. */
        orderCreatedDate: {
            marginTop: theme.spacing(2),
        },
        /* Styles applied to the `Container` component (desktop). */
        desktopContainer: {
            marginTop: theme.spacing(1),
        },
        /* Styles applied to the order status `div` element (desktop). */
        desktopOrderStatus: {
            borderRadius: theme.shape.borderRadius,
            backgroundColor: '#FFF',
            boxShadow: theme.atlas.shadows.bottom,
        },
        /* Styles applied to the `DesktopOrderTicket` component. */
        desktopOrderTicket: {
            '& ~ &': {
                marginTop: theme.spacing(2),
            },
        },
        marginTop: {
            marginTop: theme.spacing(2),
        },
        onTheMapButton: {
            marginTop: theme.spacing(2),
        },
    }),
    { name: 'Order' }
);

const Order: NextPage<Props> = props => {
    const { id } = props;
    const classes = useStyles();
    const router = useRouter();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { isMioTaxi, isCompas } = useSAAS();
    const isMapShown = !isCompas;
    const { isDesktop } = usePlatform();
    const { order, status } = useSelector<RootState, OrderState>(
        rootState => rootState.order
    );
    const rideInfo = (order && order.rideInfo) || null;
    const tickets = (order && order.tickets) || null;
    const currency = (rideInfo && rideInfo.currency) || undefined;
    const carrierPhones: string[] = (rideInfo && rideInfo.carrier_phones) || [];
    const phones = useCallCenterOrCarrierPhones(carrierPhones);

    const handleBack = () => router.back();
    const goToSearch = () => router.push('/');
    const refetchOrder = () => router.reload();

    useEffect(() => {
        batch(() => {
            dispatch(orderFetching(id));
        });
    }, [id]);

    // Scroll fix
    useEffect(() => {
        document.body.style.overflow = 'auto';
    }, []);

    // Ticket cancellation
    const { status: ticketStatus } = useSelector<RootState, TicketState>(
        rootState => rootState.ticket
    );
    const handleReturnTicket = (ticketId: string) => {
        dispatch(ticketCancel(ticketId));
    };
    useEffect(() => {
        if (ticketStatus === TICKET_SUCCESS) {
            // обновить данные заказа после отмены билета
            dispatch(orderFetching(id));
        }
    }, [ticketStatus]);

    const bus = useBusLocation({
        orderId: id,
        fetching: status === ORDER_FETCHING,
    });

    usePullToRefresh(() => {
        dispatch(orderFetching(id));
    });

    // Ride stops on the map
    const [stopsDialogOpen, toggleStopsDialog] = useState(false);

    if (isDesktop) {
        return (
            <SnackbarProvider>
                {status === ORDER_SUCCESS && order && rideInfo && tickets ? (
                    <Desktop>
                        <DesktopHeading
                            pageTitle={t('order:orderDetails')}
                            backUrl="/orders"
                            breadcrumbTitle={t('order:backToOrders')}
                        />

                        <Container className={classes.desktopContainer}>
                            <Grid container spacing={2}>
                                <Grid item md={4}>
                                    <div className={classes.desktopOrderStatus}>
                                        <OrderStatusList order={order} />
                                    </div>

                                    <DesktopBookingRouteCard
                                        className={classes.marginTop}
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
                                                departureCity={
                                                    rideInfo.from.desc as string
                                                }
                                                departureStop={
                                                    order.pickupStop.desc
                                                }
                                                arrivalDate={
                                                    order.dischargeStop.datetime
                                                }
                                                arrivalCity={
                                                    rideInfo.to.desc as string
                                                }
                                                arrivalStop={
                                                    order.dischargeStop.desc
                                                }
                                            />
                                        }
                                    />

                                    {rideInfo.bus ? (
                                        <DesktopOrderBusDetailsCard
                                            className={classes.marginTop}
                                            bus={rideInfo.bus}
                                            children={
                                                bus.available ||
                                                bus.willBeAvailableIn ? (
                                                    <BusLocation
                                                        order={order}
                                                        bus={bus}
                                                    />
                                                ) : isMapShown ? (
                                                    <Button
                                                        onClick={() => {
                                                            document.body.style.overflow =
                                                                'hidden';
                                                            toggleStopsDialog(
                                                                true
                                                            );
                                                        }}
                                                        color="primary"
                                                        variant="outlined"
                                                        fullWidth
                                                    >
                                                        {t('onTheMap')}
                                                    </Button>
                                                ) : null
                                            }
                                        />
                                    ) : null}

                                    {rideInfo.driver &&
                                        Object.keys(rideInfo.driver).length !==
                                            0 && (
                                            <DriverInfoCard
                                                className={classes.marginTop}
                                                driver={rideInfo.driver}
                                            />
                                        )}

                                    {phones.length ? (
                                        <CarrierPhonesCard
                                            className={classes.marginTop}
                                            phones={phones}
                                        />
                                    ) : null}
                                </Grid>

                                <Grid item md={8}>
                                    {tickets ? (
                                        <div className={classes.tickets}>
                                            {tickets.map((ticket, i) => (
                                                <DesktopOrderTicket
                                                    className={
                                                        classes.desktopOrderTicket
                                                    }
                                                    key={i}
                                                    order={order}
                                                    ticket={ticket}
                                                    currency={
                                                        currency as CurrencySymbol
                                                    }
                                                    onReturnTicket={
                                                        handleReturnTicket
                                                    }
                                                />
                                            ))}
                                        </div>
                                    ) : null}

                                    {order.createdAt ? (
                                        <div
                                            className={classes.orderCreatedDate}
                                        >
                                            <Typo
                                                variant="caption"
                                                color="textSecondary"
                                                align="center"
                                            >
                                                {t('order:orderCreatedAt', {
                                                    date: format(
                                                        parseISO(
                                                            order.createdAt
                                                        ),
                                                        'dd.LL.yyyy'
                                                    ),
                                                    time: format(
                                                        parseISO(
                                                            order.createdAt
                                                        ),
                                                        'HH:mm'
                                                    ),
                                                })}
                                            </Typo>
                                        </div>
                                    ) : null}
                                </Grid>
                            </Grid>
                        </Container>
                    </Desktop>
                ) : status === ORDER_FETCHING || status === ORDER_POLLING ? (
                    <OverlayShimmer
                        open={true}
                        text={t('order:loadingOrder')}
                    />
                ) : status === ORDER_ERROR ? (
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
                                        onClick={refetchOrder}
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

                <Snackbar />
                <OrderErrorSnackbar />

                {order ? (
                    <MapStopsPreviewDialog
                        open={stopsDialogOpen}
                        onClose={() => {
                            document.body.style.overflow = 'auto';
                            toggleStopsDialog(false);
                        }}
                        endpoints={[order.pickupStop, order.dischargeStop]}
                        title={t('stopsOnTheMap')}
                    />
                ) : null}
            </SnackbarProvider>
        );
    }

    return (
        <SnackbarProvider>
            <div className={classes.root}>
                {status === ORDER_SUCCESS && order && rideInfo && tickets ? (
                    <>
                        <AppBar
                            title={
                                isMioTaxi
                                    ? rideInfo.to.desc
                                    : formatRideName(rideInfo.from, rideInfo.to)
                            }
                            subtitle={
                                !isMioTaxi &&
                                format(
                                    parseISO(order.pickupStop.datetime),
                                    'd MMM, EEEEEE'
                                ) +
                                    ' · ' +
                                    tickets.length +
                                    ' ' +
                                    t('people', { count: tickets.length })
                            }
                            titleOverflowHidden
                            position="fixed"
                            onBack={handleBack}
                        />

                        <div className={classes.container}>
                            <OrderStatusList
                                order={order}
                                className={classes.list}
                            />
                            <div className={classes.route}>
                                {!isMioTaxi && (
                                    <Route
                                        departureDate={
                                            order.pickupStop.datetime
                                        }
                                        arrivalDate={
                                            order.dischargeStop.datetime
                                        }
                                        departureName={order.pickupStop.desc}
                                        arrivalName={order.dischargeStop.desc}
                                        departureTimezone={
                                            order.pickupStop.timezone
                                        }
                                        arrivalTimezone={
                                            order.dischargeStop.timezone
                                        }
                                        order={order}
                                    />
                                )}

                                {order.pickupStop.dynamic ||
                                order.dischargeStop.dynamic ? (
                                    <D2DBookedInfoPaper
                                        className={classes.D2DBookedInfoPaper}
                                        ride={rideInfo}
                                        order={order}
                                    />
                                ) : null}

                                {bus.available || bus.willBeAvailableIn ? (
                                    <BusLocation
                                        className={classes.routeButton}
                                        order={order}
                                        bus={bus}
                                    />
                                ) : isMapShown ? (
                                    <div>
                                        <Button
                                            className={classes.onTheMapButton}
                                            onClick={() => {
                                                document.body.style.overflow =
                                                    'hidden';
                                                toggleStopsDialog(true);
                                            }}
                                            color="primary"
                                            variant="outlined"
                                            fullWidth
                                        >
                                            {t('onTheMap')}
                                        </Button>
                                    </div>
                                ) : null}
                            </div>
                            {rideInfo.bus &&
                            Object.keys(rideInfo.bus).length !== 0 ? (
                                <RideDetailsList
                                    className={classes.marginTop}
                                    items={[
                                        {
                                            name: t('order:transport'),
                                            value: formatBusName(rideInfo.bus),
                                        },
                                        {
                                            name: t('order:color'),
                                            value: rideInfo.bus.color
                                                ? formatBusColor(
                                                      rideInfo.bus.color
                                                  )
                                                : '',
                                        },
                                        ...(rideInfo.bus.reg
                                            ? [
                                                  {
                                                      name: t('order:busReg'),
                                                      value: rideInfo.bus.reg,
                                                  },
                                              ]
                                            : []),
                                        ...(!isMioTaxi
                                            ? [
                                                  {
                                                      name: t('order:partner'),
                                                      value: rideInfo.freighter
                                                          ? rideInfo.freighter
                                                                .name
                                                          : rideInfo.carrier,
                                                  },
                                              ]
                                            : []),
                                    ]}
                                />
                            ) : null}

                            {rideInfo.driver &&
                                Object.keys(rideInfo.driver).length !== 0 && (
                                    <DriverInfoCard
                                        className={classes.marginTop}
                                        driver={rideInfo.driver}
                                    />
                                )}
                            {phones.length ? (
                                <CarrierPhonesList
                                    className={classes.marginTop}
                                    phones={phones}
                                />
                            ) : null}
                            {tickets ? (
                                <div className={classes.tickets}>
                                    {tickets.map((ticket, i) => (
                                        <OrderTicket
                                            order={order}
                                            ticket={ticket}
                                            currency={
                                                currency as CurrencySymbol
                                            } // @todo Backend types
                                            key={i}
                                            onReturnTicket={handleReturnTicket}
                                        />
                                    ))}
                                </div>
                            ) : null}
                            {order.createdAt ? (
                                <div className={classes.orderCreatedDate}>
                                    <Typo
                                        variant="caption"
                                        color="textSecondary"
                                        align="center"
                                    >
                                        {t('order:orderCreatedAt', {
                                            date: format(
                                                parseISO(order.createdAt),
                                                'dd.LL.yyyy'
                                            ),
                                            time: format(
                                                parseISO(order.createdAt),
                                                'HH:mm'
                                            ),
                                        })}
                                    </Typo>
                                </div>
                            ) : null}
                        </div>
                    </>
                ) : status === ORDER_FETCHING || status === ORDER_POLLING ? (
                    <OverlayShimmer
                        open={true}
                        text={t('order:loadingOrder')}
                    />
                ) : status === ORDER_ERROR ? (
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
                                        onClick={refetchOrder}
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
            </div>

            <Snackbar />
            <OrderErrorSnackbar />

            {order ? (
                <MapStopsPreviewDialog
                    open={stopsDialogOpen}
                    onClose={() => {
                        document.body.style.overflow = 'auto';
                        toggleStopsDialog(false);
                    }}
                    endpoints={[order.pickupStop, order.dischargeStop]}
                    title={t('stopsOnTheMap')}
                />
            ) : null}
        </SnackbarProvider>
    );
};

type QueryParams = {
    id: string;
};

Order.getInitialProps = async props => {
    const { query, store } = props;
    const { id } = query as QueryParams;

    const { user } = store.getState();
    const isLoggedIn = !!user.phoneNumber;

    if (!isLoggedIn) {
        if (process.browser) {
            Router.replace('/login');
        }
    }

    return {
        id,
        namespacesRequired: ['order', 'booking', 'brand'],
    };
};

export default Order;
