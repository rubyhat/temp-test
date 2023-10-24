import React, { useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { NextPage } from 'next';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useRouter } from 'next/router';
import Container from '@material-ui/core/Container';
import clsx from 'clsx';

import { Button } from 'components/ui/Button';
import { NotifyDialog } from 'components/NotifyDialog';
import { OverlayShimmer } from 'components/OverlayShimmer';
import { Route } from 'components/Route';
import { Typo } from 'components/Typo/Typo';
import { RootState } from 'store';
import {
    ORDER_ERROR,
    ORDER_FETCHING,
    ORDER_POLLING,
    ORDER_SUCCESS,
    OrderState,
} from 'store/order/types';
import { orderFetching } from 'store/order/actions';
import { useTranslation } from 'i18n';
import { format } from 'utils/date';
import { parseISO } from 'date-fns';
import { Desktop } from 'layouts/desktop';
import { DesktopOrderCard } from 'components/DesktopOrderCard';
import { usePlatform } from 'hooks/usePlatform';
import { OrderDtoStatusEnum } from 'swagger/client';
import { routerPushSeoPage } from 'utils/routerPushSeoPage';
import { useSeoPrefix } from 'hooks/useSeoPrefix';
import { useCountry } from 'hooks/useCountry';
import { PwaInstallButton } from 'components/PWAInstallButton';
import { iOS, isPWA } from 'utils/platform';
import { usePWA } from 'hooks/usePWA';
import { D2DBookedInfoPaper } from 'components/d2d/D2DBookedInfoPaper';
import { AtlasTheme } from 'typings/atlas-theme';
import { useSAAS } from 'hooks/useSAAS';
import { HotelBanner } from 'components/HotelBanner';
import { SuccessCard } from 'components/SuccessCard';
import { RideInfoCard } from 'components/RideInfoCard';
import { DesktopRideInfoCard } from 'components/DesktopRideInfoCard.tsx';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {},
        /* Styles applied to the success card `div` element. */
        successCard: {
            backgroundColor: theme.palette.secondary.main,
            color: '#FFF',
            padding: theme.spacing(3, 2),
            ...theme.atlas.appBar.paddingTop(theme.spacing(2)),
        },
        successCardDesc: {
            marginTop: theme.spacing(1),
            color: 'rgba(255, 255, 255, 0.64)',
        },
        /* Styles applied to the route `div` element. */
        route: {
            backgroundColor: '#FFF',
            padding: theme.spacing(2),
            marginTop: theme.spacing(2),
        },
        routeButton: {
            marginTop: theme.spacing(2),
        },
        D2DBookedInfoPaper: {
            marginTop: theme.spacing(2),
        },
        /* Styles applied to the actions `div` element. */
        actions: {
            backgroundColor: '#FFF',
            padding: theme.spacing(2),
            marginTop: theme.spacing(2),
        },
        actionButton: {
            '& ~ &': {
                marginTop: theme.spacing(2),
            },
        },
        /* Styles applied to the `DesktopOrderCard` component. */
        desktopOrderCard: {
            marginTop: theme.spacing(3),
        },
        desktopCard: {
            borderRadius: theme.shape.borderRadius,
            boxShadow: theme.atlas.shadows.bottom,
        },
        desktopActions: {
            marginTop: theme.spacing(3),
        },
        /* Styles applied to the PWA suggestion `div` element. */
        pwa: {
            backgroundColor: '#FFF',
            padding: theme.spacing(2),
            marginTop: theme.spacing(2),
        },
        hotelBanner: {
            marginTop: theme.spacing(2),
            borderRadius: theme.spacing(2),
        },
        hotelBannerMobile: {
            padding: '0 16px',
        },
        buttonWrap: {
            padding: `${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
        },
    }),
    { name: 'BookingSuccess' }
);

type Props = {
    id: string;
};

const BookingSuccess: NextPage<Props> = props => {
    const { id } = props;
    const classes = useStyles();
    const router = useRouter();
    const { t } = useTranslation();
    const { country } = useCountry();
    const dispatch = useDispatch();
    const { isMobile, isCordova, inWebView } = usePlatform();
    const {
        pwaSaaSEnabled,
        pwaPromptWasDeferred,
        status: pwaInstallStatus,
    } = usePWA();
    const showPWAInstallButton =
        pwaSaaSEnabled &&
        pwaPromptWasDeferred &&
        pwaInstallStatus !== 'dismissed' &&
        (!iOS() && !isPWA() && !isCordova && !inWebView);
    const { order, status } = useSelector<RootState, OrderState>(
        rootState => rootState.order
    );
    const { seoPrefix } = useSeoPrefix();
    const rideInfo = (order && order.rideInfo) || null;
    const tickets = (order && order.tickets) || null;
    const { isMioTaxi, isAtlas } = useSAAS();

    const goToOrders = () => router.replace('/orders');
    const goToSearch = () => router.replace('/');
    const refetchOrder = () => router.reload();
    const findReturnTicket = () => {
        if (rideInfo && tickets) {
            const { from, to } = rideInfo;

            if (isCordova) {
                router.push({
                    pathname: '/search',
                    query: {
                        from: to.id,
                        fromName: to.desc,
                        to: from.id,
                        toName: from.desc,
                        date: format(
                            parseISO(rideInfo.departure),
                            'yyyy-MM-dd'
                        ),
                        passengers: tickets.length,
                    },
                });
            } else {
                routerPushSeoPage(
                    router,
                    {
                        from: {
                            id: to.id,
                            name: to.desc,
                        },
                        to: {
                            id: from.id,
                            name: from.desc,
                        },
                        date: format(
                            parseISO(rideInfo.departure),
                            'yyyy-MM-dd'
                        ),
                        passengers: tickets.length,
                    },
                    seoPrefix
                );
            }
        }
    };
    const goToOrder = (orderId: string) => {
        if (isCordova) {
            router.replace({
                pathname: '/order',
                query: { id: orderId },
            });
        } else {
            router.replace('/order/[id]', `/order/${orderId}`);
        }
    };

    useEffect(() => {
        dispatch(
            orderFetching(id, [
                OrderDtoStatusEnum.Confirmed,
                OrderDtoStatusEnum.Active,
            ])
        );
    }, [id]);

    // D2D букинг разделен на несколько этапов (pages). При нажатии "Назад"
    // возвращает в /d2dbooking/dropoff а нужно в серп.
    // Отследим нажатие "Назад" и перенаправим куда нужно.
    useEffect(() => {
        router.beforePopState(() => {
            router.push('/');

            return false;
        });
    }, []);

    // Scroll fix
    useEffect(() => {
        document.body.style.overflow = 'auto';
    }, []);

    // Отображение баннера с инфой об отелях (аффилиат)
    const [isHotelBannerShow, setIsHotelBannerShow] = React.useState(false);
    useEffect(() => {
        if (rideInfo) {
            const currentTrip = { from: rideInfo.from.id, to: rideInfo.to.id };
            const partnerTrips = [
                // Минск - Варшава
                { from: 'c625144', to: 'c756135' },
                // Варшава - Минск
                { to: 'c625144', from: 'c756135' },

                // Минск - Вильнюс
                { from: 'c625144', to: 'c593116' },
                // Вильнюс - Минск
                { to: 'c625144', from: 'c593116' },

                // Гродно - Белосток
                { from: 'c627904', to: 'c776069' },
                // Белосток - Гродно
                { to: 'c627904', from: 'c776069' },

                // Гродно - Варшава
                { from: 'c627904', to: 'c756135' },
                // Варшава - Гродно
                { to: 'c627904', from: 'c756135' },

                // Гродно - Вильнюс
                { from: 'c627904', to: 'c593116' },
                // Вильнюс - Гродно
                { to: 'c627904', from: 'c593116' },

                // Гродно - Каунас
                { from: 'c627904', to: 'c598316' },
                // Каунас - Гродно
                { to: 'c627904', from: 'c598316' },

                // Вологда - Санкт-Петербург
                { from: 'c472459', to: 'c498817' },
                // Санкт-Петербург - Вологда
                { to: 'c472459', from: 'c498817' },

                // Уфа - Казань
                { from: 'c479561', to: 'c551487' },
                // Казань - Уфа
                { to: 'c479561', from: 'c551487' },

                // Великий Новгород - Санкт-Петербург
                { from: 'c519336', to: 'c498817' },
                // Санкт-Петербург - Великий Новгород
                { to: 'c519336', from: 'c498817' },
            ];

            if (isAtlas) {
                partnerTrips.forEach(({ from, to }) => {
                    if (currentTrip.from === from && currentTrip.to === to)
                        setIsHotelBannerShow(true);
                });
            }
        }
    });

    if (isMobile || isCordova) {
        return (
            <div className={classes.root}>
                {status === ORDER_SUCCESS && rideInfo && tickets && order ? (
                    <>
                        {isMioTaxi ? (
                            <>
                                <div
                                    className={classes.route}
                                    onClick={() => goToOrder(order.id)}
                                >
                                    <Route
                                        departureDate={
                                            order.pickupStop.datetime
                                        }
                                        arrivalDate={
                                            order.dischargeStop.datetime
                                        } // @toto fix GDS type
                                        departureName={order.pickupStop.desc}
                                        arrivalName={order.dischargeStop.desc}
                                        departureTimezone={
                                            rideInfo.from.timezone
                                        }
                                        arrivalTimezone={rideInfo.to.timezone}
                                        departureInfo={order.pickupStop.info}
                                        arrivalInfo={order.dischargeStop.info}
                                        order={order}
                                    />

                                    {order.pickupStop.dynamic ||
                                    order.dischargeStop.dynamic ? (
                                        <D2DBookedInfoPaper
                                            className={
                                                classes.D2DBookedInfoPaper
                                            }
                                            ride={rideInfo}
                                            order={order}
                                        />
                                    ) : null}

                                    {order && order.url && !isMioTaxi && (
                                        <Button
                                            color="primary"
                                            variant="contained"
                                            fullWidth
                                            href={order.url}
                                            className={classes.routeButton}
                                        >
                                            {t('order:downloadTicket', {
                                                context: country,
                                            })}
                                        </Button>
                                    )}
                                </div>

                                <div className={classes.actions}>
                                    <Button
                                        onClick={findReturnTicket}
                                        color="primary"
                                        variant="outlined"
                                        fullWidth
                                        className={classes.actionButton}
                                    >
                                        {t('order:findReturnTicket', {
                                            context: country,
                                        })}
                                    </Button>
                                    <Button
                                        onClick={goToOrders}
                                        color="primary"
                                        variant="outlined"
                                        fullWidth
                                        className={classes.actionButton}
                                    >
                                        {t('order:openMyOrders')}
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <SuccessCard />
                                <RideInfoCard order={order} />
                                <div className={classes.buttonWrap}>
                                    <Button
                                        onClick={findReturnTicket}
                                        color="primary"
                                        variant="contained"
                                        fullWidth
                                    >
                                        {t('order:findReturnTicket', {
                                            context: country,
                                        })}
                                    </Button>
                                    <Button
                                        onClick={goToOrders}
                                        color="primary"
                                        variant="text"
                                        fullWidth
                                        className={classes.actionButton}
                                    >
                                        {t('order:openMyOrders')}
                                    </Button>
                                </div>
                            </>
                        )}
                        {isHotelBannerShow && (
                            <div className={classes.hotelBannerMobile}>
                                <HotelBanner />
                            </div>
                        )}

                        {showPWAInstallButton ? (
                            <div className={classes.pwa}>
                                <PwaInstallButton />
                            </div>
                        ) : null}
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
        );
    } else {
        return (
            <Desktop>
                {status === ORDER_SUCCESS && rideInfo && tickets && order ? (
                    <Container>
                        {isMioTaxi ? (
                            <>
                                <DesktopOrderCard
                                    className={classes.desktopOrderCard}
                                    onActionClick={goToOrder}
                                    order={order}
                                    compact
                                    showTicketButton
                                />
                                <div
                                    className={clsx(
                                        classes.actions,
                                        classes.desktopActions,
                                        classes.desktopCard
                                    )}
                                >
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}>
                                            <Button
                                                onClick={findReturnTicket}
                                                color="primary"
                                                variant="outlined"
                                                fullWidth
                                                className={classes.actionButton}
                                            >
                                                {t('order:findReturnTicket', {
                                                    context: country,
                                                })}
                                            </Button>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Button
                                                onClick={goToOrders}
                                                color="primary"
                                                variant="outlined"
                                                fullWidth
                                                className={classes.actionButton}
                                            >
                                                {t('order:openMyOrders')}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </div>{' '}
                            </>
                        ) : (
                            <>
                                <SuccessCard />
                                <DesktopRideInfoCard order={order} />
                                <div className={classes.buttonWrap}>
                                    <Button
                                        onClick={goToOrders}
                                        color="primary"
                                        variant="text"
                                        fullWidth
                                        className={classes.actionButton}
                                    >
                                        {t('order:openMyOrders')}
                                    </Button>
                                </div>
                            </>
                        )}
                        {isHotelBannerShow && (
                            <div className={classes.hotelBanner}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <HotelBanner />
                                    </Grid>
                                </Grid>
                            </div>
                        )}
                    </Container>
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
            </Desktop>
        );
    }
};

type QueryParams = {
    id: string;
};

BookingSuccess.getInitialProps = async props => {
    const { query } = props;
    const { id } = query as QueryParams;

    return {
        id,
        namespacesRequired: ['order', 'booking', 'brand'],
    };
};

export default BookingSuccess;
