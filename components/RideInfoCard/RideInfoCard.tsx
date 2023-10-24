import React from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { useTranslation } from 'i18n';

import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';

import parseISO from 'date-fns/parseISO';
import addMinutes from 'date-fns/addMinutes';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { TripBenefits } from 'components/Trip/TripBenefits';

import {
    formatDaysHoursMinutes,
    getTimeDifferenceWithTimezone,
} from 'utils/time';
import { format } from 'utils/date';
import { formatBusColor } from 'utils/ride';
import { currencySymbol, CurrencySymbol } from 'utils/currency';
import { useCountry } from 'hooks/useCountry';

import { RootState } from 'store';
import { BookingState } from 'store/booking/types';
import { RideState } from 'store/ride/types';
import { useSelector } from 'react-redux';
import {
    OrderDto,
    OrderDtoPaymentMethodEnum,
    OrderDtoStatusEnum,
    RideDto,
    RideDtoBenefitsEnum,
} from 'swagger/client';

import { useStyles } from './styles';
import { useGetSeats } from 'components/DesktopRideInfoCard.tsx/useGetSeats';
interface RideInfoCard {
    order: OrderDto;
}
export const RideInfoCard = (props: RideInfoCard) => {
    const { order } = props;
    const { t } = useTranslation();
    const classes = useStyles();
    const { country } = useCountry();

    const { rideInfo: ride } = useSelector<RootState, RideState>(
        rootState => rootState.ride
    );
    const isSeatingSchemeEnable =
        ride && ride.seatingScheme && ride.seatingScheme.length > 0;
    const isDynamicMode = false; //order.rideInfo && order.rideInfo.dynamicMode;

    // места пассажиров
    const currentSeats = useGetSeats(order);

    // время в пути
    const duration = getTimeDifferenceWithTimezone(
        order.pickupStop.datetime,
        order.dischargeStop.datetime,
        order.pickupStop.timezone,
        order.dischargeStop.timezone
    );
    const displayDuration = formatDaysHoursMinutes(duration, t);

    // дата отправления
    const formattedDate = format(
        parseISO(order.pickupStop.datetime),
        'd MMM, EEEEEE'
    );
    const formattedDateArrival = format(
        parseISO(order.dischargeStop.datetime),
        'd MMM, EEEEEE'
    );

    // время отправления
    const localDeparture = parseISO(order.pickupStop.datetime);
    const departureTime = format(localDeparture, 'HH:mm');
    const departureTimeExtended = format(
        addMinutes(localDeparture, 10),
        'HH:mm'
    );
    const d2dDepartureTime = `${departureTime} - ${departureTimeExtended}`;

    // время прибытия
    const localArrival = parseISO(order.dischargeStop.datetime);
    const arrivalTime = format(localArrival, 'HH:mm');
    const arrivalTimeExtended = format(addMinutes(localArrival, 10), 'HH:mm');
    const d2dArrivalTime = `${arrivalTime} - ${arrivalTimeExtended}`;

    // параметры автобуса
    const bus = order.rideInfo && order.rideInfo.bus;
    const busColor = bus && bus.color ? formatBusColor(bus.color) : '';
    const busNumber = bus && bus.reg;
    const isMeteor =
        order.rideInfo &&
        order.rideInfo.benefits &&
        order.rideInfo.benefits.includes(RideDtoBenefitsEnum.Meteor);
    const isBigBus =
        order.rideInfo &&
        order.rideInfo.benefits &&
        order.rideInfo.benefits.includes(RideDtoBenefitsEnum.BigBus);
    const busType =
        order.rideInfo && order.rideInfo.rideType === 'shuttle'
            ? t('shuttle')
            : isBigBus
            ? t('bus')
            : isMeteor
            ? t('benefitMeteor')
            : t('minibus');

    // статус заказа
    const paidInCash =
        order &&
        order.paymentMethod === OrderDtoPaymentMethodEnum.Cash &&
        order.status === OrderDtoStatusEnum.Active;

    // стоимость заказа
    const totalPrice =
        order.paymentMethod === 'cash' ? order.price : order.onlinePrice;

    const currency =
        (order.rideInfo && (order.rideInfo.currency as CurrencySymbol)) ||
        undefined;

    const benefits = order.rideInfo ? order.rideInfo.benefits : [];
    return (
        <>
            {order && order.rideInfo && (
                <div className={classes.root}>
                    <div className={clsx(classes.grayText, classes.dateTag)}>
                        {formattedDate}
                    </div>
                    <div className={classes.card}>
                        <div className={classes.cardHeader}>
                            <h5 className={classes.cardHeaderTitle}>
                                {`${order.rideInfo.from.desc} — ${order.rideInfo.to.desc}`}
                            </h5>
                            <p
                                className={clsx(
                                    classes.cardHeaderSubtitle,
                                    classes.grayText
                                )}
                            >
                                {t('travelTime') + ':' + displayDuration}
                            </p>
                        </div>

                        {isDynamicMode ? (
                            <>
                                <div
                                    className={clsx(
                                        classes.cardAlert,
                                        classes.cardAlertInfo
                                    )}
                                >
                                    <p className={classes.cardAlertText}>
                                        Точное время подачи машины сформируется
                                        за <strong>45 минут</strong>. Вы сможете
                                        посмотреть его в{' '}
                                        <Link href="/orders">
                                            ваших поездках
                                        </Link>
                                        , а так же мы пришлем вам смс с точным
                                        временем.
                                    </p>
                                </div>
                                <div className={classes.rideInfo}>
                                    <div className={classes.rideInfoItem}>
                                        <div className={classes.rideInfoTime}>
                                            <strong>{d2dDepartureTime}</strong>
                                            <span>Интервал подачи машины</span>
                                            <p className={classes.grayText}>
                                                {formattedDate}
                                            </p>
                                        </div>
                                        <div
                                            className={classes.rideInfoContent}
                                        >
                                            <h6
                                                className={
                                                    classes.rideInfoContentTitle
                                                }
                                            >
                                                {order.rideInfo.from.desc}
                                            </h6>
                                            <p className={classes.grayText}>
                                                {order.pickupStop.desc}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={classes.rideInfoItem}>
                                        <div
                                            className={classes.rideInfoTime}
                                        ></div>
                                        <div
                                            className={classes.rideInfoContent}
                                        >
                                            <div
                                                className={classes.waitingTime}
                                            >
                                                <p className={classes.grayText}>
                                                    Время нахождения авто на
                                                    остановке:
                                                    <strong>1 минута</strong>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={classes.rideInfoItem}>
                                        <div className={classes.rideInfoTime}>
                                            <strong>{d2dArrivalTime}</strong>
                                            <span>Время прибытия</span>
                                            <p className={classes.grayText}>
                                                {formattedDateArrival}
                                            </p>
                                        </div>
                                        <div
                                            className={classes.rideInfoContent}
                                        >
                                            <h6
                                                className={
                                                    classes.rideInfoContentTitle
                                                }
                                            >
                                                {order.rideInfo.to.desc}
                                            </h6>
                                            <p className={classes.grayText}>
                                                {order.dischargeStop.desc}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className={classes.rideInfoRegular}>
                                <div
                                    className={classes.rideInfoItem}
                                    style={{
                                        marginBottom: 12,
                                    }}
                                >
                                    <div className={classes.rideInfoTime}>
                                        <strong>{departureTime}</strong>
                                        <p className={classes.grayText}>
                                            {formattedDate}
                                        </p>
                                    </div>
                                    <div className={classes.rideInfoContent}>
                                        <h6
                                            className={
                                                classes.rideInfoContentTitle
                                            }
                                        >
                                            {order.rideInfo.from.desc}
                                        </h6>
                                        <p className={classes.grayText}>
                                            {order.pickupStop.desc}
                                        </p>
                                    </div>
                                </div>
                                <div className={classes.rideInfoItem}>
                                    <div className={classes.rideInfoTime}>
                                        <strong>{arrivalTime}</strong>
                                        <p className={classes.grayText}>
                                            {formattedDateArrival}
                                        </p>
                                    </div>
                                    <div className={classes.rideInfoContent}>
                                        <h6
                                            className={
                                                classes.rideInfoContentTitle
                                            }
                                        >
                                            {order.rideInfo.to.desc}
                                        </h6>
                                        <p className={classes.grayText}>
                                            {order.dischargeStop.desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                        <List className={classes.rideInfoList}>
                            <ListItem className={classes.rideInfoListItem}>
                                <p
                                    className={clsx(
                                        classes.grayText,
                                        classes.rideInfoListItemTitle
                                    )}
                                >
                                    {busType}
                                </p>
                                <p>
                                    {busColor}, {busNumber}
                                </p>
                            </ListItem>
                            <ListItem className={classes.rideInfoListItem}>
                                <p
                                    className={clsx(
                                        classes.grayText,
                                        classes.rideInfoListItemTitle
                                    )}
                                >
                                    {t('order:orderStatusLabel')}
                                </p>
                                <p>
                                    {paidInCash
                                        ? t('order:orderStatusActiveCash', {
                                              context: country,
                                          })
                                        : t(
                                              `order:orderStatus${upperFirst(
                                                  camelCase(order.status)
                                              )}`
                                          )}
                                </p>
                            </ListItem>
                            {isSeatingSchemeEnable && (
                                <ListItem className={classes.rideInfoListItem}>
                                    <p
                                        className={clsx(
                                            classes.grayText,
                                            classes.rideInfoListItemTitle
                                        )}
                                    >
                                        {t('selectSeatTitle')}
                                    </p>
                                    <p> № {currentSeats.join(', ')} </p>
                                </ListItem>
                            )}
                            <ListItem className={classes.rideInfoListItem}>
                                <Link href={`/order/${order.id}`}>
                                    <strong className={classes.detailsLink}>
                                        {t('order:details')}
                                    </strong>
                                </Link>

                                <strong className={classes.detailsPrice}>
                                    {totalPrice}{' '}
                                    {currency && currencySymbol[currency]}
                                </strong>
                            </ListItem>
                        </List>
                        <div className={classes.cardFooter}>
                            {benefits && (
                                <TripBenefits
                                    ride={order.rideInfo as RideDto}
                                    benefits={benefits}
                                    className={classes.tripBenefits}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
