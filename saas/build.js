const axios = require('axios');
const download = require('image-downloader');
const path = require('path');

/**
 * Скачает favicon'ки партнеров в `public/favicon_{partnerID}.ico` при сборке.
 *
 * Примечание: Не используется. Вместо этого иконки будут загружены в рантайме.
 * См.: `saas/runtime.js` метод `copyFaviconsRuntime`
 *
 * @returns {Promise<void>}
 */
async function copyFavicons() {
    let { data: partners } = await axios.get(
        process.env.BACKEND_BASE_PATH + '/api/saas'
    );

    const promises = [];
    partners.forEach(partner => {
        if (!partner.meta.faviconURL) return;

        const faviconName = `favicon_${partner.meta.partnerID}.ico`;
        console.log(`[SaaS] Copy ${faviconName}`);
        promises.push(
            download.image({
                url: partner.meta.faviconURL,
                dest: path.join(__dirname, `../public/${faviconName}`),
            })
        );
    });

    return Promise.all(promises);
}

async function prepareSaaS() {
    await copyFavicons();
}

module.exports = {
    prepareSaaS,
};
