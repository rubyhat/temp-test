import * as Sentry from '@sentry/browser';
import Router from 'next/router';

import { SaaSConfigDto } from 'swagger/client';
import { UserState } from 'store/user/types';
import { i18n } from 'i18n';

declare global {
    interface Window {
        plugins?: {
            OneSignal?: any;
        };
    }
}

/**
 * @source https://gitlab.com/atlasbus/carpool/carpool-frontend/-/commit/85a23183f02300e2fffa2b7210baeb5e15bc8d91
 */
interface IOneSignalPayload {
    action: any;
    notification: {
        payload: {
            additionalData?: {
                targetUrl?: {
                    pathname: string;
                    query?: string; // Приходит в виде строки. Ниже преобразование в `Record<string, string>`
                };
            };
        };
    };
}

export const initializeOneSignal = (config?: SaaSConfigDto | null) => {
    const ONE_SIGNAL_APP_ID =
        config && config.cordova && config.cordova.oneSignalAppId;

    if (window.plugins && window.plugins.OneSignal && ONE_SIGNAL_APP_ID) {
        window.plugins.OneSignal.setLogLevel({ logLevel: 0, visualLevel: 0 });

        const notificationOpenedCallback = (
            oneSignalPayload: IOneSignalPayload
        ) => {
            const {
                notification: { payload },
            } = oneSignalPayload;

            if (payload.additionalData && payload.additionalData.targetUrl) {
                const { pathname, query } = payload.additionalData.targetUrl;

                try {
                    Router.push({
                        pathname,
                        query: query ? JSON.parse(query) : undefined,
                    });
                } catch (err) {
                    Sentry.captureException(err);
                    console.log(err);
                }
            }
        };

        const iosSettings: any = {};
        iosSettings['kOSSettingsKeyAutoPrompt'] = false;
        iosSettings['kOSSettingsKeyInAppLaunchURL'] = false;

        console.log('[OneSignal] Init with ID:', ONE_SIGNAL_APP_ID);
        window.plugins.OneSignal.startInit(ONE_SIGNAL_APP_ID)
            .handleNotificationOpened(notificationOpenedCallback)
            .iOSSettings(iosSettings)
            .inFocusDisplaying(
                window.plugins.OneSignal.OSInFocusDisplayOption.Notification
            )
            .endInit();
        const localStorageUser = localStorage.getItem('user');
        if (localStorageUser) {
            const user: UserState = JSON.parse(localStorageUser);
            oneSignalRegisterUser(user.phoneNumber);
        }
    }
};

export const oneSignalRegisterUser = (phone: string) => {
    if (window.plugins && window.plugins.OneSignal) {
        window.plugins.OneSignal.setExternalUserId(phone);
    }
};

export const requestPushPermissions = (): Promise<boolean> => {
    return new Promise(async resolve => {
        try {
            if (window.navigator && window.navigator.notification) {
                if (window.plugins && window.plugins.OneSignal) {
                    window.plugins.OneSignal.getPermissionSubscriptionState(
                        ({ permissionStatus }: any) => {
                            if (!permissionStatus.hasPrompted) {
                                navigator.notification.confirm(
                                    i18n.t(
                                        'requestNotificationPermissionsSubtitle'
                                    ),
                                    id => {
                                        if (
                                            id === 1 &&
                                            window.plugins &&
                                            window.plugins.OneSignal
                                        ) {
                                            window.plugins.OneSignal.promptForPushNotificationsWithUserResponse(
                                                function(accepted: boolean) {
                                                    resolve(accepted);
                                                }
                                            );
                                        } else {
                                            resolve(false);
                                        }
                                    },
                                    i18n.t(
                                        'requestNotificationPermissionsTitle'
                                    ),
                                    [i18n.t('yes'), i18n.t('no')]
                                );
                            }
                        }
                    );
                }
                resolve(false);
            }
        } catch (e) {
            Sentry.captureException(e);
            resolve(false);
        }
    });
};
