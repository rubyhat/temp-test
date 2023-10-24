import * as Sentry from '@sentry/browser';

import { StopsDto } from 'swagger/client';

/**
 * Вернет uids сохраненных остановок.
 *
 * Пример: ["55.7585:37.7520", "54.6968:20.5339"]
 */
export function getStopsFromLS(): string[] {
    try {
        const uidsRaw = localStorage.getItem('savedStops');

        if (uidsRaw) {
            return JSON.parse(uidsRaw);
        }
    } catch (err) {
        localStorage.removeItem('savedStopsUIDs');
        Sentry.captureException(err);
    }

    return [];
}

/**
 * Сохранит uid остановки в LocalStorage
 */
export function saveStopToLS(uid: string) {
    let stops = getStopsFromLS();

    if (stops.indexOf(uid) !== -1) return; // не дублировать остановки

    stops.unshift(uid);
    if (stops.length > 10) {
        stops = stops.slice(0, 10);
    }

    try {
        localStorage.setItem('savedStops', JSON.stringify(stops));
    } catch (err) {
        localStorage.removeItem('savedStops');
        Sentry.captureException(err);
    }
}

export function findStopInLS(stops: StopsDto[]): StopsDto | null {
    const stopsUids = getStopsFromLS();

    for (let i = 0; i < stopsUids.length; i++) {
        const uid = stopsUids[i];
        const stop = stops.find(stop => stop.id === uid);

        if (stop) return stop;
    }

    return null;
}
