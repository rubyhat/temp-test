import { SearchDto } from 'swagger/client';
import { SURGE_DEFAULT_PERCENTAGE } from 'components/Surge/constants';

export function isSurged(
    rides: SearchDto[],
    surgedFromPercentage: number = SURGE_DEFAULT_PERCENTAGE
): boolean {
    const surgedRidesCount = rides.filter(ride => ride.flightPopular === 1)
        .length;

    if (rides.length === 0 || surgedRidesCount === 0) return false;

    const surgedPercentage = (surgedRidesCount / rides.length) * 100;

    return surgedPercentage > surgedFromPercentage;
}
