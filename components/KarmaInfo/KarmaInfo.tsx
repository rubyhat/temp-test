import React, { FC } from 'react';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

import { KarmaState } from 'store/karma/types';
import { List } from '../ui/List/List';
import { RootState } from 'store';
import { countryCurrency, currencySymbol } from 'utils/currency';
import { formatPrice } from 'utils/price';
import { useTranslation } from 'i18n';
import { detectCountryByPhone } from 'utils/country';
import { UserState } from 'store/user/types';

const useStyles = makeStyles(
    (theme: Theme) => ({
        /* Styles applied to the root element. */
        root: {
            backgroundColor: '#FFF',
            borderRadius: 'inherit',
        },
    }),
    { name: 'KarmaInfo' }
);

type Props = {
    className?: string;
};

export const KarmaInfo: FC<Props> = props => {
    const { className } = props;
    const classes = useStyles();
    const { t } = useTranslation();
    const { karma, limit, maxLimit } = useSelector<RootState, KarmaState>(
        rootState => rootState.karma
    );
    const user = useSelector<RootState, UserState>(rootState => rootState.user);

    const country = detectCountryByPhone(user.phoneNumber) || 'BY';
    const thisCurrency = countryCurrency[country];
    const limitRound = Math.floor(limit / 100);
    const maxLimitRound = Math.floor(maxLimit / 100);

    return (
        <List className={clsx(classes.root, className)}>
            <ListItem>
                <ListItemText primary={t('profile:myKarma')} />
                <ListItemSecondaryAction>
                    <ListItemText primary={karma} />
                </ListItemSecondaryAction>
            </ListItem>

            <Divider component="li" variant="middle" />

            <ListItem>
                <ListItemText primary={t('profile:karmaMaxLimit')} />
                <ListItemSecondaryAction>
                    <ListItemText
                        primary={formatPrice(
                            maxLimitRound,
                            currencySymbol[thisCurrency]
                        )}
                    />
                </ListItemSecondaryAction>
            </ListItem>

            <Divider component="li" variant="middle" />

            <ListItem>
                <ListItemText primary={t('profile:karmaLimit')} />
                <ListItemSecondaryAction>
                    <ListItemText
                        primary={formatPrice(
                            limitRound,
                            currencySymbol[thisCurrency]
                        )}
                    />
                </ListItemSecondaryAction>
            </ListItem>
        </List>
    );
};
