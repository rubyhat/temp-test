const path = require('path');
const fs = require('fs');
const axios = require('axios');
const download = require('image-downloader');
const dotenv = require('dotenv');

dotenv.config();

// Throw error if UnhandledPromiseRejectionWarning
process.on('unhandledRejection', err => {
    console.error(err); // or err.stack and err.message or whatever you want
    process.exit(1);
});

async function run() {
    if (!process.env.PARTNER_ID) {
        throw new Error(
            '[SaaS Capacitor]: PARTNER_ID env is not defined. Try: `PARTNER_ID=your_partner_id npm run saas:config:copy`'
        );
    }

    const saasConfigURL = `${process.env.SAAS_BASE_PATH}/api/saas/${process.env.PARTNER_ID}`;
    console.log(
        `[SaaS Capacitor] Fetching ${process.env.PARTNER_ID} SaaS config: ${saasConfigURL}`
    );
    const { data: saasConfig } = await axios.get(saasConfigURL);

    const hasCordovaConfig =
        saasConfig.cordova &&
        saasConfig.cordova.appName &&
        saasConfig.cordova.appDescription &&
        saasConfig.cordova.icon &&
        saasConfig.cordova.splashscreen &&
        saasConfig.cordova.androidAppId &&
        saasConfig.cordova.iosAppId &&
        saasConfig.cordova.hostname;

    if (!hasCordovaConfig) {
        throw new Error(
            '[SaaS Capacitor] Missing cordova configuration in SaaSConfig'
        );
    }

    const saasConfigPath = 'saas-config.json';
    console.log(
        `[SaaS Capacitor] Saving SaaS partner config: ${saasConfigPath}`
    );
    fs.writeFileSync(saasConfigPath, JSON.stringify(saasConfig, undefined, 2));

    console.log(
        '[SaaS Capacitor] Downloading resources: icon.png and splash.png...'
    );
    console.log(
        `[SaaS Capacitor] Downloading icon: ${saasConfig.cordova.icon}`
    );
    await download.image({
        url: saasConfig.cordova.icon,
        dest: path.join(process.cwd(), 'resources/icon.png'),
    });

    console.log(
        `[SaaS Capacitor] Downloading splashscreen: ${saasConfig.cordova.splashscreen}`
    );
    await download.image({
        url: saasConfig.cordova.splashscreen,
        dest: path.join(process.cwd(), 'resources/splash.png'),
    });
}
run();
