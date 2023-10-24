import { useSelector } from 'react-redux';

import {
    SearchDto,
    SearchDtoFlightPopularEnum,
    SearchDtoPaymentTypesEnum,
} from 'swagger/client';
import { RootState } from 'store';
import { SearchRidesState } from 'store/search-rides/types';
import { useSAAS } from 'hooks/useSAAS';
import { CurrencySymbol } from 'utils/currency';

// Вернет процент рейсов у которых есть ОО
function ridesWithOnlinePaymentPercent(rides: SearchDto[]): number {
    const ridesWithOnlinePaymentCount = rides.filter(
        ride => ride.paymentTypes.indexOf(SearchDtoPaymentTypesEnum.Card) > -1
    ).length;

    if (rides.length === 0 || ridesWithOnlinePaymentCount === 0) return 0;

    const withOnlinePaymentPercentage =
        (ridesWithOnlinePaymentCount / rides.length) * 100;

    return withOnlinePaymentPercentage;
}

export function useBadges(ride: SearchDto) {
    const { meta } = useSAAS();
    const { rides } = useSelector<RootState, SearchRidesState>(
        rootState => rootState.searchRides
    );

    const isSurged = ride.flightPopular === SearchDtoFlightPopularEnum.NUMBER_1;
    const displaySurgedBadge = isSurged && !meta.surgeDisabled;

    // Отобразить бейдж "Можно картой"
    // если опция включена в SaaS админке
    // и рейсов с онлайн оплатой меньше xx%
    const rideCurrency = ride.currency as CurrencySymbol;
    const onlinePaymentBadgeEnabled =
        (meta.onlinePaymentBadgeEnabledRU && rideCurrency === 'RUB') ||
        (meta.onlinePaymentBadgeEnabledBY && rideCurrency === 'BYN');
    const displayOnlinePaymentBadge =
        ride.paymentTypes.indexOf(SearchDtoPaymentTypesEnum.Card) > -1 &&
        onlinePaymentBadgeEnabled &&
        ridesWithOnlinePaymentPercent(rides) <=
            (meta.onlinePaymentBadgeMaxPercentage || 0) &&
        ride.freeSeats > 0;

    const settingMaxPercent =
        ridesWithOnlinePaymentPercent(rides) <=
        (meta.onlinePaymentBadgeMaxPercentage || 0);

    const settingHasFreeSeats = ride.freeSeats > 0;

    const hasOnlyCashPayment =
        onlinePaymentBadgeEnabled &&
        ride.paymentTypes.includes(SearchDtoPaymentTypesEnum.Cash) &&
        settingMaxPercent &&
        settingHasFreeSeats;

    const hasOnlyCardPayment =
        onlinePaymentBadgeEnabled &&
        ride.paymentTypes.includes(SearchDtoPaymentTypesEnum.Card) &&
        !hasOnlyCashPayment &&
        settingMaxPercent &&
        settingHasFreeSeats;

    const hasCashAndCardPayment =
        onlinePaymentBadgeEnabled &&
        ride.paymentTypes.includes(SearchDtoPaymentTypesEnum.Card) &&
        ride.paymentTypes.includes(SearchDtoPaymentTypesEnum.Cash) &&
        settingMaxPercent &&
        settingHasFreeSeats;

    const displayBadgeType = hasCashAndCardPayment
        ? 'All'
        : hasOnlyCardPayment
        ? 'Card'
        : 'Cash';

    return {
        isSurged,
        displaySurgedBadge,
        displayOnlinePaymentBadge,
        displayBadgeType,
        onlinePaymentBadgeEnabled,
    };
}
