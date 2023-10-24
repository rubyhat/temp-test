import React, { FC } from 'react';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import camelCase from 'lodash/camelCase';
import upperFirst from 'lodash/upperFirst';

import { List } from 'components/ui/List/List';
import { Route } from '../Route';
import { Typo } from '../Typo/Typo';
import {
    OrdersResponseDto,
    OrdersResponseDtoPaymentMethodEnum,
    OrdersResponseDtoStatusEnum,
} from 'swagger/client';
import { useTranslation } from 'i18n';
import { Button } from '../ui/Button';
import { useCountry } from 'hooks/useCountry';
import { D2DBookedInfoPaper } from 'components/d2d/D2DBookedInfoPaper';
import {
    benefitsHiddenAreaHeight,
    TripBenefits,
} from 'components/Trip/TripBenefits';
import { FromCityToCity } from 'components/OrderCard/FromCityToCity';
import { OrderCardBusType } from './OrderCardBusType';
import { AtlasTheme } from 'typings/atlas-theme';
import { useSAAS } from 'hooks/useSAAS';

type Props = {
    className?: string;
    order: OrdersResponseDto;
    onActionClick?: (
        id: OrdersResponseDto['id'],
        status: OrdersResponseDto['status']
    ) => void;
};

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {},
        card: {
            paddingTop: theme.spacing(2),
            paddingRight: theme.spacing(2),
            paddingLeft: theme.spacing(2),
            boxShadow: theme.atlas.shadows.bottom,
            backgroundColor: '#FFF',
            position: 'relative',
        },
        /* Styles applied to the `Route` component. */
        Route: {
            marginTop: theme.spacing(1),
        },
        /* Styles applied to the `FromCityToCity` component. */
        FromCityToCity: {},
        /* Styles applied to the `ListItem` component. */
        listItem: {
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(2),
        },
        /* Styles applied to the `ListItem` if children includes ListItemSecondaryAction. */
        listItemSecondaryAction: {
            paddingRight: 0,
        },
        /* Styles applied to the `ListItemSecondaryAction` component. */
        secondaryAction: {
            right: 0,
        },
        orderCardBusTypeContainer: {
            marginTop: theme.spacing(2),
        },
        orderCardBusTypeDivider: {
            marginTop: theme.spacing(1),
        },
        d2dBookedInfoPaperContainer: {
            marginTop: theme.spacing(2),
        },
        d2dBookedInfoDivider: {
            marginTop: theme.spacing(1),
        },
        /* Styles applied to the `TripBenefits` component. */
        tripBenefits: {
            paddingTop: benefitsHiddenAreaHeight,
            marginTop: -benefitsHiddenAreaHeight,
        },
        seat: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            margin: '8px 0',
        },
    }),
    { name: 'OrderCard' }
);

