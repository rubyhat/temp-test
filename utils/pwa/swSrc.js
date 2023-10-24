import { skipWaiting, clientsClaim, setCacheNameDetails } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import {
    NetworkOnly,
    CacheFirst,
    StaleWhileRevalidate,
} from 'workbox-strategies';
import { registerRoute } from 'workbox-routing';
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

skipWaiting();
clientsClaim();

setCacheNameDetails({
    prefix: 'atlas',
    suffix: 'v1',
    precache: 'precache',
    runtime: 'runtime',
    googleAnalytics: 'google-analytics',
});

// eslint-disable-next-line
const WB_MANIFEST = self.__WB_MANIFEST;

precacheAndRoute(WB_MANIFEST);
cleanupOutdatedCaches();

// if you are customizing your runtime cache rules, please note that the
// first item in the runtime cache configuration array MUST be "start-url"
registerRoute(
    // MUST be the same as "start_url" in manifest.json
    '/',
    // use NetworkFirst or NetworkOnly if you redirect un-authenticated user to login page
    // use StaleWhileRevalidate if you want to prompt user to reload when new version available
    new NetworkOnly({
        // don't change cache name
        cacheName: 'start-url',
        plugins: [
            new ExpirationPlugin({
                maxEntries: 1,
                maxAgeSeconds: 24 * 60 * 60, // 24 hours
                purgeOnQuotaError: true,
            }),
        ],
    }),
    'GET'
);

registerRoute(
    /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
    new CacheFirst({
        cacheName: 'google-fonts',
        plugins: [
            new ExpirationPlugin({
                maxEntries: 4,
                maxAgeSeconds: 365 * 24 * 60 * 60, // 365 days
                purgeOnQuotaError: true,
            }),
        ],
    }),
    'GET'
);

registerRoute(
    /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
    new StaleWhileRevalidate({
        cacheName: 'static-font-assets',
        plugins: [
            new ExpirationPlugin({
                maxEntries: 4,
                maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
                purgeOnQuotaError: true,
            }),
        ],
    }),
    'GET'
);

registerRoute(
    /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
    new StaleWhileRevalidate({
        cacheName: 'static-image-assets',
        plugins: [
            new ExpirationPlugin({
                maxEntries: 64,
                maxAgeSeconds: 24 * 60 * 60, // 24 hours
                purgeOnQuotaError: true,
            }),
        ],
    }),
    'GET'
);

registerRoute(
    /\/api\/search\/suggest.*$/i,
    new CacheFirst({
        cacheName: 'api-suggest',
        plugins: [
            new ExpirationPlugin({
                maxEntries: 64,
                maxAgeSeconds: 60 * 60, // 1 hour
                purgeOnQuotaError: true,
            }),
            new CacheableResponsePlugin({
                statuses: [200],
                headers: {
                    'X-Is-Cacheable': 'true',
                },
            }),
        ],
    }),
    'GET'
);

registerRoute(
    /\/api\/seo.*$/i,
    new CacheFirst({
        cacheName: 'api-seo',
        plugins: [
            new ExpirationPlugin({
                maxEntries: 6,
                maxAgeSeconds: 60 * 60, // 1 hour
                purgeOnQuotaError: true,
            }),
        ],
    }),
    'GET'
);
