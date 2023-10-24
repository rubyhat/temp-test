import { useSelector } from 'react-redux';

import { CountryState } from 'store/country/types';
import { RootState } from 'store';
import { useSAAS } from 'hooks/useSAAS';
import { SearchRidesState } from 'store/search-rides/types';
import { SaasRouteDirectionsMetaDto, SearchDto } from 'swagger/client';

export function useCallCenterOrCarrierPhones(
    carrierPhones: string[]
): string[] {
    const { meta } = useSAAS();
    const { country } = useSelector<RootState, CountryState>(
        rootState => rootState.country
    );

    // Пробуем найти телефон коллцентра из "SaaS админки -> Направления"
    const { rides } = useSelector<RootState, SearchRidesState>(
        rootState => rootState.searchRides
    );
    const ride: SearchDto | null = rides[0]; // берем один рейс (неважно какой)
    const directionMeta = getRouteDirectionsMeta(
        ride,
        meta.routeDirectionsMeta
    );
    if (directionMeta && directionMeta.callCenterPhoneNumber) {
        return [directionMeta.callCenterPhoneNumber];
    }

    if (country === 'RU') {
        return meta.callCenterPhoneNumberRU
            ? [meta.callCenterPhoneNumberRU]
            : carrierPhones;
    }

    return carrierPhones;
}

function getRouteDirectionsMeta(
    ride: SearchDto | undefined,
    routeDirectionsMeta?: SaasRouteDirectionsMetaDto[] | null
): SaasRouteDirectionsMetaDto | null {
    if (!ride) return null;
    if (!routeDirectionsMeta) return null;

    const routeDirection =
        routeDirectionsMeta.find(direction => {
            const matchDirection =
                direction.carrierId && ride.carrierID
                    ? direction.carrierId === ride.carrierID
                    : true;
            const matchDepartureCity = direction.departureCity
                ? direction.departureCity.id === ride.from.id
                : true;
            const matchArrivalCity = direction.arrivalCity
                ? direction.arrivalCity.id === ride.to.id
                : true;

            return matchDirection && matchDepartureCity && matchArrivalCity;
        }) || null;

    return routeDirection;
}
