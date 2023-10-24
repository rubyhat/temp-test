import parseISO from 'date-fns/parseISO';
import { useSelector } from 'react-redux';

import {
    formatDaysHoursMinutes,
    getTimeDifferenceWithTimezone,
} from 'utils/time';
import { LastSearchState } from 'store/last-search/types';
import { RootState } from 'store';
import { SearchDto } from 'swagger/client';
import { getFirstImportantStop, getLastImportantStop } from 'utils/booking';
import { getFirstStop, getLastStop } from 'utils/stops';
import { useFilters } from 'hooks/useFilters';
import { useTranslation } from 'i18n';

export function useRideWithFilters(ride: SearchDto) {
    const { t } = useTranslation();
    const {
        getDepartureDate,
        getArrivalDate,
        pickupStop: pickupStopFromFilters,
        dischargeStop: dischargeStopFromFilters,
    } = useFilters();

    const departureDate = getDepartureDate(ride);
    const arrivalDate = getArrivalDate(ride);

    // Отобразить дату посадки/высадки если это разные дни
    const departureDateObj = parseISO(departureDate);
    const showDepartureDate =
        new Date().getDate() !== departureDateObj.getDate();
    const arrivalDateObj = parseISO(arrivalDate);
    const showArrivalDate =
        arrivalDateObj.getDate() !== departureDateObj.getDate();

    const pickupStop =
        pickupStopFromFilters ||
        getFirstImportantStop(ride.pickupStops || []) ||
        getFirstStop(ride.pickupStops || []);
    const dischargeStop =
        dischargeStopFromFilters ||
        getLastImportantStop(ride.dischargeStops || []) ||
        getLastStop(ride.dischargeStops || []);

    const { lastSearch } = useSelector<RootState, LastSearchState>(
        rootState => rootState.lastSearch
    );

    const duration = getTimeDifferenceWithTimezone(
        departureDate,
        arrivalDate,
        ride.from.timezone as string,
        ride.to.timezone as string
    );
    const displayDuration = formatDaysHoursMinutes(duration, t);

    return {
        departureDate,
        arrivalDate,
        pickupStop,
        dischargeStop,
        pickupStopName: pickupStop ? pickupStop.desc : '',
        dischargeStopName: dischargeStop ? dischargeStop.desc : '',
        passengers: lastSearch ? lastSearch.passengers : 1,
        duration,
        displayDuration,

        departureDateObj,
        showDepartureDate,

        arrivalDateObj,
        showArrivalDate,
    };
}
