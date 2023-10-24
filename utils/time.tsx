import differenceInMinutes from 'date-fns/differenceInMinutes';
import zonedTimeToUtc from 'date-fns-tz/zonedTimeToUtc';
import isBefore from 'date-fns/isBefore';
import isAfter from 'date-fns/isAfter';
import { TFunction } from 'next-i18next';
import parseISO from 'date-fns/parseISO';
import addSeconds from 'date-fns/addSeconds';

import { format } from './date';

type DaysHoursMinutes = {
    days: number;
    hours: number;
    minutes: number;
};

export function getTimeDifferenceWithTimezone(
    date1: Date | string | number,
    date2: Date | string | number,
    timezone1: string,
    timezone2: string
): DaysHoursMinutes {
    const utcDate1 = zonedTimeToUtc(date1, timezone1);
    const utcDate2 = zonedTimeToUtc(date2, timezone2);

    const totalMinutes = differenceInMinutes(utcDate2, utcDate1);

    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = Math.floor(totalMinutes % 60);

    return {
        days,
        hours,
        minutes,
    };
}

export function formatDaysHoursMinutes(
    interval: DaysHoursMinutes,
    t: TFunction
) {
    const { days, hours, minutes } = interval;

    if (days) {
        return `${days} ${t('dateTokenDay')} ${
            hours ? `${hours} ${t('dateTokenHour')}` : ''
        }`;
    }

    if (hours) {
        return `${hours} ${t('dateTokenHour')} ${
            minutes ? `${minutes} ${t('dateTokenMinute')}` : ''
        }`;
    }

    if (minutes) {
        return `${minutes} ${t('dateTokenMinute')}`;
    }
}

export function calculateTimeBeforeDeparture(
    dateISO: string,
    timezone: string,
    t: TFunction
) {
    const currentDateUtc = new Date().toISOString();
    const departureDateUtc = zonedTimeToUtc(parseISO(dateISO), timezone);

    const duration = getTimeDifferenceWithTimezone(
        currentDateUtc,
        departureDateUtc,
        '',
        ''
    );

    return formatDaysHoursMinutes(duration, t);
}

export function formatTime(seconds: number) {
    const date = addSeconds(new Date(0), seconds);
    return format(date, 'mm:ss');
}

/**
 *  -1 => Рейс еще не стартовал
 *  0 => Рейс в пути
 *  1 => Рейс завершён
 *
 * @param departureDate ISO
 * @param departureTimezone
 * @param arrivalDate ISO
 * @param arrivalTimezone
 */
export function getRideTimeStatus(
    departureDate: string,
    departureTimezone: string,
    arrivalDate: string,
    arrivalTimezone: string
) {
    const currentDateUtc = parseISO(new Date().toISOString());
    const departureDateUtc = zonedTimeToUtc(
        parseISO(departureDate),
        departureTimezone
    );
    const arrivalDateUtc = zonedTimeToUtc(
        parseISO(arrivalDate),
        arrivalTimezone
    );

    if (isBefore(currentDateUtc, departureDateUtc)) {
        return -1;
    } else if (isAfter(currentDateUtc, arrivalDateUtc)) {
        return 1;
    }

    return 0;
}

/**
 * Вернет `true` если рейс завершен.
 * @param arrivalDate
 * @param arrivalTimezone
 */
export function checkRideCompleted(
    arrivalDate: string,
    arrivalTimezone: string
): boolean {
    const currentDateUtc = parseISO(new Date().toISOString());
    const arrivalDateUtc = zonedTimeToUtc(
        parseISO(arrivalDate),
        arrivalTimezone
    );

    return isAfter(currentDateUtc, arrivalDateUtc);
}
