import React, { FC } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';

import {
    OrderDto,
    OrdersResponseDto,
    OrdersResponseDtoPaymentMethodEnum,
    OrdersResponseDtoStatusEnum,
} from 'swagger/client';
import { useTranslation } from 'i18n';
import { useCountry } from 'hooks/useCountry';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {},
        /* Styles applied to the item `div` element. */
        item: {
            color: theme.atlas.palette.text.minor,
            '& ~ &': {
                marginTop: theme.spacing(1),
            },
        },
    }),
    { name: 'DesktopOrderInfo' }
);

type Props = {
    order: OrdersResponseDto | OrderDto;
};

export const DesktopOrderInfo: FC<Props> = props => {
    const { order } = props;
    const classes = useStyles();
    const { t } = useTranslation();
    const { country } = useCountry();

    const paidAndActive =
        order.paymentMethod === OrdersResponseDtoPaymentMethodEnum.Cash &&
        order.status === OrdersResponseDtoStatusEnum.Active;
    const orderStatusLocalized = paidAndActive
        ? t('order:orderStatusActiveCash', {
              context: country,
          })
        : t(`order:orderStatus${upperFirst(camelCase(order.status))}`);

    return (
        <div className={classes.root}>
            <div className={classes.item}>{orderStatusLocalized}</div>
        </div>
    );
};
