/**
 * Только Cordova.
 */
export const isCordova = process.env.CORDOVA === 'true';

/**
 * В момент вызова `CORDOVA=true npm run build`.
 */
export const isCordovaBuild =
    process.env.CORDOVA === 'true' && !process.browser;

/**
 * Является сервером но не билдом Cordova.
 *
 * При генерации статики `npx next export` Next.JS выполняет getInitialProps()
 * чтобы забандлить результат, поэтому `!process.browser` необязательно сервер.
 */
export const isServer = !process.browser && !isCordova;

/**
 * Является браузером но не Cordova.
 */
export const isBrowser = process.browser && !isCordova;

/**
 * Браузер или Cordova.
 */
export const isClient = !isServer;

/**
 * Приложение запущено внутри PWA.
 */
export function isPWA(): boolean {
    return isBrowser && window.matchMedia('(display-mode: standalone)').matches;
}

export function iOS(): boolean {
    if (!process.browser) return false;

    return (
        [
            'iPad Simulator',
            'iPhone Simulator',
            'iPod Simulator',
            'iPad',
            'iPhone',
            'iPod',
        ].includes(navigator.platform) ||
        // iPad on iOS 13 detection
        (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
    );
}

export function isIPad(): boolean {
    if (!process.browser) return false;

    return (
        ['iPad Simulator', 'iPad'].includes(navigator.platform) ||
        // iPad on iOS 13 detection
        (navigator.userAgent.includes('iPad') && 'ontouchend' in document)
    );
}
