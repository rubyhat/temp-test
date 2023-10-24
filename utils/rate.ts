import * as Sentry from '@sentry/browser';

import { SaaSConfigDto } from 'swagger/client';

declare global {
    interface Window {
        AppRate?: any;
    }
}

export const rateThisApp = (config?: SaaSConfigDto | null): boolean => {
    const appRateAndroidUrl =
        config && config.cordova && config.cordova.appRateAndroidUrl;
    const appRateIosId =
        config && config.cordova && config.cordova.appRateIosId;

    if (process.browser && window.AppRate) {
        try {
            const lastUsageItem = localStorage.getItem('rateMeTs');
            const lastUsage = lastUsageItem
                ? new Date(parseInt(lastUsageItem))
                : null;
            if (!lastUsage) {
                window.AppRate.preferences.storeAppURL = {
                    ios: appRateIosId,
                    android: appRateAndroidUrl,
                };
                window.AppRate.promptForRating();
                localStorage.setItem(
                    'rateMeTs',
                    new Date().valueOf().toString()
                );
                return true;
            }
        } catch (e) {
            Sentry.captureException(e);
        }
    }
    return false;
};
