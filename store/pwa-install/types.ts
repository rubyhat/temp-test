export type PWAInstallState = {
    status: 'idle' | 'waitingForInstall' | 'installed' | 'dismissed';
    /**
     * Событие `beforeinstallprompt` было сохранено в `window.deferredPrompt`.
     */
    pwaPromptWasDeferred: boolean;
};

export const PWA_INIT = 'PWA_INIT';
export const PWA_LISTEN_BEFORE_INSTALL_PROMPT =
    'PWA_LISTEN_BEFORE_INSTALL_PROMPT';
export const PWA_BEFORE_INSTALL_PROMPT_SAVED =
    'PWA_BEFORE_INSTALL_PROMPT_SAVED';
export const PWA_LISTEN_APP_INSTALLED = 'PWA_LISTEN_APP_INSTALLED';
export const PWA_WAITING_FOR_INSTALL = 'PWA_WAITING_FOR_INSTALL';
export const PWA_INSTALLED_SUCCESSFULLY = 'PWA_INSTALLED_SUCCESSFULLY';
export const PWA_INSTALLATION_DISMISSED = 'PWA_INSTALLATION_DISMISSED';
export const PWA_DIALOG_CLOSED = 'PWA_DIALOG_CLOSED';

type PWAInit = {
    type: typeof PWA_INIT;
};

type PWAListenBeforeInstallPrompt = {
    type: typeof PWA_LISTEN_BEFORE_INSTALL_PROMPT;
};

type PWABeforeInstallPromptSaved = {
    type: typeof PWA_BEFORE_INSTALL_PROMPT_SAVED;
};

type PWAListenAppInstalled = {
    type: typeof PWA_LISTEN_APP_INSTALLED;
};

type PWAWaitingForInstall = {
    type: typeof PWA_WAITING_FOR_INSTALL;
};

type PWAInstalledSuccessfully = {
    type: typeof PWA_INSTALLED_SUCCESSFULLY;
};

type PWAInstallationDismissed = {
    type: typeof PWA_INSTALLATION_DISMISSED;
};

type PWADialogClosed = {
    type: typeof PWA_DIALOG_CLOSED;
};

export type PWAInstallActionTypes =
    | PWAInit
    | PWAListenBeforeInstallPrompt
    | PWABeforeInstallPromptSaved
    | PWAListenAppInstalled
    | PWAWaitingForInstall
    | PWAInstalledSuccessfully
    | PWAInstallationDismissed
    | PWADialogClosed;
