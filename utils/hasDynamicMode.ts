import { SearchDto } from 'swagger/client';

/**
 * В серпе присутствуют рейсы с динамическими остановками (D2D).
 * @param rides
 */
export function hasDynamicMode(rides: SearchDto[]): boolean {
    return rides.some(ride => ride.dynamicMode);
}
