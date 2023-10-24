import parseISO from 'date-fns/parseISO';

import { RideDto, StopsDto } from 'swagger/client';
import { format } from 'utils/date';

export function calcApproximateDepartureTime(
    ride?: RideDto | null,
    stop?: StopsDto | null
): string {
    if (!ride || !stop) return '';

    const startTime = format(parseISO(stop.datetime), 'HH:mm');
    const endTime = format(parseISO(ride.departure), 'HH:mm');

    if (startTime === endTime) {
        return startTime;
    }

    if (startTime > endTime) {
        return `${endTime}–${startTime}`;
    }

    // startTime < endTime
    return `${startTime}–${endTime}`;
}

export function calcApproximateArrivalTime(
    ride?: RideDto | null,
    stop?: StopsDto | null
): string {
    if (!ride || !stop) return '';

    const startTime = format(parseISO(stop.datetime), 'HH:mm');
    const endTime = format(parseISO(ride.arrival as string), 'HH:mm');

    if (startTime === endTime) {
        return startTime;
    }

    if (startTime > endTime) {
        return `${endTime}–${startTime}`;
    }

    // startTime < endTime
    return `${startTime}–${endTime}`;
}
