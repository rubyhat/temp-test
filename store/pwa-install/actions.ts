import {
    PWA_BEFORE_INSTALL_PROMPT_SAVED,
    PWA_DIALOG_CLOSED,
    PWA_INIT,
    PWA_INSTALLATION_DISMISSED,
    PWA_INSTALLED_SUCCESSFULLY,
    PWA_LISTEN_APP_INSTALLED,
    PWA_LISTEN_BEFORE_INSTALL_PROMPT,
    PWA_WAITING_FOR_INSTALL,
    PWAInstallActionTypes,
} from './types';

export const pwaInit = (): PWAInstallActionTypes => ({
    type: PWA_INIT,
});

export const pwaListenBeforeInstallPrompt = (): PWAInstallActionTypes => ({
    type: PWA_LISTEN_BEFORE_INSTALL_PROMPT,
});

export const pwaBeforeInstallPromptSaved = (): PWAInstallActionTypes => ({
    type: PWA_BEFORE_INSTALL_PROMPT_SAVED,
});

export const pwaListenAppInstalled = (): PWAInstallActionTypes => ({
    type: PWA_LISTEN_APP_INSTALLED,
});

export const pwaWaitingForInstall = (): PWAInstallActionTypes => ({
    type: PWA_WAITING_FOR_INSTALL,
});

export const pwaInstalledSuccessfully = (): PWAInstallActionTypes => ({
    type: PWA_INSTALLED_SUCCESSFULLY,
});

export const pwaInstallationDismiss = (): PWAInstallActionTypes => ({
    type: PWA_INSTALLATION_DISMISSED,
});

export const pwaDialogClosed = (): PWAInstallActionTypes => ({
    type: PWA_DIALOG_CLOSED,
});
