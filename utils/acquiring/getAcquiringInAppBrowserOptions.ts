import { TFunction } from 'next-i18next';

/**
 * @see https://cordova.apache.org/docs/en/10.x/reference/cordova-plugin-inappbrowser/#cordovainappbrowseropen
 * @param t
 */
export function getAcquiringInAppBrowserOptions(t: TFunction): string {
    return [
        ...(window.cordova.platformId === 'ios'
            ? [
                  'location=no',
                  'toolbarcolor=#ffffff',
                  'closebuttoncolor=#000000',
                  'hideurlbar=yes',
              ]
            : []),
        ...(window.cordova.platformId === 'android'
            ? [
                  'toolbarcolor=#1154C8',
                  'closebuttoncolor=#ffffff',
                  'hideurlbar=yes',
              ]
            : []),
        ...[
            'toolbarposition=top',
            'hidenavigationbuttons=yes',
            `closebuttoncaption=${t('cancel')}`,
            'usewkwebview=yes',
        ],
    ]
        .filter(Boolean)
        .join(',');
}
