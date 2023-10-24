import React, { FC } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

import { List } from '../ui/List/List';
import {
    MILES_ERROR,
    MILES_FETCHING,
    MILES_SUCCESS,
    MilesState,
} from 'store/miles/types';
import { RootState } from 'store';
import { Typo } from '../Typo/Typo';
import { countryCurrency, currencySymbol } from 'utils/currency';
import { useTranslation } from 'i18n';
import { AtlasTheme } from 'typings/atlas-theme';
import { detectCountryByPhone } from 'utils/country';
import { UserState } from 'store/user/types';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            backgroundColor: '#FFF',
        },
        /* Styles applied to the error `Typo` component. */
        error: {
            backgroundColor: theme.atlas.palette.text.alert,
            color: theme.atlas.palette.background.white,
        },
    }),
    { name: 'MilesBalance' }
);

type Props = {
    className?: string;
};

export const MilesBalance: FC<Props> = props => {
    const { className } = props;
    const classes = useStyles();
    const { t } = useTranslation();
    const {
        balance: milesBalance,
        currency: milesCurrency,
        status: milesStatus,
    } = useSelector<RootState, MilesState>(rootState => rootState.miles);
    const user = useSelector<RootState, UserState>(rootState => rootState.user);

    const country = detectCountryByPhone(user.phoneNumber) || 'BY';
    const currency = countryCurrency[country];
    const milesEquivalent = milesCurrency.find(item => item.code === currency);
    const milesEquivalentBalance = milesEquivalent
        ? milesEquivalent.balance
        : 0;

    const milesBalanceFormat = `${milesBalance} ${t('profile:miles', {
        count: milesBalance,
    })}`;
    const milesEquivalentFormat = `${milesEquivalentBalance} ${currencySymbol[currency]}`;

    return (
        <List className={clsx(classes.root, className)}>
            <ListItem>
                <ListItemText primary={t('profile:milesBalance')} />
                <ListItemSecondaryAction>
                    <ListItemText
                        primary={
                            milesStatus === MILES_SUCCESS ? (
                                milesBalanceFormat
                            ) : milesStatus === MILES_FETCHING ? (
                                <CircularProgress color="inherit" size={18} />
                            ) : milesStatus === MILES_ERROR ? (
                                <Typo className={classes.error}>
                                    {t('error')}
                                </Typo>
                            ) : null
                        }
                    />
                </ListItemSecondaryAction>
            </ListItem>

            <Divider component="li" variant="middle" />

            <ListItem>
                <ListItemText primary={t('profile:milesEquivalent')} />
                <ListItemSecondaryAction>
                    <ListItemText
                        primary={
                            milesStatus === MILES_SUCCESS ? (
                                milesEquivalentFormat
                            ) : milesStatus === MILES_FETCHING ? (
                                <CircularProgress color="inherit" size={18} />
                            ) : milesStatus === MILES_ERROR ? (
                                <Typo className={classes.error}>
                                    {t('error')}
                                </Typo>
                            ) : null
                        }
                    />
                </ListItemSecondaryAction>
            </ListItem>
        </List>
    );
};
