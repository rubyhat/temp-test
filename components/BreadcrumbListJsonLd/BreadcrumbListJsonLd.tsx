import React, { FC } from 'react';
import Head from 'next/head';

type BreadcrumbListItem = {
    '@id': string;
    name: string;
};

type Props = {
    items: BreadcrumbListItem[];
};

export const BreadcrumbListJsonLd: FC<Props> = props => {
    const { items } = props;

    return (
        <Head>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'http://schema.org',
                        '@type': 'BreadcrumbList',
                        itemListElement: items.map((item, i) => ({
                            '@type': 'ListItem',
                            position: i + 1,
                            item,
                        })),
                    }),
                }}
            />
        </Head>
    );
};
