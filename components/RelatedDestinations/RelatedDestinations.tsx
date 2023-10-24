import React, { FC } from 'react';
import { i18n } from 'i18n';
import Grid from '@material-ui/core/Grid';
import Link from 'next/link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { BrandState } from 'store/brand/types';
import { CountryState } from 'store/country/types';
import { RootState } from 'store';
import {
    Price,
    SeoDto,
    SeoDtoResponse,
    LocalizedName,
    CompleteCity,
} from 'swagger/client';
import { Typo } from 'components/Typo/Typo';
import { findMinPrice } from 'utils/findMinPrice';
import { formatPrice } from 'utils/price';
import {
    countryCurrency,
    CurrencySymbol,
    currencySymbol,
} from 'utils/currency';
import { useSeoPrefix } from 'hooks/useSeoPrefix';
import { useSAAS } from 'hooks/useSAAS';
import { AtlasTheme } from 'typings/atlas-theme';
import { checkIsInfoPortal } from 'utils/infoportal';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            backgroundColor: '#FFF',
            boxShadow: theme.atlas.shadows.bottom,
            borderRadius: theme.shape.borderRadius,
            padding: theme.spacing(2),
        },
        /* Pseudo-class applied to the root element. */
        accent: {
            backgroundColor: theme.atlas.palette.background.disabled,
        },
        /* Styles applied to `Grid` container component. */
        grid: {
            marginTop: theme.spacing(3),
        },
        /* Styles applied to destination block title `Typo` component. */
        title: {
            lineHeight: 1.5,
        },
        /* Styles applied to destination block description `Typo` component. */
        description: {
            lineHeight: 1.5,
            marginTop: theme.spacing(1),
        },
        /* Styles applied to the dotted line. */
        line: {
            height: 2,
            borderBottomWidth: 1,
            borderBottomStyle: 'dotted',
            borderBottomColor: theme.atlas.palette.text.disabled,
            flexGrow: 1,
            marginBottom: -7.5,
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
        },
        /* Styles applied to the destinations list. */
        list: {
            marginTop: theme.spacing(1),
        },
        /* Styles applied to the destination link. */
        link: {
            ...theme.atlas.typography.body1,
            color: theme.palette.primary.light,
            marginTop: 4,
            marginBottom: 4,
            textDecoration: 'none',

            '&:$hover': {
                textDecoration: 'underline',
            },
        },
        /* Styles applied to the destination price. */
        price: {},
    }),
    { name: 'RelatedDestinations' }
);

type Props = {
    className?: string;
    seo: SeoDtoResponse;
};

