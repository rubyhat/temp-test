import { StopOverLegDto } from 'swagger/client';

/**
 * Вернет имена стыковочных городов.
 * @param legs
 */
export function getConnectingCities(legs: StopOverLegDto[]): string[] {
    return legs
        .map(leg => leg.fromName)
        .reduce<string[]>((acc, curr, index) => {
            if (index === 0) return acc;

            return [...acc, curr];
        }, []);
}

/**
 * Суммирует цены плеч маршрута.
 * @param legs
 */
export function sumConnectingCitiesPrices(legs: StopOverLegDto[]): number {
    return legs.reduce((acc, curr) => {
        return acc + curr.minPrice;
    }, 0);
}
