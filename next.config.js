require('dotenv').config();
const withImages = require('next-images');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});
const { compose } = require('redux');
const withPWA = require('next-pwa');

const {
    withResolve,
    withCircularDepsCheck,
    withSourceMaps,
} = require('./build-utils/next-config');
const { seoPrefixesRegex } = require('./utils/seoPrefixes');
const swConfig = require('./utils/pwa/swConfig');

const securityHeaders = [
    {
        key: 'X-DNS-Prefetch-Control',
        value: 'on',
    },
    {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
    },
    {
        key: 'X-XSS-Protection',
        value: '1; mode=block',
    },
    {
        key: 'X-Frame-Options',
        value: 'SAMEORIGIN',
    },
    {
        key: 'Permissions-Policy',
        value:
            'camera=(), microphone=(), geolocation=(self), browsing-topics=()',
    },
    {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
    },
];

module.exports = compose(
    withResolve,
    withCircularDepsCheck,
    withBundleAnalyzer,
    withImages,
    withSourceMaps,
    withPWA
)({
    poweredByHeader: false,
    async headers() {
        return [
            {
                source: '/',
                headers: securityHeaders,
            },
            {
                source: '/:path*',
                headers: securityHeaders,
            },
            {
                source: '/_next/static',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public',
                    },
                ],
            },
        ];
    },
    // withResolve
    resolveDirs: [__dirname],
    trailingSlash: process.env.CORDOVA === 'true',
    env: {
        MAPBOX_TOKEN: process.env.MAPBOX_TOKEN,
        MAPBOX_STYLE: process.env.MAPBOX_STYLE,
        YANDEX_MAPS_API_KEY: process.env.YANDEX_MAPS_API_KEY,
        BACKEND_BASE_PATH: process.env.BACKEND_BASE_PATH,
        RECAPTCHA_V2_TOKEN: process.env.RECAPTCHA_V2_TOKEN,
        RECAPTCHA_V2_FIREBASE_TOKEN: process.env.RECAPTCHA_V2_FIREBASE_TOKEN,
        RECAPTCHA_V3_TOKEN: process.env.RECAPTCHA_V3_TOKEN,
        SIGN_SEND_CODE_SECRET: process.env.SIGN_SEND_CODE_SECRET,
        CORDOVA: process.env.CORDOVA,
        CORDOVA_PARTNER_ID: process.env.CORDOVA_PARTNER_ID,
        PROXY: process.env.PROXY,
        SENTRY_DSN: process.env.SENTRY_DSN,
        APP_STAGE: process.env.APP_STAGE,
        APP_METRICA_KEY: process.env.APP_METRICA_KEY,
        GTM_AUTH: process.env.GTM_AUTH,
        GTM_PREVIEW: process.env.GTM_PREVIEW,
        GTM_AUTH_COMPASS: process.env.GTM_AUTH_COMPASS,
        GTM_PREVIEW_COMPASS: process.env.GTM_PREVIEW_COMPASS,
        STORAGE_BUCKET_NAME: process.env.STORAGE_BUCKET_NAME,
        BUILD_VERSION: process.env.BUILD_VERSION,
        ONE_SIGNAL_APP_ID: process.env.ONE_SIGNAL_APP_ID,
        PORT: process.env.PORT,
        STATIC_BASE_URL: process.env.STATIC_BASE_URL,
        ENABLE_CDN: process.env.ENABLE_CDN, // доставлять ли статику из Google Storage
        SW: process.env.SW,
        INTERNAL_IP: process.env.INTERNAL_IP, // Внутренний IP. Для тестинга на моб. устройстве в той же сети.
    },
    async rewrites() {
        return [
            // С датой
            {
                source: `/:seoPrefix(${seoPrefixesRegex})/:fromName/:toName/:date([^?]*)`,
                destination: '/seo',
            },
            // Без даты (порядок важен)
            {
                source: `/:seoPrefix(${seoPrefixesRegex})/:fromName/:toName([^?]*)`,
                destination: '/seo',
            },
            // Расписание
            {
                source: `/:seoPrefix(${seoPrefixesRegex})/:city([^?]*)`,
                destination: '/city',
            },
        ];
    },
    async redirects() {
        return [
            {
                source: `/:seoPrefix(${seoPrefixesRegex})`,
                destination: '/',
                permanent: false,
            },
        ];
    },
    pwa: {
        disable: !process.env.SW, // disable pwa feature as a whole in dev mode
        register: false, // whether to let this plugin register service worker for you
        sw: swConfig.scriptFilename,
        swSrc: 'utils/pwa/swSrc.js',
        // Убираем из workbox-precaching штуки связанные с SaaS
        publicExcludes: [
            '!favicon.ico',
            '!favicon_*.ico', // фавиконки партнеров
            '!static/img/favicon.ico',
            '!static/img/favicon-*.png',
            '!static/locales/*/brand.json', // локализация из SaaS конфига
            // Убираю пока все локали из precache.
            // В сумме 24 JSON файла (на трех языках).
            // С учетом того что помимо этого есть еще 30 JS чанков
            // которые Next.js загружает через <link preload />
            // получается многовато для инициализации SW.
            '!static/locales/*/*.json',
        ],
        buildExcludes: [/.*\.js\.map$/, /.*\.css\.map$/], // не кешировать SourceMaps
    },
});
