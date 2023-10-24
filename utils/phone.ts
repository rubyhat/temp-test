import { parsePhoneNumberFromString } from 'libphonenumber-js';

import { countryCodes } from './country';

export function checkValidPhone(phone: string): boolean {
    const parsedPhone = parsePhoneNumberFromString(phone);
    if (!parsedPhone) {
        return false;
    }
    if (!parsedPhone.isValid()) {
        return false;
    }
    if (!Object.keys(countryCodes).includes(parsedPhone.country as string)) {
        return false;
    }
    return true;
}

/**
 * Негеографические номера РФ:
 * 88001001001 => 8 (800) 100-10-01
 *
 * Международные:
 * +79111111119 => +7 911 111 11 19
 * +375290000000 => +375 29 000 00 00
 *
 * @param phone
 */
export function formatPhone(phone: string) {
    const parsedPhone = parsePhoneNumberFromString(
        phone.indexOf('+') === 0 || phone.indexOf('8800') === 0
            ? phone
            : `+${phone}`,
        'RU' // чтобы спарсило телефоны с 8800
    );

    const formattedPhone = parsedPhone
        ? phone.indexOf('8800') === 0
            ? parsedPhone.formatNational()
            : parsedPhone.formatInternational()
        : phone;

    return formattedPhone.replace(/\s/g, '\xa0');
}

// Для <a href="tel:">
export function tel(phone: string) {
    return phone.replace(/\s/g, '');
}
