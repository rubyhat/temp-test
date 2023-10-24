import React, { FC, useEffect, useState } from 'react';
import { batch, useDispatch, useSelector } from 'react-redux';
import { fade, makeStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';

import { Button } from '../ui/Button';
import { useTranslation } from 'i18n';
import { loyaltyFetching } from 'store/loyalty/actions';
import { TextField } from '../ui/TextField/TextField';
import { RootState } from 'store';
import { LoyaltyState } from 'store/loyalty/types';
import useSnackBar from '../ui/Snackbar/useSnackbar';
import { OrderState } from 'store/order/types';
import { orderResetLoyaltyInfo } from 'store/order/actions';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            backgroundColor: '#FFF',
        },
        /* Styles applied to the container `div` element. */
        container: {
            display: 'flex',
            justifyContent: 'space-between',
        },
        /* Styles applied to the promocode apply `Button` component. */
        button: {
            marginLeft: theme.spacing(2),
            minWidth: 104,
        },
        /* Styles applied to the delete promocode `Button` component. */
        deletePromocodeButton: {
            marginLeft: theme.spacing(2),
            color: theme.atlas.palette.text.alert,
            minWidth: 104,
            '&.MuiButton-outlined': {
                border: `1px solid ${theme.atlas.palette.text.alert}`,
                '&:hover': {
                    backgroundColor: fade(theme.atlas.palette.text.alert, 0.08),
                },
                '&:active': {
                    backgroundColor: fade(theme.atlas.palette.text.alert, 0.16),
                },
            },
        },
    }),
    { name: 'Promocode' }
);

type Props = {
    orderId: string;
    className?: string;
};

export const Promocode: FC<Props> = props => {
    const { orderId, className } = props;
    const classes = useStyles();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { promocodeApplied, promocodeError, withPromocode } = useSelector<
        RootState,
        LoyaltyState
    >(rootState => rootState.loyalty);
    const { order } = useSelector<RootState, OrderState>(
        rootState => rootState.order
    );
    const loyaltyInfo = order && order.loyaltyInfo;
    const [, snackbar] = useSnackBar();

    const [promocode, setPromocode] = useState('');
    const handlePromocodeChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setPromocode(e.target.value);

    const applyPromocode = () => {
        if (order) {
            dispatch(loyaltyFetching(orderId, promocode));
        }
    };
    const deletePromocode = () => {
        setPromocode('');
        if (order) {
            batch(() => {
                dispatch(orderResetLoyaltyInfo());
                dispatch(loyaltyFetching(orderId, ''));
            });
        }
    };

    useEffect(() => {
        if (
            loyaltyInfo &&
            loyaltyInfo.promocode &&
            loyaltyInfo.promocode.value
        ) {
            setPromocode(loyaltyInfo.promocode.value);
        }
    }, [loyaltyInfo]);

    useEffect(() => {
        if (promocodeApplied === true) {
            snackbar({
                type: 'show',
                payload: {
                    variant: 'success',
                    message: t('booking:promocodeApplied'),
                },
            });
        } else if (promocodeApplied === false) {
            snackbar({
                type: 'show',
                payload: {
                    variant: 'alert',
                    message: promocodeError || t('booking:promocodeNotApplied'),
                },
            });
        }
    }, [promocodeApplied]);

    const promocodeSet =
        !!promocodeApplied ||
        !!(!withPromocode && loyaltyInfo && loyaltyInfo.promocode.applied);

    return (
        <div className={clsx(classes.root, className)}>
            <div className={classes.container}>
                <TextField
                    value={promocode}
                    onChange={handlePromocodeChange}
                    label={t('booking:promocode')}
                    variant="outlined"
                    disabled={promocodeSet}
                    fullWidth
                />

                {promocodeSet ? (
                    <Button
                        className={classes.deletePromocodeButton}
                        onClick={deletePromocode}
                        color="primary"
                        variant="outlined"
                    >
                        {t('booking:deletePromocode')}
                    </Button>
                ) : (
                    <Button
                        className={classes.button}
                        onClick={applyPromocode}
                        disabled={promocode.length === 0}
                        color="primary"
                        variant="outlined"
                    >
                        {t('booking:applyPromocode')}
                    </Button>
                )}
            </div>
        </div>
    );
};
