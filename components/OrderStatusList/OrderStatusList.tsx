import React, { FC } from 'react';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import camelCase from 'lodash/camelCase';
import clsx from 'clsx';
import upperFirst from 'lodash/upperFirst';
import { makeStyles, Theme } from '@material-ui/core/styles';

import {
    OrderDto,
    OrderDtoPaymentMethodEnum,
    OrderDtoStatusEnum,
} from 'swagger/client';
import { Typo } from '../Typo/Typo';
import { calculateTimeBeforeDeparture, getRideTimeStatus } from 'utils/time';
import { useTranslation } from 'i18n';
import { useCountry } from 'hooks/useCountry';

const useStyles = makeStyles(
    (theme: Theme) => ({
        /* Styles applied to the root element. */
        root: {},
    }),
    { name: 'OrderStatusList' }
);

type Props = {
    order: OrderDto;
    className?: string;
};

export const OrderStatusList: FC<Props> = props => {
    const { order, className } = props;
    const classes = useStyles();
    const { t } = useTranslation();
    const { country } = useCountry();

    const paidInCash =
        order &&
        order.paymentMethod === OrderDtoPaymentMethodEnum.Cash &&
        order.status === OrderDtoStatusEnum.Active;
    const rideTimeStatus = getRideTimeStatus(
        order.pickupStop.datetime,
        order.pickupStop.timezone,
        order.dischargeStop.datetime,
        order.dischargeStop.timezone
    );
    const timeBeforeDeparture = calculateTimeBeforeDeparture(
        order.pickupStop.datetime,
        order.pickupStop.timezone,
        t
    );

    return (
        <List className={clsx(classes.root, className)}>
            <ListItem>
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
            </ListItem>

            <Divider component="li" variant="middle" />

            <ListItem>
                <ListItemText
                    primary={
                        <Typo color="textSecondary">
                            {rideTimeStatus === -1
                                ? t('order:timeBeforeDeparture')
                                : rideTimeStatus === 0
                                ? t('order:busOnTheWay')
                                : t('order:tripCompleted')}
                        </Typo>
                    }
                />
                {rideTimeStatus === -1 ? (
                    <ListItemSecondaryAction>
                        <ListItemText
                            primary={
                                <Typo color="textPrimary">
                                    {timeBeforeDeparture}
                                </Typo>
                            }
                        />
                    </ListItemSecondaryAction>
                ) : null}
            </ListItem>
        </List>
    );
};
