import { CalendarDto } from 'swagger/client';

export function excludeCurrentDate(
    calendar: CalendarDto[],
    currentDate: string
): CalendarDto[] {
    return calendar.filter(item => item.date !== currentDate);
}
