import React, { useEffect } from 'react';
import { NextPage } from 'next';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Router, { useRouter } from 'next/router';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { batch, useDispatch, useSelector } from 'react-redux';
import { useInfiniteScroll } from 'react-infinite-scroll-hook';
import parseISO from 'date-fns/parseISO';
import isSameDay from 'date-fns/isSameDay';

import { RootState } from 'store';
import {
    ORDERS_ERROR,
    ORDERS_FETCHING,
    ORDERS_SUCCESS,
    OrdersState,
    OrdersType,
} from 'store/orders/types';
import {
    ordersFetching,
    ordersRefetching,
    ordersUpdateState,
} from 'store/orders/actions';
import { OrderCard } from 'components/OrderCard';
import { Button } from 'components/ui/Button';
import { NotifyDialog } from 'components/NotifyDialog';
import { OrdersSegmented } from 'components/OrdersSegmented';
import { Typo } from 'components/Typo/Typo';
import { useTranslation } from 'i18n';
import { OrdersResponseDto, OrdersResponseDtoStatusEnum } from 'swagger/client';
import Layout from 'layouts/navigation';
import { format } from 'utils/date';

import { usePlatform } from 'hooks/usePlatform';
import { Desktop } from 'layouts/desktop';
import { DesktopOrderCard } from 'components/DesktopOrderCard';
import { usePullToRefresh } from 'hooks/usePullToRefresh';
import Head from 'next/head';

type Props = {};

const useStyles = makeStyles(
    (theme: Theme) => ({
        /* Styles applied to the root element. */
        root: {},
        /* Styles applied to the `Container` component. */
        container: {
            marginTop: 16,
            marginBottom: 16,
        },
        /* Styles applied to the `OrderCard` component. */
        orderCard: {
            '& ~ &': {
                marginTop: theme.spacing(2),
            },
        },
        /* Styles applied to the loading `div` element when `status === ORDERS_FETCHING`. */
        loading: {
            marginTop: theme.spacing(2),
            textAlign: 'center',
        },
        /* Styles applied to the `OrdersSegmented` component. */
        ordersSegmented: {
            marginBottom: theme.spacing(2),
        },
        /* Styles applied to the `Container` component (desktop). */
        desktopContainer: {
            marginBottom: theme.spacing(3),
        },
        /* Styles applied to the dekstop heading `div` element. */
        desktopHeading: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: theme.spacing(3),
        },
        /* Styles applied to the `OrdersSegmented` component (desktop). */
        desktopOrdersSegmented: {
            maxWidth: 268,
        },
    }),
    { name: 'Orders' }
);

