import utcToZonedTime from 'date-fns-tz/utcToZonedTime';

import { format } from 'utils/date';

/**
 * Вернет текущую дату в городе отправления
 * @param timezone Пример: Europe/Moscow
 * @returns Только дата, без времени: 2020-12-31
 */
export function getTodayDateOfCity(timezone: string): string {
    const ISODate = new Date().toISOString();
    const utc = utcToZonedTime(ISODate, timezone);

    return format(utc, 'yyyy-MM-dd');
}