export const RelatedDestinations: FC<Props> = props => {
    const { className, seo } = props;
    const classes = useStyles();
    const router = useRouter();
    const { t } = useTranslation();
    const { country } = useSelector<RootState, CountryState>(
        rootState => rootState.country
    );
    const { brandName } = useSelector<RootState, BrandState>(
        rootState => rootState.brand
    );
    const { isMioTaxi } = useSAAS();

    const { seoPrefix } = useSeoPrefix();

    const meteorRideList = [
        {
            from: 'c498817',
            to: 'c510291',
        },
        {
            from: 'c510291',
            to: 'c498817',
        },
        {
            from: 'c498817',
            to: 'c540771',
        },
        {
            from: 'c540771',
            to: 'c498817',
        },
    ];
    let isMeteorRide = false;

    seo &&
        meteorRideList.forEach((listItem: any) => {
            if (
                seo.fromId &&
                seo.toId &&
                seo.fromId === listItem.from &&
                seo.toId === listItem.to
            ) {
                isMeteorRide = true;
            }
        });

    const defaultCurrency = countryCurrency[country];
    const { from, to, fromFeatured, toFeatured } = seo;
    const getLocalizedName = (obj: CompleteCity) => {
        return obj.localized_name[
            (obj.localized_name[i18n.language as keyof LocalizedName]
                ? i18n.language
                : 'en') as keyof LocalizedName
        ];
    };

    const minPrice = findMinPrice(seo.minPrices, defaultCurrency);
    const minPriceFormatted = minPrice
        ? t('fromPrice', {
              price: formatPrice(
                  minPrice.price,
                  currencySymbol[minPrice.currency as CurrencySymbol]
              ),
          })
        : '';

    const destinationBlockTitle = t(
        isMeteorRide
            ? `brand:seoDestinationBlockTitleMeteor${country}`
            : `brand:seoDestinationBlockTitle${country}`,
        {
            from: getLocalizedName(from),
            to: getLocalizedName(to),
            price: minPriceFormatted,
            context: brandName,
        }
    );

    const destinationBlockDescription = t(
        isMeteorRide
            ? `brand:seoDestinationBlockDescriptionMeteor${country}`
            : `brand:seoDestinationBlockDescription${country}`,
        {
            from: getLocalizedName(from),
            to: getLocalizedName(to),
            price: minPriceFormatted,
            context: brandName,
        }
    );

    const seoFromCity = t(
        isMeteorRide ? 'brand:seoFromCityMeteor' : 'brand:seoFromCity',
        {
            city: getLocalizedName(from),
            context: brandName,
        }
    );

    const seoToCity =
        t(isMeteorRide ? 'brand:seoToCityMeteor' : 'brand:seoToCity') +
        ` ${getLocalizedName(to)}`;

    const getDestinationTitle = (destination: SeoDto) => {
        return t('brand:seoDestinationTitle', {
            from:
                destination.from.localized_name[
                    (from.localized_name[i18n.language as keyof LocalizedName]
                        ? i18n.language
                        : 'en') as keyof LocalizedName
                ],
            to:
                destination.to.localized_name[
                    (to.localized_name[i18n.language as keyof LocalizedName]
                        ? i18n.language
                        : 'en') as keyof LocalizedName
                ],
            context: brandName,
        });
    };

    const getFormattedPrice = (minPrices: Price[]) => {
        const minPrice = findMinPrice(minPrices, defaultCurrency);

        return minPrice
            ? formatPrice(
                  minPrice.price,
                  currencySymbol[minPrice.currency as CurrencySymbol]
              )
            : '';
    };

    const linkProps = ({ from, to }: SeoDto) => {
        const isInfoPortal = checkIsInfoPortal(from, to);

        if (isInfoPortal) {
            return {
                href: {
                    pathname: '/search',
                    query: {
                        from: `c${from.id}`,
                        to: `c${to.id}`,
                        fromName: getLocalizedName(from),
                        toName: getLocalizedName(to),
                        seoPrefix,
                    },
                },
            };
        } else {
            return {
                href: {
                    pathname: '/search',
                    query: {
                        from: from.id,
                        to: to.id,
                        fromName: getLocalizedName(from),
                        toName: getLocalizedName(to),
                        seoPrefix,
                    },
                },
                as: {
                    pathname: `/${seoPrefix}/${getLocalizedName(
                        from
                    )}/${getLocalizedName(to)}/`,
                },
            };
        }
    };

    const renderList = (destinations: SeoDto[]) => {
        return (
            <List className={classes.list} disablePadding dense>
                {isMioTaxi && destinations[0] ? (
                    <ListItem disableGutters>
                        <Link {...linkProps(destinations[0])}>
                            <a className={classes.link}>
                                {getDestinationTitle(destinations[0])}
                            </a>
                        </Link>

                        <div className={classes.line} />

                        <span className={classes.price}>
                            {t('fromPrice', {
                                price: getFormattedPrice(
                                    destinations[0].minPrices
                                ),
                            })}
                        </span>
                    </ListItem>
                ) : (
                    destinations.map((destination, i) => (
                        <ListItem key={i} disableGutters>
                            <Link {...linkProps(destination)}>
                                <a className={classes.link}>
                                    {getDestinationTitle(destination)}
                                </a>
                            </Link>

                            <div className={classes.line} />

                            <span className={classes.price}>
                                {t('fromPrice', {
                                    price: getFormattedPrice(
                                        destination.minPrices
                                    ),
                                })}
                            </span>
                        </ListItem>
                    ))
                )}
            </List>
        );
    };

    return (
        <div
            className={clsx(className, classes.root, {
                [classes.accent]: true,
            })}
        >
            <Typo variant="subtitle" weight="bold" className={classes.title}>
                {destinationBlockTitle}
            </Typo>
            <Typo variant="body1" className={classes.description}>
                {!isMioTaxi && destinationBlockDescription}
            </Typo>

            <Grid container spacing={3} className={classes.grid}>
                {fromFeatured.length ? (
                    <Grid item xs={12} md={6}>
                        <Typo variant="body1" weight="bold">
                            {seoFromCity}
                        </Typo>

                        {renderList(fromFeatured)}
                    </Grid>
                ) : null}

                {toFeatured.length ? (
                    <Grid item xs={12} md={6}>
                        <Typo variant="body1" weight="bold">
                            {seoToCity}
                        </Typo>

                        {renderList(toFeatured)}
                    </Grid>
                ) : null}
            </Grid>
        </div>
    );
};
