import { StopsDto } from 'swagger/client';

export function getFirstStop(stops: StopsDto[]): StopsDto | null {
    return stops[0] || null;
}
export function getLastStop(stops: StopsDto[]): StopsDto | null {
    return stops[stops.length - 1] || null;
}