const Orders: NextPage<Props> = props => {
    const classes = useStyles();
    const { orders, status, completed, type } = useSelector<
        RootState,
        OrdersState
    >(rootState => rootState.orders);
    const dispatch = useDispatch();
    const router = useRouter();
    const { t } = useTranslation();
    const { isCordova, isMobile } = usePlatform();

    const infiniteRef = useInfiniteScroll<HTMLDivElement>({
        loading: status === ORDERS_FETCHING,
        hasNextPage: !completed,
        onLoadMore: () => {
            if (status !== ORDERS_ERROR) {
                dispatch(ordersFetching());
            }
        },
    });

    // Обновлять заказы при монтировании страницы
    useEffect(() => {
        batch(() => {
            dispatch(ordersUpdateState({ page: 0, orders: [] }));
            dispatch(ordersFetching());
        });
    }, []);

    // Scroll fix
    useEffect(() => {
        document.body.style.overflow = 'auto';
    }, []);

    const goToSearch = () => router.replace('/');
    const reload = () => router.reload();
    const handleOrderActionClick = (
        id: OrdersResponseDto['id'],
        status: OrdersResponseDto['status']
    ) => {
        if (status === OrdersResponseDtoStatusEnum.Booked) {
            if (process.env.CORDOVA) {
                router.replace({
                    pathname: '/payment',
                    query: { id },
                });
            } else {
                router.replace('/payment/[id]', `/payment/${id}`);
            }
            return;
        }

        if (process.env.CORDOVA) {
            router.push({
                pathname: '/order',
                query: { id },
            });
        } else {
            router.push('/order/[id]', `/order/${id}`);
        }
    };

    const hasNoOrders =
        completed && orders.length === 0 && status === ORDERS_SUCCESS;

    const handleOrdersSegmentedChange = (type: OrdersType) => {
        dispatch(
            ordersUpdateState({
                type,
                page: 0,
                orders: [],
                completed: false,
            })
        );
    };

    usePullToRefresh(() => {
        dispatch(ordersRefetching());
    });

    if (isCordova || isMobile) {
        return (
            <Layout>
                <div className={classes.root} ref={infiniteRef}>
                    <Container className={classes.container}>
                        <OrdersSegmented
                            value={type}
                            onChange={handleOrdersSegmentedChange}
                            className={classes.ordersSegmented}
                        />

                        {status === ORDERS_FETCHING ||
                        status === ORDERS_SUCCESS ? (
                            hasNoOrders ? (
                                <Typo color="textSecondary">
                                    {t('order:noOrders')}
                                </Typo>
                            ) : (
                                <div>
                                    {orders.map((order, i) => (
                                        <div
                                            key={order.id}
                                            className={classes.orderCard}
                                        >
                                            {i === 0 ||
                                            isNotSameDay(
                                                order.pickupStop.datetime,
                                                orders[i - 1].pickupStop
                                                    .datetime
                                            ) ? (
                                                <Typo
                                                    variant="caption"
                                                    color="textSecondary"
                                                >
                                                    {format(
                                                        parseISO(
                                                            order.pickupStop
                                                                .datetime
                                                        ),
                                                        'd MMM, EEEEEE'
                                                    )}
                                                </Typo>
                                            ) : null}
                                            <OrderCard
                                                onActionClick={
                                                    handleOrderActionClick
                                                }
                                                order={order}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )
                        ) : status === ORDERS_ERROR ? (
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
                                                {t('order:check')}
                                            </Button>
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <Button
                                                onClick={goToSearch}
                                                variant="outlined"
                                                color="primary"
                                                fullWidth
                                            >
                                                {t('order:backToSearch')}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                }
                            />
                        ) : null}

                        {status === ORDERS_FETCHING ? (
                            <div className={classes.loading}>
                                <CircularProgress />
                            </div>
                        ) : null}
                    </Container>
                </div>
            </Layout>
        );
    } else {
        return (
            <Desktop>
                <Head>
                    <title>{t('trips')}</title>
                </Head>
                <Container
                    className={classes.desktopContainer}
                    ref={infiniteRef}
                >
                    <div className={classes.desktopHeading}>
                        <Typo variant="header" weight="bold">
                            {t('trips')}
                        </Typo>

                        <OrdersSegmented
                            value={type}
                            onChange={handleOrdersSegmentedChange}
                            className={classes.desktopOrdersSegmented}
                        />
                    </div>

                    <div>
                        {status === ORDERS_FETCHING ||
                        status === ORDERS_SUCCESS ? (
                            hasNoOrders ? (
                                <Typo color="textSecondary">
                                    {t('order:noOrders')}
                                </Typo>
                            ) : (
                                <div>
                                    {orders.map((order, i) => (
                                        <div
                                            key={order.id}
                                            className={classes.orderCard}
                                        >
                                            {i === 0 ||
                                            isNotSameDay(
                                                order.pickupStop.datetime,
                                                orders[i - 1].pickupStop
                                                    .datetime
                                            ) ? (
                                                <Typo
                                                    variant="caption"
                                                    color="textSecondary"
                                                >
                                                    {format(
                                                        parseISO(
                                                            order.pickupStop
                                                                .datetime
                                                        ),
                                                        'd MMM, EEEEEE'
                                                    )}
                                                </Typo>
                                            ) : null}
                                            <DesktopOrderCard
                                                onActionClick={
                                                    handleOrderActionClick
                                                }
                                                order={order}
                                                compact
                                            />
                                        </div>
                                    ))}
                                </div>
                            )
                        ) : status === ORDERS_ERROR ? (
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
                                                {t('order:check')}
                                            </Button>
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <Button
                                                onClick={goToSearch}
                                                variant="outlined"
                                                color="primary"
                                                fullWidth
                                            >
                                                {t('order:backToSearch')}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                }
                            />
                        ) : null}

                        {status === ORDERS_FETCHING ? (
                            <div className={classes.loading}>
                                <CircularProgress />
                            </div>
                        ) : null}
                    </div>
                </Container>
            </Desktop>
        );
    }
};

Orders.getInitialProps = async props => {
    const { store, res = null } = props;
    const { user } = store.getState();
    const isLoggedIn = !!user.phoneNumber;

    if (!isLoggedIn) {
        if (process.browser) {
            Router.replace('/login');
        }
    }

    return {
        namespacesRequired: ['booking', 'order', 'brand'],
    };
};

export default Orders;

/**
 * @param date1 ISO
 * @param date2 ISO
 */
function isNotSameDay(date1: string, date2: string) {
    return !isSameDay(parseISO(date1), parseISO(date2));
}
