import React, { FC } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

import SurgeIcon from 'components/icons/Surge';
import { CurrencySymbol, currencySymbol } from 'utils/currency';
import { LastSearchState } from 'store/last-search/types';
import { OnlinePaymentBadge } from './OnlinePaymentBadge';
import { RootState } from 'store';
import { SURGE_DEFAULT_COLOR } from 'components/Surge/constants';
import { SearchDto } from 'swagger/client';
import { SearchRidesState } from 'store/search-rides/types';
import { SurgeBadge } from './SurgeBadge';
import { Typo } from 'components/Typo/Typo';
import { rideMinPrice } from 'utils/ride';
import { useBadges } from 'hooks/useBadges';
import { useSAAS } from 'hooks/useSAAS';
import { useTranslation } from 'i18n';

const useStyles = makeStyles(
    theme => ({
        /* Styles applied to the root element. */
        root: {},
        price: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'flex-end',
        },
        priceSurged: {
            color: SURGE_DEFAULT_COLOR,
        },
        surgeIcon: {
            marginRight: theme.spacing(0.5),
        },
        badgeContainer: {
            textAlign: 'right',
        },
        SurgeBadge: {
            display: 'inline-block',
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
        },
        OnlinePaymentBadge: {
            display: 'inline-block',
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
        },
        perSeatText: {
            textAlign: 'right',
        },
        noSeatsText: {
            textAlign: 'right',
            color: theme.palette.error.main,
        },
        freeCountSeats: {
            textTransform: 'lowercase',
            textAlign: 'right',
        },
    }),
    { name: 'DesktopTripPriceColumn' }
);

type DesktopTripPriceColumnProps = {
    className?: string;
    ride: SearchDto;
};

export const DesktopTripPriceColumn: FC<
    DesktopTripPriceColumnProps
> = props => {
    const { className, ride } = props;
    const classes = useStyles();
    const { t } = useTranslation();
    const { meta } = useSAAS();
    const { rides } = useSelector<RootState, SearchRidesState>(
        rootState => rootState.searchRides
    );

    const { lastSearch } = useSelector<RootState, LastSearchState>(
        rootState => rootState.lastSearch
    );
    const passengersCount = lastSearch ? lastSearch.passengers : 0;

    const {
        displaySurgedBadge,
        displayBadgeType,
        onlinePaymentBadgeEnabled,
    } = useBadges(ride);

    const currency = ride.currency as CurrencySymbol;
    const price = rideMinPrice(ride.price, ride.onlinePrice, ride.paymentTypes);

    return (
        <div className={clsx(classes.root, className)}>
            <div
                className={clsx(classes.price, {
                    [classes.priceSurged]: displaySurgedBadge,
                })}
                style={{
                    color: displaySurgedBadge ? meta.surgeColor : undefined,
                }}
            >
                {displaySurgedBadge && (
                    <SurgeIcon
                        className={clsx(classes.surgeIcon)}
                        color="inherit"
                    />
                )}

                <Typo variant="subtitle" weight="bold">
                    {price} {currencySymbol[currency]}
                </Typo>
            </div>

            <div className={classes.badgeContainer}>
                {displaySurgedBadge ? ( // У сурджа приоритет перед бейджом "Можно картой"
                    <Tooltip title={<Typo>{t(`search:surgeCardText`)}</Typo>}>
                        <SurgeBadge className={classes.SurgeBadge} />
                    </Tooltip>
                ) : onlinePaymentBadgeEnabled ? (
                    <Tooltip
                        title={
                            <Typo>
                                {t(
                                    `search:only${displayBadgeType}BadgeTooltipText`
                                )}
                            </Typo>
                        }
                    >
                        <OnlinePaymentBadge
                            className={classes.OnlinePaymentBadge}
                            type={displayBadgeType}
                        />
                    </Tooltip>
                ) : null}
            </div>

            <Typo className={classes.perSeatText} color="textSecondary">
                {t('search:perSeat', {
                    count: passengersCount,
                })}
            </Typo>

            {ride.freeSeats === 0 ? (
                <Typo className={classes.noSeatsText}>
                    {t('search:noSeats')}
                </Typo>
            ) : (
                <Typo className={classes.freeCountSeats} color="textSecondary">
                    {t('search:freeCountSeats', {
                        count: ride.freeSeats >= 5 ? 5 : ride.freeSeats,
                        plus: ride.freeSeats > 5 ? '+' : '',
                    })}
                </Typo>
            )}
        </div>
    );
};
