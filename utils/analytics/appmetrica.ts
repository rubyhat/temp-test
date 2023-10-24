declare global {
    interface Window {
        appMetrica: any;
    }
}

export const activate = () => {
    const { APP_METRICA_KEY } = process.env;

    if (window.appMetrica && APP_METRICA_KEY) {
        window.appMetrica.activate({
            apiKey: process.env.APP_METRICA_KEY,
            // Optional
            locationTracking: true,
            handleFirstActivationAsUpdate: true,
            sessionTimeout: 15,
            preloadInfo: {
                trackingId: '819783099222126858',
                additionalParams: {
                    utm_source: 'atlas-morda',
                    utm_medium: 'referral',
                    utm_campaign: 'main-page-android',
                },
            },
        });
    }
};
