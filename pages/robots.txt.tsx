import React from 'react';
import { NextPage, NextPageContext } from 'next';

const RobotsTxt: NextPage = () => <></>;

const WHITELIST = [
    'atlasbus.ru',
    'atlasbus.by',
    'atlasbus.com.ua',
    'atlasbus.pl',
];

RobotsTxt.getInitialProps = async (context: NextPageContext) => {
    const { req, res, store } = context;

    const { brand } = store.getState();
    const { partner } = brand;
    const partnerDomains = (partner && partner.meta.domains) || [];

    if (req && res && !process.env.CORDOVA && !process.browser) {
        let hostname =
            (req.headers['x-real-host'] as string) || req.headers.host || '';
        res.write(`User-agent: *\n\n`);

        if (WHITELIST.includes(hostname) || partnerDomains.includes(hostname)) {
            res.write('Allow: /\n');
        } else {
            //     res.write('Disallow: /\n');
            res.write('Allow: /\n');
            hostname = 'atlasbus.by';
        }
        res.write('Disallow: /orders\n');
        res.write('Disallow: /profile\n');
        res.write('Disallow: /static/img/*banner*\n\n');
        res.write(`Sitemap: https://${hostname}/sitemap.xml\n`);
        res.end();
    }
    return { namespacesRequired: [] };
};

export default RobotsTxt;
