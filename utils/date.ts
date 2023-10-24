import dateFormat from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import ru from 'date-fns/locale/ru';
import en from 'date-fns/locale/en-US';
import pl from 'date-fns/locale/pl';
import be from 'date-fns/locale/be';
import lt from 'date-fns/locale/lt';
import lv from 'date-fns/locale/lv';
import de from 'date-fns/locale/de';

import { i18n } from 'i18n';
import { Locale } from 'i18n/utils';

const locales = {
    en,
    ru,
    pl,
    be,
    lt,
    lv,
    de,
};

/**
 * Date format with i18n.
 * @param date
 * @param format
 */
export function format(date: Date | number, format: string) {
    return dateFormat(date, format, {
        locale:
            locales[(i18n.language && i18n.language.substr(0, 2)) as Locale],
    });
}

export function isISODate(dateString: string): boolean {
    return /^\d{4}-\d{2}-\d{2}$/.test(dateString);
}

export function readableDate(dateISO: string) {
    try {
        const dateObj = parseISO(dateISO);

        const date = format(dateObj, 'dd.LL.yyyy');
        const time = format(dateObj, 'HH:mm');

        return `${date} ${time}`;
    } catch (err) {
        return `Invalid date: ${dateISO}`;
    }
}
