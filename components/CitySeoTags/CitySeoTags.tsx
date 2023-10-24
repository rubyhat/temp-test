import React, { FC } from 'react';
import Head from 'next/head';
import { useSelector } from 'react-redux';

import { CountryState } from 'store/country/types';
import { RootState } from 'store';
import { useSAAS } from 'hooks/useSAAS';
import { useSeoPrefix } from 'hooks/useSeoPrefix';

type Props = {
    cityName: string;
    docDescription: string;
    docTitle: string;
    hostname: string;
};

export const CitySeoTags: FC<Props> = props => {
    const { cityName, docTitle, docDescription, hostname } = props;
    const { meta, isAtlas } = useSAAS();
    const { country } = useSelector<RootState, CountryState>(
        rootState => rootState.country
    );
    const { seoPrefix } = useSeoPrefix();

    const canonicalUrl = `https://${hostname}/${seoPrefix}/${cityName}`;
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
        </Head>
    );
};
