import React, { FC } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

import {
    countryCurrency,
    CurrencySymbol,
    currencySymbol,
} from 'utils/currency';
import { ConnectingInfoCard } from 'components/connecting/ConnectingInfoCard';
import { ConnectingSeoBlock } from 'components/connecting/ConnectingSeoBlock';
import { CountryState } from 'store/country/types';
import { ConnectingDivider } from 'components/connecting/ConnectingDivider';
import { ConnectingLegCard } from 'components/connecting/ConnectingLegCard';
import { RootState } from 'store';
import { SeoDtoResponse } from 'swagger/client';
import { Typo } from 'components/Typo/Typo';
import { findMinPrice } from 'utils/findMinPrice';
import { formatPrice } from 'utils/price';
import { getConnectingCities } from 'sagas/connecting-trips';
import { useTranslation } from 'i18n';

const useStyles = makeStyles(
    theme => ({
        /* Styles applied to the root element. */
        root: {},
        /* Styles applied to the `ConnectingInfoCard` component. */
        ConnectingInfoCard: {
            marginTop: theme.spacing(2),
        },
        /* Styles applied to the legs `div` element. */
        legs: {
            marginTop: theme.spacing(2),
        },
        /* Styles applied to the `DesktopConnectingDivider` component. */
        DesktopConnectingDivider: {
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2),
        },
        /* Styles applied to the `ConnectingSeoBlock` component. */
        ConnectingSeoBlock: {
            marginTop: theme.spacing(2),
        },
    }),
    { name: 'ConnectingPage' }
);

type ConnectingPageProps = {
    className?: string;
    seoDirection: SeoDtoResponse;
};

export const ConnectingPage: FC<ConnectingPageProps> = props => {
    const { className, seoDirection } = props;
    const classes = useStyles();
    const { t } = useTranslation();

    const { fromName, toName, stopOver, minPrices } = seoDirection;

    const { country } = useSelector<RootState, CountryState>(
        rootState => rootState.country
    );
    const defaultCurrency = countryCurrency[country];
    const minPrice = findMinPrice(minPrices, defaultCurrency);
    const formattedPrice = minPrice
        ? formatPrice(
              minPrice.price,
              currencySymbol[minPrice.currency as CurrencySymbol]
          )
        : '';

    if (!stopOver) return null; // уже проверено в серпе

    const { legs } = stopOver;

    return (
        <div className={clsx(classes.root, className)}>
            <Typo variant="title" weight="bold">
                {t('search:connectingSeoPageTitle', {
                    fromCity: fromName,
                    toCity: toName,
                    connectingCity: getConnectingCities(legs).join(','),
                    price:
                        formattedPrice &&
                        t('fromPrice', { price: formattedPrice }),
                })}
            </Typo>

            <ConnectingInfoCard
                className={classes.ConnectingInfoCard}
                text={t('search:connectingInfoDesc')}
            />

            <div className={classes.legs}>
                {legs.map((leg, i) => (
                    <React.Fragment key={i}>
                        {i > 0 ? (
                            <ConnectingDivider
                                className={classes.DesktopConnectingDivider}
                                leg={leg}
                            />
                        ) : null}

                        <ConnectingLegCard leg={leg} passengers={1} />
                    </React.Fragment>
                ))}
            </div>

            <ConnectingSeoBlock
                className={classes.ConnectingSeoBlock}
                seoDirection={seoDirection}
            />
        </div>
    );
};
