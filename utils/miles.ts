import { SearchDto, RideDto } from 'swagger/client';

export function getMilesReward(ride: SearchDto): number {
    const { atlasMeta } = ride;

    if (!atlasMeta || !atlasMeta.miles) return 0;
    if (!atlasMeta.miles.card) return atlasMeta.miles.cash || 0;
    if (!atlasMeta.miles.cash) return atlasMeta.miles.card || 0;
    return atlasMeta.miles.card > atlasMeta.miles.cash
        ? atlasMeta.miles.card
        : atlasMeta.miles.cash;
}

export function getBonusProps(
    ride: RideDto | null | undefined
): { bank: number; cash: number } {
    if (!ride || !ride.atlasMeta || !ride.atlasMeta.miles)
        return {
            bank: 0,
            cash: 0,
        };

    return {
        bank: ride.atlasMeta.miles.card || 0,
        cash: ride.atlasMeta.miles.cash || 0,
    };
}
