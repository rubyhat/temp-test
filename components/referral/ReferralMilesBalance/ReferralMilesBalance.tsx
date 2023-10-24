import React, { FC } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useRouter } from 'next/router';

import { List } from 'components/ui/List/List';
import { MILES_ERROR, MILES_FETCHING, MILES_SUCCESS } from 'store/miles/types';
import { Typo } from 'components/Typo/Typo';
import { currencySymbol } from 'utils/currency';
import { useMilesBalance } from 'hooks/useMilesBalance';
import { useTranslation } from 'i18n';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            backgroundColor: theme.palette.common.white,
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1),
            [theme.breakpoints.down('sm')]: {
                borderRadius: theme.spacing(1),
                boxShadow: theme.atlas.shadows.bottom,
            },
        },
        balanceSection: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
        },
        balance: {
            marginTop: 6,
        },
        /* Styles applied to the error `Typo` component. */
        error: {
            backgroundColor: theme.atlas.palette.text.alert,
            color: theme.atlas.palette.background.white,
        },
        list: {
            marginTop: theme.spacing(2),
        },
        /* Styles applied to the `ListItemIcon` component. */
        listItemIcon: {
            minWidth: 'unset',
        },
    }),
    { name: 'ReferralMilesBalance' }
);

type ReferralMilesBalanceProps = {
    className?: string;
};

export const ReferralMilesBalance: FC<ReferralMilesBalanceProps> = props => {
    const { className } = props;
    const classes = useStyles();
    const router = useRouter();
    const { t } = useTranslation();
    const {
        currency,
        milesBalance,
        milesEquivalentBalance,
        milesStatus,
    } = useMilesBalance();

    const milesBalanceFormat = `${milesBalance} ${t('profile:miles', {
        count: milesBalance,
    })}`;
    const milesEquivalentFormat = `${milesEquivalentBalance} ${currencySymbol[currency]}`;

    const openMilesPage = () => {
        router.push('/profile/miles');
    };

    return (
        <div className={clsx(classes.root, className)}>
            <div className={classes.balanceSection}>
                <Typo variant="caption" color="textSecondary">
                    {t('profile:milesBalance')}
                </Typo>

                <div className={classes.balance}>
                    {milesStatus === MILES_SUCCESS ? (
                        <span>
                            <Typo
                                variant="body2"
                                weight="medium"
                                component="span"
                            >
                                {milesBalanceFormat}
                            </Typo>
                            <Typo
                                variant="body2"
                                component="span"
                                color="textSecondary"
                            >
                                {' '}
                                = {milesEquivalentFormat}
                            </Typo>
                        </span>
                    ) : milesStatus === MILES_FETCHING ? (
                        <CircularProgress color="inherit" size={18} />
                    ) : milesStatus === MILES_ERROR ? (
                        <Typo className={classes.error}>{t('error')}</Typo>
                    ) : null}
                </div>
            </div>

            <List className={classes.list} disablePadding>
                <Divider component="li" variant="middle" />

                <ListItem button onClick={openMilesPage}>
                    <ListItemText primary={t('profile:referralWhatIsMiles')} />
                    <ListItemIcon className={classes.listItemIcon}>
                        <KeyboardArrowRightIcon />
                    </ListItemIcon>
                </ListItem>
            </List>
        </div>
    );
};
