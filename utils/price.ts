import { PaymentType } from 'components/BookingPaymentSelect';
import { LOYALTY_SUCCESS, LoyaltyState } from 'store/loyalty/types';

/**
 * Подсчет цены за N билетов по ДЦО.
 * @param paymentType
 * @param loyalty
 * @param ticketsPrice
 */
export function calcDynamicPrice(
    paymentType: PaymentType | '',
    loyalty: LoyaltyState,
    ticketsPrice: number
) {
    if (loyalty.status === LOYALTY_SUCCESS && paymentType) {
        if (paymentType === 'bank' || typeof paymentType === 'number') {
            return loyalty.onlinePrice;
        } else if (paymentType === 'cash') {
            return loyalty.price;
        } else if (paymentType === 'miles') {
            return loyalty.milesPrice;
        }
    }

    return ticketsPrice;
}

export function formatPrice(
    price: number,
    currencySymbol: string,
    decimalCount: number = 2
): string {
    if (typeof price === 'number') {
        const priceDecimal = parseFloat(price.toFixed(decimalCount));
        return `${priceDecimal} ${currencySymbol}`.replace(/\s/g, '\xa0');
    }
    return '';
}
