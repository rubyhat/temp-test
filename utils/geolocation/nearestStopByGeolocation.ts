import { distance } from '@turf/turf';

import { StopsDto } from 'swagger/client';

/**
 * Ищем ближайшую остановку радиусе N км.
 * @param position
 * @param stops
 * @param minDistance Минимальное расстояние (в km)
 */
export function nearestStopByGeolocation(
    position: { latitude: number; longitude: number },
    stops: StopsDto[],
    minDistance = 2
): StopsDto | undefined {
    if (stops.length < 1) return;

    // in kilometers
    const stopsDistances: number[] = stops.map(stop => {
        return distance(
            [position.latitude, position.longitude],
            [stop.latitude, stop.longitude],
            {
                units: 'kilometers',
            }
        );
    });

    const stopMinDistance = Math.min.apply(null, stopsDistances);

    if (stopMinDistance <= minDistance) {
        const stopMinDistanceIndex = stopsDistances.indexOf(stopMinDistance);
        return stops[stopMinDistanceIndex];
    }

    return undefined;
}
