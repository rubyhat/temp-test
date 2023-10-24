import Cookies from 'universal-cookie';
import addDays from 'date-fns/addDays';
import addYears from 'date-fns/addYears';

import { isServer } from 'utils/platform';

const cookies = new Cookies();

export const PWA_PROMPTED_KEY = 'pwa-prompted';

/**
 * Было ли ранее предложено установить приложение.
 */
export function pwaPromptedCookie() {
    if (isServer) return false;

    return !!cookies.get(PWA_PROMPTED_KEY);
}

/**
 * При отказе установить приложение ставим куку на 14 дней
 */
export function setPwaPromptedCookie() {
    const now = new Date();

    cookies.set(PWA_PROMPTED_KEY, now.getTime(), {
        expires: addDays(now, 14), // save cookies for 14 days
    });
}

/**
 * После успешной установки ставим куки навсегда.
 */
export function setPwaInstalledCookie() {
    const now = new Date();

    cookies.set(PWA_PROMPTED_KEY, now.getTime(), {
        expires: addYears(now, 100),
    });
}
