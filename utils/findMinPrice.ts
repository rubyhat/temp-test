import { Price } from 'swagger/client';
import { CurrencySymbol } from 'utils/currency';

/**
 * Вернет объект с минимальной ценой в определенной валюте
 * с фолбеком на любую валюту.
 *
 * @param minPrices
 * @param defaultCurrency
 */
export function findMinPrice(
    minPrices: Price[],
    defaultCurrency: CurrencySymbol
): Price | null {
    const minPriceByCurrency = minPrices.filter(
        mp => mp.currency === defaultCurrency
    );

    return minPriceByCurrency[0] || minPrices[0] || null;
}
