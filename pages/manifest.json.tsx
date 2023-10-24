import React from 'react';
import { NextPage } from 'next';
import i18next from 'i18n';

import { generateWebManifest } from 'utils/pwa/webmanifest';
import { isServer } from 'utils/platform';
import { getInitialLanguage } from 'utils/getInitialLanguage';

const ManifestJson: NextPage = () => {
    return null;
};

ManifestJson.getInitialProps = async context => {
    const { req, res, store } = context;

    if (req && res && isServer) {
        const { brand } = store.getState();
        const { partner } = brand;

        if (!partner) {
            res.statusCode = 404;
            res.end();
            return { namespacesRequired: [] };
        }

        /**
         * Вытащить перевод через `i18next.i18n.t('brand:brandName')` функции
         * по квантовым причинам не получается. Вытаскиваю тогда из бандла.
         */
        const language = getInitialLanguage(req) || 'ru';
        const brandBundle = await i18next.i18n.getResourceBundle(
            language,
            'brand'
        );
        const brandNameKey =
            partner.partner === 'atlas'
                ? 'brandName_nominative'
                : `brandName_nominative_${partner.partner}`;
        const brandNameTranslation = brandBundle[brandNameKey] || '';

        const manifestJSON = generateWebManifest(brand, brandNameTranslation);

        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify(manifestJSON));
        res.end();
    }

    return { namespacesRequired: [] };
};

export default ManifestJson;
