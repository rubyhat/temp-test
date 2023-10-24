import flatMap from 'lodash/flatMap';
import parseISO from 'date-fns/parseISO';
import uniqBy from 'lodash/uniqBy';
import { useDispatch, useSelector } from 'react-redux';

import { FiltersState } from 'store/filters/types';
import { RootState } from 'store';
import { SearchDto, StopsDto } from 'swagger/client';
import { SearchRidesState } from 'store/search-rides/types';
import { getFirstStop, getLastStop } from 'utils/stops';
import { useDialogHash } from 'hooks/useDialogHash';
import { filterClickAnalytics } from 'store/affiliates/actions';

export function useFilters() {
    const dispatch = useDispatch();
    const { rides } = useSelector<RootState, SearchRidesState>(
        rootState => rootState.searchRides
    );
    const filters = useSelector<RootState, FiltersState>(
        rootState => rootState.filters
    );
    const filteredRides = sortRides(filterRides(rides, filters), filters);
    const filtersCount =
        +!!filters.pickupValue +
        +!!filters.dropoffValue +
        +!!filters.departureTime +
        +!!filters.sortBy;

    const allPickupStops = uniqBy(
        flatMap(rides, ride => ride.pickupStops || []),
        stop => stop.id
    );
    const allDischargeStops = uniqBy(
        flatMap(rides, ride => ride.dischargeStops || []),
        stop => stop.id
    );

    const pickupStop = allPickupStops.find(
        stop => stop.id === filters.pickupValue
    );
    const dischargeStop = allDischargeStops.find(
        stop => stop.id === filters.dropoffValue
    );

    const getDepartureDate = (ride: SearchDto) =>
        getStopDate(
            'departure',
            ride.pickupStops || [],
            ride.departure,
            filters.pickupValue
        );
    const getArrivalDate = (ride: SearchDto) =>
        getStopDate(
            'arrival',
            ride.dischargeStops || [],
            ride.arrival as string,
            filters.dropoffValue
        );

    // Dialog
    const [filtersOpen, setFiltersOpen] = useDialogHash('#filters');
    const handleFiltersOpen = () => {
        document.body.style.overflow = 'hidden';
        setFiltersOpen(true);
        dispatch(filterClickAnalytics());
    };
    const handleFiltersClose = () => {
        document.body.style.overflow = 'auto';
        setFiltersOpen(false);
    };
    const handleFiltersSubmit = () => {
        document.body.style.overflow = 'auto';
        setFiltersOpen(false);
    };
    return {
        filters,
        rides: filteredRides,
        count: filtersCount,
        allPickupStops,
        allDischargeStops,
        pickupStop,
        dischargeStop,

        filtersOpen,
        handleFiltersOpen,
        handleFiltersClose,
        handleFiltersSubmit,

        getDepartureDate,
        getArrivalDate,
    };
}

function filterRides(rides: SearchDto[], filters: FiltersState): SearchDto[] {
    const { pickupValue, dropoffValue, departureTime } = filters;

    return rides
        .filter(ride => {
            if (!filters.pickupValue) return true;

            return (ride.pickupStops || []).some(
                stop => stop.id === pickupValue
            );
        })
        .filter(ride => {
            if (!filters.dropoffValue) return true;

            return (ride.dischargeStops || []).some(
                stop => stop.id === dropoffValue
            );
        })
        .filter(ride => {
            if (!departureTime) return true;

            const date = parseISO(ride.departure);
            const hours = date.getHours();

            // night: 00:00 => 05:59
            // morning: 06:00 => 11:59
            // afternoon: 12:00 => 17:59
            // evening: 18:00 => 23:59
            switch (departureTime) {
                case 'night':
                    return hours >= 0 && hours < 6;
                case 'morning':
                    return hours >= 6 && hours < 12;
                case 'afternoon':
                    return hours >= 12 && hours < 18;
                case 'evening':
                    return hours >= 18 && hours <= 23;
                default:
                    return true;
            }
        });
}

/**
 * Сортирует рейсы по времени отправления или по цене
 * @param rides
 * @param filters
 */
function sortRides(rides: SearchDto[], filters: FiltersState): SearchDto[] {
    const { sortBy } = filters;
    if (!sortBy) return rides;

    const clonedRides = [...rides]; // чтобы не мутировать оригиналный массив

    switch (sortBy) {
        case 'price': {
            return clonedRides.sort(sortByPriceCompareFn);
        }
        case 'time': {
            // бекенд возвращает по умолчанию отсортированные рейсы
            return rides;
        }
    }
}

function sortByPriceCompareFn(a: SearchDto, b: SearchDto) {
    return a.price - b.price;
}

/**
 *
 * @param type Время отправления или время назначения
 * @param stops Остановки рейса (`ride.pickupStops` или `ride.dischargeStops`)
 * @param defaultDate ISO
 * @param filtersStopId ID остановки из фильтров
 */
function getStopDate(
    type: 'departure' | 'arrival',
    stops: StopsDto[],
    defaultDate: string,
    filtersStopId: string | null
) {
    // `datetime` остановки из фильтров отличается от
    // `datetime` остановки из рейса (ride.pickupStops / ride.dischargeStops),
    // поэтому ищем эту же остановку по id,
    let stop: StopsDto | null | undefined = stops.find(el => {
        // Сначала по фильтру ищем (если что-то выбрано)
        if (filtersStopId) {
            return el.id === filtersStopId;
        }

        // либо первая важная остановка
        return el.important;
    });

    // Если по какой-то квантовой причине отсутствует
    // важная остановка, берем первую из списка,
    // (или последнюю если это место посадки)
    if (!stop) {
        if (type === 'departure') {
            stop = getFirstStop(stops);
        } else {
            // type === 'arrival'
            stop = getLastStop(stops);
        }
    }

    // вытаскиваем время остановки, либо время из (ride.departure / ride.arrival)
    return (stop && stop.datetime) || defaultDate;
}
