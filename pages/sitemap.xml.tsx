import React from 'react';
import xml from 'xml';
import { i18n } from 'i18n';
import { Locale } from 'i18n/utils';
import { NextPage, NextPageContext } from 'next';
import uniqBy from 'lodash/uniqBy';

import apiClient from 'lib/apiClient';
import { getInitialLanguage } from 'utils/getInitialLanguage';
import { SeoDto } from 'swagger/client';
import { detectCountry } from 'utils/country';

const Sitemap: NextPage = () => {
    return <div>sitemap</div>;
};

const buildUrl = (
    hostname: string,
    directionPath: string,
    direction: SeoDto
): string => {
    const baseUrl = `https://${hostname}`;
    const fromName = direction.from.name.replace(/\s/g, '+');
    const toName = direction.to.name.replace(/\s/g, '+');
    return `${baseUrl}/${directionPath}/${fromName}/${toName}`;
};

const buildCityUrl = (
    hostname: string,
    directionPath: string,
    direction: SeoDto
): string => {
    const baseUrl = `https://${hostname}`;
    const fromName = direction.from.name.replace(/\s/g, '+');
    return `${baseUrl}/${directionPath}/${fromName}`;
};

Sitemap.getInitialProps = async (context: NextPageContext) => {
    const { req, res, store } = context;
    const { brand } = store.getState();

    if (req && res && !process.env.CORDOVA && !process.browser) {
        const initialLanguage: Locale | null = getInitialLanguage(req);
        const country = detectCountry(req);

        // i18n.t(`seoDirectionsPath${country}`, {
        //     lng: initialLanguage,
        // });
        const directionPath = i18n.t(`seoDirectionsPath${country}`, {
            lng: initialLanguage || 'ru',
        });
        const hostname =
            (req.headers['x-real-host'] as any) ||
            req.headers.host ||
            'atlasbus.ru';

        const seoList = (await apiClient.getSeoList(
            initialLanguage || 'ru',
            brand.brandName
        )).data;
        const seoCitiesList = uniqBy(
            seoList,
            destination => destination.from.name
        );
        res.setHeader('Content-Type', 'application/xml');
        res.write('<?xml version="1.0" encoding="UTF-8"?>');
        res.write(
            xml({
                urlset: [
                    {
                        _attr: {
                            xmlns:
                                'http://www.sitemaps.org/schemas/sitemap/0.9',
                        },
                    },
                    {
                        url: [
                            {
                                loc: `https://${hostname}`,
                            },
                        ],
                    },
                    ...seoList.map(site => ({
                        url: [
                            {
                                loc: buildUrl(hostname, directionPath, site),
                            },
                            {
                                changefreq: 'hourly',
                            },
                        ],
                    })),
                    ...seoCitiesList.map(direction => ({
                        url: [
                            {
                                loc: buildCityUrl(
                                    hostname,
                                    directionPath,
                                    direction
                                ),
                            },
                            {
                                changefreq: 'daily',
                            },
                        ],
                    })),
                ],
            })
        );
        res.end();
    }
    return { namespacesRequired: [] };
};

export default Sitemap;
