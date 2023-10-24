import {
    point,
    centerOfMass,
    featureCollection,
    lineString,
    bbox,
    distance,
} from '@turf/turf';

import { StopsDto } from 'swagger/client';

export function getCenterOfMass(stops: StopsDto[]) {
    const polygon = featureCollection(
        stops.map(stop => point([stop.latitude, stop.longitude]))
    );

    const featurePoint = centerOfMass(polygon);

    if (featurePoint.geometry) {
        return featurePoint.geometry.coordinates;
    }

    return [0, 0];
}

export function getBoundingBox(stops: StopsDto[]) {
    const line = lineString(stops.map(stop => [stop.latitude, stop.longitude]));

    return bbox(line);
}

export function nearestStop(
    targetPoint: { lat: number; lng: number },
    stops: StopsDto[]
): StopsDto | null {
    if (stops.length === 0) return null;

    const { lat, lng } = targetPoint;

    return stops.reduce((acc, stop) => {
        const stopDistance = distance(
            [lat, lng],
            [stop.latitude, stop.longitude]
        );
        const accDistance = distance([lat, lng], [acc.latitude, acc.longitude]);

        if (stopDistance < accDistance) {
            return stop;
        }

        return acc;
    }, stops[0]);
}
