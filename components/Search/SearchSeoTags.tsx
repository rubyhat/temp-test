import React from 'react';
import { SeoDto } from 'swagger/client';
import Head from 'next/head';
import { useSeo } from 'hooks/useSeo';
import { SearchFormState } from 'store/search-form/types';
import { useTranslation } from 'react-i18next';
import { CountryCode } from 'utils/country';
import { useSAAS } from 'hooks/useSAAS';

export type SearchSeoTagsProps = {
    direction?: SeoDto | null;
    hostname: string;
    searchFormState: SearchFormState;
    country: CountryCode;
};

const SearchSeoTags: React.FC<SearchSeoTagsProps> = ({
    hostname,
    direction,
    searchFormState,
    country,
}) => {
    const {
        docTitle,
        docDescription,
        canonicalUrl,
        minPrice,
        maxPrice,
        currency,
    } = useSeo(hostname, searchFormState, direction);
    const { t } = useTranslation();
    const { partnerName, meta, isAtlas } = useSAAS();
    const ogImage = isAtlas
        ? `https://${hostname}/static/img/OG_${country}.jpg`
        : meta.ogImageURL;

    return (
        <Head>
            <title key="title">{docTitle}</title>

            <meta itemProp="name" content={docTitle} />
            <meta itemProp="description" content={docDescription} />
            <meta name="description" content={docDescription} />

            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:type" content="website" />
            <meta property="og:title" content={docTitle} />
            {ogImage ? <meta property="og:image" content={ogImage} /> : null}
            <meta property="og:description" content={docDescription} />

            <link rel="canonical" href={canonicalUrl} />

            {direction && (
                <>
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify({
                                '@context': 'http://schema.org',
                                '@type': 'BusTrip',
                                url: canonicalUrl,
                                departureBusStop: {
                                    type: 'BusStop',
                                    name: direction.from.name,
                                },
                                arrivalBusStop: {
                                    type: 'BusStop',
                                    name: direction.to.name,
                                },
                                offers: {
                                    '@type': 'AggregateOffer',
                                    lowPrice: minPrice,
                                    highPrice: maxPrice,
                                    priceCurrency: currency,
                                    offerCount: direction.rideCount,
                                },
                            }),
                        }}
                    />
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify({
                                '@context': 'http://schema.org',
                                '@type': 'Product',
                                name: `Купить билеты на автобус ${direction.from.name} - ${direction.to.name}`,
                                brand: t('brand:brandName', {
                                    context: partnerName,
                                }),
                                description: docDescription,
                                offers: {
                                    '@type': 'AggregateOffer',
                                    lowPrice: minPrice,
                                    highPrice: maxPrice,
                                    priceCurrency: currency,
                                    offerCount: direction.rideCount,
                                },
                            }),
                        }}
                    />
                </>
            )}
        </Head>
    );
};

export default SearchSeoTags;
