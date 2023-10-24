const axios = require('axios');
const download = require('image-downloader');
const fs = require('fs');
const path = require('path');

const { saasConfig } = require('./saasConfig');
const nextI18next = require('../i18n');

const locales = ['en', 'ru', 'pl'];

/**
 * Подменит статический `/public/static/locales/:lng/brand.json` на
 * значение из памяти ноды.
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function getResourceBundleHandler(req, res) {
    try {
        const { language } = req.params;
        const resource = await nextI18next.i18n.getResourceBundle(
            language,
            'brand'
        );

        res.send(resource);
    } catch (err) {
        console.log(err);
        res.status('500').send({ message: 'Something broke!' });
    }
}

/**
 * Обновит `brand.json` в памяти ноды.
 *
 * @returns {Promise<void>}
 */
async function addResourceBundle() {
    const partners = saasConfig.current;

    const promises = [];
    locales.forEach(locale => {
        let resources = {};

        partners.forEach(partner => {
            console.log(
                `[SaaS] Add resource brand.json: ${partner.partner}:${locale}`
            );
            resources = {
                ...resources,
                ...partner.i18n[locale],
            };
        });

        promises.push(
            nextI18next.i18n.addResourceBundle(
                locale,
                'brand',
                resources,
                false,
                true
            )
        );
    });

    return Promise.all(promises);
}

/**
 * Вернет соответствующий favicon.ico по домену. Middleware для express.
 *
 * @param req
 * @param res
 */
function faviconHandler(req, res) {
    const partners = req.saasConfig;
    const hostname = req.headers['x-real-host'] || req.headers.host;
    const partner = partners.find(p =>
        (p.meta.domains || []).includes(hostname)
    );

    let favicon = '';
    if (partner && partner.meta.faviconURL) {
        try {
            favicon = fs.readFileSync(
                `/tmp/favicon_${partner.meta.partnerID}.ico`
            );
        } catch (err) {
            console.log(
                `[Favicon handler] /tmp/favicon_${partner.meta.partnerID}.ico does not exists.` +
                    'Fallback to public/favicon.ico'
            );
            favicon = fs.readFileSync(
                path.join(__dirname, '../public/favicon.ico')
            );
        }
    } else {
        favicon = fs.readFileSync(
            path.join(__dirname, '../public/favicon.ico')
        );
    }

    res.statusCode = 200;
    res.setHeader('Content-Length', favicon.length);
    res.setHeader('Content-Type', 'image/x-icon');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.end(favicon);
}

/**
 * Обновит кешированную версию SAAS конфига.
 */
async function reloadSaaSConfig() {
    console.log('[SAAS] Reloading SAAS config');
    try {
        const { data } = await axios.get(
            `${process.env.BACKEND_BASE_PATH}/api/saas`
        );
        saasConfig.current = data;
    } catch (err) {
        console.log('[SaaS] Error while reloadSaaSConfig', err);
    }
}

/**
 * Скачает favicon'ки партнеров в `/tmp/favicon_{partnerID}.ico` в рантайме,
 * при запуске инстанса или обновлении SaaS конфига.
 *
 * Файловая система GAE является read-only. Поэтому записываем в `/tmp`
 * вместо `/public`.
 *
 * @returns {Promise<void>}
 */
async function copyFaviconsRuntime() {
    const partners = saasConfig.current;

    const promises = [];
    partners.forEach(partner => {
        if (!partner.meta.faviconURL) return;

        const faviconName = `favicon_${partner.meta.partnerID}.ico`;
        const destination = `/tmp/${faviconName}`;
        console.log(`[SaaS] Copy favicon to ${destination}`);
        promises.push(
            download.image({
                url: partner.meta.faviconURL,
                dest: destination,
            })
        );
    });

    return Promise.all(promises);
}

module.exports = {
    getResourceBundleHandler,
    addResourceBundle,
    faviconHandler,
    reloadSaaSConfig,
    copyFaviconsRuntime,
};
