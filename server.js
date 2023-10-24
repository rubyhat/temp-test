const { parse } = require('url');
const next = require('next');
const express = require('express');
const cookieParser = require('cookie-parser');
const proxy = require('http-proxy-middleware');
const nextI18NextMiddleware = require('./i18n/middleware').default;
const { UAParser } = require('ua-parser-js');
const redis = require('redis');
const path = require('path');

const { atlasRedirect } = require('./atlas-redirect');
const nextI18next = require('./i18n');
const cdn = require('./cdn.json');
const {
    getResourceBundleHandler,
    addResourceBundle,
    reloadSaaSConfig,
    faviconHandler,
    copyFaviconsRuntime,
} = require('./saas/runtime');
const { saasMiddleware } = require('./saas/middlewares');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const PORT = process.env.PORT || 3000;

function matchDeviceMiddleware(req, res, next) {
    const userAgent = (req && req.headers && req.headers['user-agent']) || null;
    const deviceType = new UAParser(userAgent).getDevice().type;

    req.deviceType = deviceType || null;

    next();
}

// Dynamic assetPrefix
function setAssetPrefix() {
    if (
        cdn.STORAGE_BUCKET_NAME &&
        cdn.BUILD_VERSION &&
        process.env.ENABLE_CDN === 'true'
    ) {
        let prefix = `https://storage.googleapis.com/${cdn.STORAGE_BUCKET_NAME}/${cdn.BUILD_VERSION}`;
        if (process.env.STATIC_BASE_URL) {
            prefix = `${process.env.STATIC_BASE_URL}/${cdn.BUILD_VERSION}`;
        }
        app.setAssetPrefix(prefix);
        console.log(`[CDN] Prefix was set: ${prefix}`);
    }
}

// Redis
const subscriber = redis.createClient(process.env.REDIS_URI);
subscriber.on('message', (channel, message) => {
    console.log('[SAAS]: Received message from "saas" channel');

    async function reloadSaaS() {
        try {
            await reloadSaaSConfig();
            await addResourceBundle();
            await copyFaviconsRuntime();
        } catch (err) {
            console.log('[SaaS] Error while reloading config', err);
        }
    }
    reloadSaaS();
});
subscriber.subscribe('saas');

(async () => {
    try {
        await reloadSaaSConfig();
        await addResourceBundle();
        await copyFaviconsRuntime();

        await app.prepare();
        const server = express();

        server.disable('x-powered-by');

        server.use(atlasRedirect);
        server.use(matchDeviceMiddleware);
        server.use(nextI18NextMiddleware(nextI18next));
        server.use(cookieParser());
        server.use(saasMiddleware);

        server.get(
            '/static/locales/:language/brand.json',
            getResourceBundleHandler
        );
        server.get('/favicon.ico', faviconHandler);

        // Service Worker
        if (process.env.SW) {
            server.get(
                ['/sw.js', '/workbox-*.js', '/worker-*.js'],
                (req, res, next) => {
                    const parsedUrl = parse(req.url, true);
                    const { pathname } = parsedUrl;

                    res.setHeader(
                        'Cache-Control',
                        'max-age=0, no-cache, no-store, must-revalidate'
                    );
                    res.sendFile(
                        path.join(__dirname, '.next', pathname),
                        {},
                        err => {
                            if (err) next();
                        }
                    );
                }
            );
        }

        // Проксирование запросов к бекенду,
        // чтобы заголовки Cookie и Set-Cookie
        // работали в режиме development.
        if (process.env.PROXY) {
            server.use(
                '/api',
                proxy({
                    target: process.env.BACKEND_BASE_PATH,
                    changeOrigin: true,
                })
            );
        }

        setAssetPrefix();

        // Old Morda redirects
        server.get('/personal/miles', (req, res) => {
            res.redirect(301, '/profile/miles');
        });
        server.get('/about/read_terms', (req, res) => {
            res.redirect(301, '/terms');
        });

        // Обновит SaaS конфиг.
        // @todo удалить когда Redis сможет отправлять события
        if (dev) {
            server.post('/reloadSaasConfig', async (req, res) => {
                console.log('[SAAS]: /reloadSaasConfig');
                try {
                    await reloadSaaSConfig();
                    await addResourceBundle();
                    await copyFaviconsRuntime();
                } catch (err) {
                    console.log(err);
                }

                res.send({
                    message: 'ok',
                });
            });
        }

        server.get('*', (req, res) => {
            const parsedUrl = parse(req.url, true);

            handle(req, res, parsedUrl);
        });

        await server.listen(PORT);

        if (process.env.INTERNAL_IP) {
            console.log(`> Ready on http://${process.env.INTERNAL_IP}:${PORT}`);
        } else {
            console.log(`> Ready on http://localhost:${PORT}`);
        }
    } catch (err) {
        console.error(err);
    }
})();
