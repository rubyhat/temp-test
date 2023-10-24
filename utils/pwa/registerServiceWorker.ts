import { Workbox } from 'workbox-window';

import { isClient, isCordova } from 'utils/platform';
import swConfig from 'utils/pwa/swConfig';

declare global {
    interface Window {
        workbox?: Workbox;
    }
}

export function registerServiceWorker(): Promise<
    ServiceWorkerRegistration | undefined
> {
    if (isCordova) return Promise.resolve(undefined);

    if (isClient && process.env.SW && 'serviceWorker' in navigator) {
        console.log('[PWA] Waiting for Window: load event');

        return new Promise(resolve => {
            // Use the window load event to keep the page load performant
            window.addEventListener('load', event => {
                window.workbox = new Workbox(swConfig.scriptFilename);

                console.log('[PWA] Workbox register');
                const registration = window.workbox.register();
                resolve(registration);
            });
        });
    } else {
        console.log('[PWA] Skip Workbox registration');
    }

    return Promise.resolve(undefined);
}

export function unregisterServiceWorker() {
    if (isCordova) return Promise.resolve(undefined);

    if (isClient && process.env.SW && 'serviceWorker' in navigator) {
        console.log('[PWA] Unregistering SW...');

        navigator.serviceWorker
            .getRegistrations()
            .then(registrations => {
                registrations.forEach(registation => {
                    registation.unregister();
                    console.log(
                        '[PWA] Service Worker unregistered',
                        registation
                    );
                });
            })
            .catch(err => {
                console.log('[PWA] Service Worker unregister failed: ', err);
            });
    }
}
