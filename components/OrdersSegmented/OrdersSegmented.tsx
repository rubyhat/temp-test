import React, { FC } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import upperFirst from 'lodash/upperFirst';
import clsx from 'clsx';

import { Button } from '../ui/Button';
import { ButtonGroup } from '../ui/ButtonGroup';
import { useTranslation } from 'i18n';
import { OrdersType } from 'store/orders/types';

const useStyles = makeStyles(
    (theme: Theme) => ({
        /* Styles applied to the root element. */
        root: {},
        groupButton: {
            fontSize: theme.typography.body2.fontSize,
        },
    }),
    { name: 'OrdersSegmented' }
);

type Props = {
    value: OrdersType;
    onChange: (value: OrdersType) => void;
    className?: string;
};

const items: OrdersType[] = ['upcoming', 'old', 'all'];

export const OrdersSegmented: FC<Props> = props => {
    const { value, onChange, className } = props;
    const classes = useStyles();
    const { t } = useTranslation();

    const handleChange = (value: OrdersType) => () => onChange(value);

    return (
        <ButtonGroup
            variant="outlined"
            color="primary"
            size="medium"
            fullWidth
            className={clsx(classes.root, className)}
        >
            {items.map(item => (
                <Button
                    key={item}
                    height="100%"
                    onClick={handleChange(item)}
                    variant={item === value ? 'contained' : 'outlined'}
                    className={classes.groupButton}
                >
                    {t(`order:ordersType${upperFirst(item)}`)}
                </Button>
            ))}
        </ButtonGroup>
    );
};
