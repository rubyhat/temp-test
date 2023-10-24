import minBy from 'lodash/minBy';
import maxBy from 'lodash/maxBy';

import { PaymentType } from 'components/BookingPaymentSelect';
import {
    BookParamsDto,
    CardDto,
    ForbiddenPaymentType,
    RideDtoPaymentTypesEnum,
    StopsDto,
} from 'swagger/client';
import { rideMinPrice } from 'utils/ride';

export function getRelevantPaymentType(
    paymentTypes: RideDtoPaymentTypesEnum[],
    disabled: Record<PaymentType, boolean>,
    forbidden: Record<PaymentType, boolean>,
    cards: CardDto[]
): PaymentType | '' {
    if (
        paymentTypes.includes(RideDtoPaymentTypesEnum.Reccur) &&
        cards.length &&
        !disabled.bank &&
        !forbidden.bank
    ) {
        return cards[0].id;
    } else if (!disabled.bank && !forbidden.bank) {
        return 'bank';
    } else if (!disabled.cash && !forbidden.cash) {
        return 'cash';
    } else if (!disabled.miles && !forbidden.miles) {
        return 'miles';
    }

    return '';
}

export function forbiddenPaymentMap(
    paymentTypes: ForbiddenPaymentType[]
): Record<PaymentType, boolean> {
    return {
        bank: !!paymentTypes.find(
            p => p.type === 'card' || p.type === 'reccur'
        ),
        cash: !!paymentTypes.find(p => p.type === 'cash'),
        miles: !!paymentTypes.find(p => p.type === 'miles'),
    };
}

export function getFirstImportantStop(stops: StopsDto[]): StopsDto | undefined {
    const importantStops = stops.filter(stop => stop.important);

    return minBy(importantStops, stop => stop.datetime);
}

export function getLastImportantStop(stops: StopsDto[]): StopsDto | undefined {
    const importantStops = stops.filter(stop => stop.important);

    return maxBy(importantStops, stop => stop.datetime);
}

/**
 * Вернет `true` если содержит буквы только одного алфавита.
 */
export function containsSingleAlphabet(str: string): boolean {
    return (
        !!str.match(/^[a-z -]*$/i) ||
        !!str.match(/^[а-яіўё -]*$/i) ||
        !!str.match(/^[a-ząćęłńóśźż -]*$/i)
    );
}

/**
 * Посчитает приблизительную стоимость поездки.
 *
 * На этапах выбора остановок нам неизвестно какой тариф будет использован
 * для каждого пассажира. Это будет известно только после выбора тарифа на
 * экране "Пассажиры". Посчитаем цену как за стандартный тариф.
 *
 * @param bookParams
 */
export function approximateRidePrice(
    bookParams: BookParamsDto,
    paymentTypes: string[] = []
): number {
    return bookParams.ticketTypes.reduce(
        (acc, tt) =>
            acc + rideMinPrice(tt[0].price, tt[0].onlinePrice, paymentTypes),
        0
    );
}
