import Cookies from 'universal-cookie';
import addDays from 'date-fns/addDays';

export const NATIVE_APP_TOPPER_COOKIE_KEY = 'native-app-topper';
const cookies = new Cookies();

export function setCookie() {
    const now = new Date();

    cookies.set(NATIVE_APP_TOPPER_COOKIE_KEY, now.getTime(), {
        expires: addDays(now, 30), // save cookies for 30 days
    });
}
