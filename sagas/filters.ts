import flatMap from 'lodash/flatMap';
import uniqBy from 'lodash/uniqBy';
import { SagaIterator } from 'redux-saga';
import { all, put, takeLatest, select } from 'redux-saga/effects';

import { RootState } from 'store';
import { SUCCESS_RIDES } from 'store/search-rides/types';
import { resetFilters } from 'store/filters/actions';

function* updateFiltersStops(): SagaIterator {
    const state: RootState = ((yield select()) as unknown) as RootState;
    const { searchRides, filters } = state;
    const { rides } = searchRides;

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

    // фильтр установлен && остановка не найдена
    if (
        (filters.pickupValue && !pickupStop) ||
        (filters.dropoffValue && !dischargeStop)
    ) {
        yield put(resetFilters());
    }
}

export function* watchFilters(): SagaIterator {
    yield all([takeLatest(SUCCESS_RIDES, updateFiltersStops)]);
}
