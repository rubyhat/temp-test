import isBefore from 'date-fns/isBefore';

import { format } from 'utils/date';

/**
 * Проверка на прошедшую дату.
 *
 * Используется в серпе для сверки `?date` из QueryParams
 * и подмены на текущую дату если она в прошлом.
 *
 * @param dateISO 2020-12-31
 */
export function isDateBefore(dateISO: string) {
    const today = format(new Date(), 'yyyy-MM-dd');

    return isBefore(new Date(dateISO), new Date(today));
}
