import * as appmetrica from './analytics/appmetrica';
import Router from 'next/router';
import { initializeOneSignal } from './onesignal';
import { SaaSConfigDto } from 'swagger/client';

declare global {
    interface Window {
        IonicDeeplink?: any;
    }
}

type IonicDeeplinkNoMatch = {
    $link: {
        fragment: string;
        host: string;
        path: string;
        queryString: string;
        scheme: string;
        url: string;
    };
};

export const onDeviceReady = (config?: SaaSConfigDto | null) => {
    if (navigator.splashscreen) {
        navigator.splashscreen.hide();
    }
    if (window.codePush) {
        try {
            window.codePush.sync();
        } catch (e) {
            console.error(e);
        }
    }
    appmetrica.activate();

    if (window.IonicDeeplink) {
        window.IonicDeeplink.route({}, () => {}, function(
            nomatch: IonicDeeplinkNoMatch
        ) {
            const {
                $link: { host, path, queryString },
            } = nomatch;
            if (host === 'atlasbus.app') {
                const url = `${path}?${queryString}`;
                Router.push(url);
            }
        });
    }

    initializeOneSignal(config);
};
