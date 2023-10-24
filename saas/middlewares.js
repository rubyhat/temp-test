const proxy = require('express-http-proxy');
var { URL } = require('url');

const { reloadSaaSConfig } = require('./runtime');
const { saasConfig } = require('./saasConfig');

/**
 * Загрузит SAAS конфиг, закеширует и сохранит в `req.saasConfig`.
 * @param req
 * @param res
 * @param next
 */
async function saasMiddleware(req, res, next) {
    if (!saasConfig.current.length) {
        console.log('[SAAS] Fetching SAAS config');
        try {
            await reloadSaaSConfig();
        } catch (err) {
            console.log('[SAAS] Error while fetchSAASConfig', err);
        }
    }

    req.saasConfig = saasConfig.current;

    const currentSaasConfig =
        saasConfig.current.find(
            config =>
                config.meta.domains &&
                config.meta.domains.includes(req.hostname)
        ) || saasConfig.current.find(config => config.partner === 'atlas');

    if (currentSaasConfig && currentSaasConfig.promo.length > 0) {
        const requestPath = decodeURIComponent(req.path).toLocaleLowerCase();
        for (let i = 0; i < currentSaasConfig.promo.length; i++) {
            const promo = currentSaasConfig.promo[i];
            if (
                requestPath.startsWith(
                    `/маршруты/${promo.fromName}/${promo.toName}`.toLocaleLowerCase()
                )
            ) {
                const promoUrl = new URL(promo.target);
                return proxy(promo.target, {
                    proxyReqPathResolver: () => promoUrl.pathname,
                })(req, res, next);
            }
        }
    }

    next();
}

module.exports = {
    saasMiddleware,
};
