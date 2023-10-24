import React, { FC } from 'react';
import Link from 'next/link';
import { UrlObject } from 'url';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import { SvgIconComponent } from '@material-ui/icons';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import clsx from 'clsx';

import { CountryState } from 'store/country/types';
import { RootState } from 'store';
import { LocalizedName, SeoDto } from 'swagger/client';
import { Typo } from 'components/Typo/Typo';
import { findMinPrice } from 'utils/findMinPrice';
import { formatPrice } from 'utils/price';
import { i18n, useTranslation } from 'i18n';
import {
    countryCurrency,
    CurrencySymbol,
    currencySymbol,
} from 'utils/currency';
import { useSeoPrefix } from 'hooks/useSeoPrefix';
import { AtlasTheme } from 'typings/atlas-theme';
import { checkIsInfoPortal } from 'utils/infoportal';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            borderRadius: theme.shape.borderRadius,
            boxShadow: theme.atlas.shadows.bottom,
            padding: theme.spacing(1.5, 2),
            backgroundColor: '#FFF',
            color: 'unset',
            textDecoration: 'none',

            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        /* Pseudo-class applied to the root component if `disablePrice={true}` */
        disabledPrice: {
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(2),
        },
        left: {},
        destination: {},
        price: {},
    }),
    { name: 'FeaturedDestinationCard' }
);

export type FeaturedDestinationProps = {
    destination: SeoDto;
    IconComponent?: SvgIconComponent;
    disablePrice?: boolean;
};

export const FeaturedDestinationCard: FC<FeaturedDestinationProps> = props => {
    const {
        destination,
        disablePrice,
        IconComponent = KeyboardArrowRightIcon,
    } = props;
    const { from, to, minPrices } = destination;
    const classes = useStyles();
    const { t } = useTranslation();

    const { country } = useSelector<RootState, CountryState>(
        rootState => rootState.country
    );
    const defaultCurrency = countryCurrency[country];

    const minPrice = findMinPrice(minPrices, defaultCurrency);
    const minPriceFormatted = minPrice
        ? formatPrice(
              minPrice.price,
              currencySymbol[minPrice.currency as CurrencySymbol]
          )
        : '';

    const { seoPrefix } = useSeoPrefix();
    const localizedFrom =
        from.localized_name[
            (from.localized_name[i18n.language as keyof LocalizedName]
                ? i18n.language
                : 'en') as keyof LocalizedName
        ];
    const localizedTo =
        to.localized_name[
            (to.localized_name[i18n.language as keyof LocalizedName]
                ? i18n.language
                : 'en') as keyof LocalizedName
        ];

    const isInfoPortal = checkIsInfoPortal(from, to);

    const href: UrlObject = {
        pathname: '/search',
        query: {
            from: `c${from.id}`,
            fromName: localizedFrom,
            to: `c${to.id}`,
            toName: to.name,
        },
    };
    const asHref: UrlObject | string = isInfoPortal
        ? ''
        : {
              pathname: `/${seoPrefix}/${localizedFrom}/${localizedTo}`,
          };

    return (
        <Link href={href} as={asHref}>
            <a
                className={clsx(classes.root, {
                    [classes.disabledPrice]: disablePrice,
                })}
            >
                <div className={classes.left}>
                    <Typo className={classes.destination} variant="body1">
                        {localizedFrom} – {localizedTo}
                    </Typo>

                    {disablePrice ? null : minPriceFormatted ? (
                        <Typo className={classes.price} weight="bold">
                            {t('fromPrice', {
                                price: minPriceFormatted,
                            })}
                        </Typo>
                    ) : (
                        <Typo weight="bold" color="textSecondary">
                            {t('search:checkPrice')}
                        </Typo>
                    )}
                </div>

                <IconComponent color="disabled" />
            </a>
        </Link>
    );
};