export const OrderCard: FC<Props> = props => {
    const { order, className, onActionClick = () => {} } = props;
    const { pickupStop, dischargeStop } = order;
    const { rideInfo } = order;
    const classes = useStyles();
    const { t } = useTranslation();
    const { country } = useCountry();
    const { isMioTaxi } = useSAAS();

    const paidInCash =
        order.paymentMethod === OrdersResponseDtoPaymentMethodEnum.Cash &&
        order.status === OrdersResponseDtoStatusEnum.Active;

    const handleActionClick = () => {
        onActionClick(order.id, order.status);
    };
    const needToConfirm = order.status === OrdersResponseDtoStatusEnum.Booked;

    const renderSeats = () => {
        const seats: string[] = [];
        order.tickets.forEach(ticket => {
            if (ticket.passenger.seat) seats.push(`№ ${ticket.passenger.seat}`);
        });
        return seats.join(', ');
    };

    const orderCardNodeTaxi = (
        <div className={classes.card}>
            <FromCityToCity
                className={classes.FromCityToCity}
                fromCity={rideInfo.from}
                toCity={rideInfo.to}
            />

            <Route
                className={classes.Route}
                departureDate={order.pickupStop.datetime}
                arrivalDate={order.dischargeStop.datetime}
                departureName={order.pickupStop.desc}
                arrivalName={order.dischargeStop.desc}
                departureTimezone={order.pickupStop.timezone}
                arrivalTimezone={order.dischargeStop.timezone}
                order={order}
            />

            {rideInfo.bus ? (
                <div className={classes.orderCardBusTypeContainer}>
                    <OrderCardBusType bus={rideInfo.bus} />

                    <Divider
                        className={classes.orderCardBusTypeDivider}
                        variant="fullWidth"
                    />
                </div>
            ) : null}

            {pickupStop.dynamic || dischargeStop.dynamic ? (
                <div className={classes.d2dBookedInfoPaperContainer}>
                    <D2DBookedInfoPaper ride={order.rideInfo} order={order} />

                    <Divider
                        className={classes.d2dBookedInfoDivider}
                        variant="fullWidth"
                    />
                </div>
            ) : null}

            <List disablePadding>
                <ListItem disableGutters className={classes.listItem}>
                    <Button
                        onClick={handleActionClick}
                        color="primary"
                        height="auto"
                    >
                        {needToConfirm
                            ? t('order:confirm')
                            : t('order:details')}
                    </Button>
                    <ListItemSecondaryAction
                        className={classes.secondaryAction}
                    >
                        <ListItemText
                            primary={
                                <Typo color="textSecondary">
                                    {paidInCash
                                        ? t('order:orderStatusActiveCash', {
                                              context: country,
                                          })
                                        : t(
                                              `order:orderStatus${upperFirst(
                                                  camelCase(order.status)
                                              )}`
                                          )}
                                </Typo>
                            }
                        />
                    </ListItemSecondaryAction>
                </ListItem>
            </List>
        </div>
    );

    const orderCardNode = (
        <div className={classes.card}>
            <FromCityToCity
                className={classes.FromCityToCity}
                fromCity={rideInfo.from}
                toCity={rideInfo.to}
            />

            <Route
                className={classes.Route}
                departureDate={order.pickupStop.datetime}
                arrivalDate={order.dischargeStop.datetime}
                departureName={order.pickupStop.desc}
                arrivalName={order.dischargeStop.desc}
                departureTimezone={order.pickupStop.timezone}
                arrivalTimezone={order.dischargeStop.timezone}
                order={order}
            />

            {rideInfo.bus ? (
                <div className={classes.orderCardBusTypeContainer}>
                    <OrderCardBusType bus={rideInfo.bus} />

                    <Divider
                        className={classes.orderCardBusTypeDivider}
                        variant="fullWidth"
                    />
                </div>
            ) : null}

            {false && renderSeats().length > 0 && (
                <>
                    <Typo className={classes.seat}>
                        <span style={{ color: '#68787D' }}>
                            {t('selectSeatTitle')}:
                        </span>
                        <span>{renderSeats()}</span>
                    </Typo>
                    <Divider
                        className={classes.orderCardBusTypeDivider}
                        variant="fullWidth"
                    />
                </>
            )}

            {pickupStop.dynamic || dischargeStop.dynamic ? (
                <div className={classes.d2dBookedInfoPaperContainer}>
                    <D2DBookedInfoPaper ride={order.rideInfo} order={order} />

                    <Divider
                        className={classes.d2dBookedInfoDivider}
                        variant="fullWidth"
                    />
                </div>
            ) : null}

            <List disablePadding>
                <ListItem disableGutters className={classes.listItem}>
                    <Button
                        onClick={handleActionClick}
                        color="primary"
                        height="auto"
                    >
                        {needToConfirm
                            ? t('order:confirm')
                            : t('order:details')}
                    </Button>
                    <ListItemSecondaryAction
                        className={classes.secondaryAction}
                    >
                        <ListItemText
                            primary={
                                <Typo color="textSecondary">
                                    {paidInCash
                                        ? t('order:orderStatusActiveCash', {
                                              context: country,
                                          })
                                        : t(
                                              `order:orderStatus${upperFirst(
                                                  camelCase(order.status)
                                              )}`
                                          )}
                                </Typo>
                            }
                        />
                    </ListItemSecondaryAction>
                </ListItem>
            </List>
        </div>
    );

    return (
        <div className={clsx(classes.root, className)}>
            {isMioTaxi ? orderCardNodeTaxi : orderCardNode}

            {!isMioTaxi && (
                <TripBenefits
                    className={classes.tripBenefits}
                    ride={rideInfo}
                    benefits={rideInfo.benefits || []}
                />
            )}
        </div>
    );
};
