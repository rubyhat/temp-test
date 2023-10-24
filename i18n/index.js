const NextI18Next = require('next-i18next').default;

const NextI18NextInstance = new NextI18Next({
    defaultLanguage: 'ru',
    otherLanguages: ['ru', 'en', 'pl', 'be', 'lt', 'lv', 'de'],
    load: 'languageOnly',
    detection: {
        caches: ['cookie'],
        order: ['cookie', 'header', 'navigator'],
        cookieMinutes: 60 * 24 * 365,
    },
    ignoreRoutes: ['/_next/', '/static/', '/public/'],
});

NextI18NextInstance.i18n.languages = ['en', 'ru', 'pl', 'be', 'lt', 'lv', 'de'];

module.exports = NextI18NextInstance;
