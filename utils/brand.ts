import { IncomingMessage } from 'http';

import { isCordova } from './platform';
import { SaaSConfigDto } from 'swagger/client';

/**
 * Получит идентификатор партнера по домену.
 * @param req
 * @param partners
 */
export function parseBrand(
    req: IncomingMessage | null = null,
    partners: SaaSConfigDto[]
) {
    const hostname = req
        ? (req.headers['x-real-host'] as string) || (req.headers.host as string)
        : null;

    if (hostname) {
        const partner = partners.find(p =>
            (p.meta.domains || []).includes(String(hostname))
        );

        return partner ? partner.meta.partnerID : 'atlas';
    }

    return 'atlas';
}

/**
 * Вернет текущий идентификатор партнера.
 */
export function getBrandID() {
    const defaultBrand = 'atlas';

    if (isCordova) {
        return process.env.BRAND_NAME || defaultBrand;
    }

    if (process.browser) {
        if (window.__NEXT_REDUX_STORE__) {
            return window.__NEXT_REDUX_STORE__.getState().brand.brandName;
        }
    }

    return defaultBrand;
}

export function detectWebView(
    req: IncomingMessage | null = null,
    partners: SaaSConfigDto[]
): boolean {
    const hostname = req
        ? (req.headers['x-real-host'] as string) || (req.headers.host as string)
        : null;

    if (req && hostname) {
        const isWebView = partners.some(partner => {
            if (partner.cordova && partner.cordova.hostname) {
                return partner.cordova.hostname === String(hostname);
            }

            return false;
        });

        return isWebView;
    }

    return false;
}
