const config = require('./production');

module.exports = {
    ...config,

    APP_ENV: 'testing',

    APP_CENTER_IOS: 'e76f2d0c-4feb-46eb-a022-1da07eb48f21',
    APP_CENTER_ANDROID: 'b06bbc5b-aac5-48d1-8937-1154fb295b27',
    CODE_PUSH_IOS: 'rXogJ46Opqx9ntFdqx1f6X58dNWxjW-8gpk-z',
    CODE_PUSH_ANDROID: 'b8ZUSPgSKG8uMcTMU7NFP3ybs3gcqq_K6MN56',

    ANDROID_APP_ID: 'ru.atlasbus.app.testing',
    IOS_APP_ID: 'atlas.bus.tickets.testing',
};
