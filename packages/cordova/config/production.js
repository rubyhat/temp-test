const fs = require('fs');
const path = require('path');

const { version } = JSON.parse(fs.readFileSync(
    path.join('..', '..', 'package.json')
));

const config = {
    ...process.env,

    VERSION: version,

    APP_ENV: 'production',

    APP_CENTER_IOS: 'c849aa5d-4f00-4dc0-8aa4-831a29d6bfa4',
    APP_CENTER_ANDROID: '10df83f2-1ce1-4729-aa72-60f0b064a589',
    CODE_PUSH_IOS: '0jaS1yqCnoopHhf4uixFEWgrAD0R77IyUYNP6',
    CODE_PUSH_ANDROID: '51D4wEz4J-fg54AvqX26Rgo9cmRNR-r_C75vg',

    ANDROID_APP_ID: 'ru.atlasbus.app',
    IOS_APP_ID: 'atlas.bus.tickets',
}

module.exports = config;
