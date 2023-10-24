import { useCallback, useEffect, useState } from 'react';

/**
 * @source https://github.com/FilipChalupa/pwa-install-handler/blob/main/src/BeforeInstallPromptEvent.ts
 */
export interface BeforeInstallPromptEvent extends Event {
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
        platform: string;
    }>;

    prompt(): Promise<void>;
}

declare global {
    interface Window {
        deferredPrompt: BeforeInstallPromptEvent;
    }
}

/**
 * Listen and save the `beforeinstallprompt` event,
 * so it can be used to trigger the install flow later.
 */
export function usePwaBeforeInstallPrompt() {
    const [
        deferredPrompt,
        setDeferredPrompt,
    ] = useState<BeforeInstallPromptEvent | null>(null);

    const listener = useCallback((e: Event) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later.
        window.deferredPrompt = e as any;
        setDeferredPrompt(e as any);
    }, []);

    useEffect(() => {
        window.addEventListener('beforeinstallprompt', listener);

        return () => {
            window.removeEventListener('beforeinstallprompt', listener);
        };
    }, []);

    return {
        deferredPrompt,
    };
}

/**
 * Triggers deferred install prompt.
 *
 * @return Returns `true` if user accepted the install prompt.
 */
export function triggerInstallPrompt(): Promise<boolean> {
    if (!window.deferredPrompt) return Promise.resolve(false);

    window.deferredPrompt.prompt();

    return window.deferredPrompt.userChoice.then(choiceResult => {
        return choiceResult.outcome === 'accepted';
    });
}
