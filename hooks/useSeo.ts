import { LocalizedName, SeoDto } from 'swagger/client';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { CountryState } from 'store/country/types';
import {
    countryCurrency,
    currencySymbol,
    CurrencySymbol,
} from 'utils/currency';
import { formatPrice } from 'utils/price';
import { SearchFormState } from 'store/search-form/types';
import { BrandState } from 'store/brand/types';
import { i18n } from 'i18n';

export type SeoDetailsType = {
    docTitle: string;
    docDescription: string;
    headerTitle: string;
    headerSubTitle: string;
    canonicalUrl: string;
    minPrice?: number;
    maxPrice?: number;
    currency?: CurrencySymbol;
};

const trimText = (s: string): string => {
    return s
        .replace(/\s{2,}/g, ' ')
        .replace(/\s\./g, '.')
        .trim();
};

export function useSeo(
    hostname: string,
    searchForm: SearchFormState,
    direction?: SeoDto | null,
    date?: string
): SeoDetailsType {
    const { t } = useTranslation();
    const { country } = useSelector<RootState, CountryState>(
        rootState => rootState.country
    );
    const { brandName } = useSelector<RootState, BrandState>(
        rootState => rootState.brand
    );
    const MIOTAXI = 'miotaxi';
    const COMPASBUS = 'combasbus';

    const defaultCurrency = countryCurrency[country];
    const seoDirectionsPath = t(`seoDirectionsPath${country}`);

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

    searchForm &&
        meteorRideList.forEach((listItem: any) => {
            if (
                searchForm.fromValue &&
                searchForm.toValue &&
                searchForm.fromValue.id === listItem.from &&
                searchForm.toValue.id === listItem.to
            ) {
                isMeteorRide = true;
            }
        });

    if (direction) {
        const { from, to, minPrices } = direction;
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
        const canonicalUrl = `https://${hostname}/${seoDirectionsPath}/${from.name}/${to.name}`;
        const minPrice =
            minPrices.filter(mp => mp.currency === defaultCurrency)[0] ||
            minPrices[0];
        const formattedPrice = minPrice
            ? t('fromPrice', {
                  price: formatPrice(
                      minPrice.price,
                      currencySymbol[minPrice.currency as CurrencySymbol]
                  ),
              })
            : '';
        const docTitle = t(
            brandName === MIOTAXI
                ? `brand:seoDirectionTitleTaxi${country}`
                : brandName === COMPASBUS
                ? `brand:seoDirectionTitleCompas`
                : isMeteorRide
                ? `brand:seoDirectionTitleMeteor${country}`
                : `brand:seoDirectionTitle${country}`,
            {
                from: localizedFrom,
                to: localizedTo,
                price: formattedPrice,
                context: brandName,
            }
        );
        const docDescription = t(
            brandName === MIOTAXI
                ? `brand:seoDirectionDescriptionTaxi${country}`
                : brandName === COMPASBUS
                ? `brand:seoDirectionDescriptionCompas`
                : isMeteorRide
                ? `brand:seoDirectionDescriptionMeteor${country}`
                : `brand:seoDirectionDescription${country}`,
            {
                from: localizedFrom,
                to: localizedTo,
                price: formattedPrice,
                context: brandName,
            }
        );
        return {
            docTitle: trimText(docTitle),
            docDescription: trimText(docDescription),
            headerTitle: trimText(
                t(
                    `brand:${
                        isMeteorRide
                            ? 'seoDirectionPageTitleMeteor'
                            : 'seoDirectionPageTitle'
                    }${country}`,
                    {
                        from: localizedFrom,
                        to: localizedTo,
                        price: formattedPrice,
                        date: date,
                        context: brandName,
                    }
                )
            ),
            headerSubTitle: trimText(
                t(
                    `brand:${
                        isMeteorRide
                            ? 'seoDirectionPageSubTitleMeteor'
                            : 'seoDirectionPageSubTitle'
                    }${country}`,
                    {
                        price: formattedPrice,
                        context: brandName,
                    }
                )
            ),
            canonicalUrl,
            minPrice: minPrice ? minPrice.price : undefined,
            maxPrice: minPrice ? minPrice.maxPrice : undefined,
            currency: minPrice
                ? (minPrice.currency as CurrencySymbol)
                : undefined,
        };
    }
    const canonicalUrl =
        searchForm.fromInputValue && searchForm.toInputValue
            ? `https://${hostname}/${seoDirectionsPath}/${searchForm.fromInputValue}/${searchForm.toInputValue}`
            : `https://${hostname}/`;
    return {
        docTitle: t(
            brandName === MIOTAXI
                ? `brand:documentTitleTaxi${country}`
                : brandName === COMPASBUS
                ? `brand:documentTitleCompas`
                : `brand:documentTitle${country}`,
            { context: brandName }
        ),
        docDescription: t(
            brandName === MIOTAXI
                ? `brand:documentDescriptionTaxi${country}`
                : brandName === COMPASBUS
                ? `brand:documentDescriptionCompas`
                : `brand:documentDescription${country}`,
            {
                context: brandName,
            }
        ),
        headerTitle: t(`brand:headerTitle${country}`, { context: brandName }),
        headerSubTitle: t(`brand:headerSubtitle${country}`, {
            context: brandName,
        }),
        canonicalUrl,
    };
}
