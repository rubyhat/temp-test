import { CapacitorConfig } from '@capacitor/cli';

const saasConfig = require('./saas-config.json');

const config: CapacitorConfig = {
    appId: saasConfig.cordova.iosAppId, // или saasConfig.cordova.androidAppId, без разницы, значения как правило одинаковые
    appName: saasConfig.cordova.appName,
    webDir: 'www',
    bundledWebRuntime: false,
    server: {
        url: `https://${saasConfig.cordova.hostname}`,
    },
};

export default config;
