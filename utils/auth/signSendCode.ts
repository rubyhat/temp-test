import format from 'date-fns/format';
import md5 from 'md5';

import { version } from 'package.json';

/**
 * Подпись смс авторизации
 * @see https://tracker.yandex.ru/ATLASDEV-1017
 */
export function signSendCode(phoneNumber: string) {
    // ISO строка с датой и временем инициализации запроса
    // Формат: 2020-11-26T12:39:51+00:00
    const dateISO = format(new Date(), "yyyy-MM-dd'T'HH:mm:ssxxx");

    phoneNumber = phoneNumber.replace(/[^\d]/g, '');

    return {
        ts: dateISO,
        s: md5(
            [
                phoneNumber,
                dateISO,
                process.env.SIGN_SEND_CODE_SECRET,
                version,
            ].join(':')
        ),
    };
}
