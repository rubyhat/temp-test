import { NextPageContext } from 'next';

export const getCurrentPageUrl = ({ req }: NextPageContext) => {
    if (!process.browser) {
        if (req && req.url) {
            const hostname =
                req.headers['x-real-host'] || req.headers.host || 'atlasbus.ru';
            return new URL(`https://${hostname}${req.url}`);
        }
        return new URL(`https://atlasbus.ru/`);
    }
    return new URL(window.location.href);
};
