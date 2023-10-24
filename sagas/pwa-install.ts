import * as Sentry from '@sentry/browser';
import { END, eventChannel, SagaIterator } from 'redux-saga';
import { takeLatest, call, put, all, take } from 'redux-saga/effects';

import {
    PWA_DIALOG_CLOSED,
    PWA_INIT,
    PWA_INSTALLATION_DISMISSED,
    PWA_INSTALLED_SUCCESSFULLY,
    PWA_WAITING_FOR_INSTALL,
    pwaBeforeInstallPromptSaved,
    pwaInstallationDismiss,
    pwaInstalledSuccessfully,
    pwaListenAppInstalled,
    pwaListenBeforeInstallPrompt,
} from 'store/pwa-install';
import {
    setPwaInstalledCookie,
    setPwaPromptedCookie,
} from 'utils/pwa/webmanifest';
import {
    BeforeInstallPromptEvent,
    triggerInstallPrompt,
} from 'hooks/usePwaBeforeInstallPrompt';

function* deferredInstallPromptChannel(): SagaIterator {
    return eventChannel<BeforeInstallPromptEvent>(emitter => {
        const listener = (e: Event) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            emitter(e as BeforeInstallPromptEvent);
            emitter(END);
        };

        window.addEventListener('beforeinstallprompt', listener);

        return () => {
            window.removeEventListener('beforeinstallprompt', listener);
        };
    });
}

/**
 * Detect when the PWA was successfully installed,
 * if the user installs your PWA from the address bar
 * or other browser component.
 */
function* appInstalledChannel(): SagaIterator {
    return eventChannel<boolean>(emitter => {
        const listener = () => {
            emitter(END);
        };

        window.addEventListener('appinstalled', listener);

        return () => {
            window.removeEventListener('appinstalled', listener);
        };
    });
}

function* initPWA(): SagaIterator {
    const deferredInstallPrompt = yield call(deferredInstallPromptChannel);
    const appInstalled = yield call(appInstalledChannel);

    try {
        yield put(pwaListenBeforeInstallPrompt());

        while (true) {
            // Stash the event so it can be triggered later.
            const deferredEvent = yield take(deferredInstallPrompt);
            window.deferredPrompt = deferredEvent;

            yield put(pwaBeforeInstallPromptSaved());
        }
    } finally {
        try {
            yield put(pwaListenAppInstalled());

            while (true) {
                yield take(appInstalled);
            }
        } finally {
            // App installed successfully
            yield put(pwaInstalledSuccessfully());
        }
    }
}

function* waitingForInstall(): SagaIterator {
    try {
        const installed = yield call(triggerInstallPrompt);

        if (installed) {
            yield put(pwaInstalledSuccessfully());
        } else {
            yield put(pwaInstallationDismiss());
        }
    } catch (err) {
        Sentry.captureException(err);
        console.log(err);
    }
}

function* installedSuccessfully(): SagaIterator {
    setPwaInstalledCookie();
}

function* installationDismissed(): SagaIterator {
    // setPwaPromptedCookie();
}

function* dialogClosed(): SagaIterator {
    setPwaPromptedCookie();
}

export function* watchPWAInstall(): SagaIterator {
    yield all([
        takeLatest(PWA_INIT, initPWA),
        takeLatest(PWA_WAITING_FOR_INSTALL, waitingForInstall),
        takeLatest(PWA_INSTALLED_SUCCESSFULLY, installedSuccessfully),
        takeLatest(PWA_INSTALLATION_DISMISSED, installationDismissed),
        takeLatest(PWA_DIALOG_CLOSED, dialogClosed),
    ]);
}
