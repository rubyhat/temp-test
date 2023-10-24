import { SagaIterator } from 'redux-saga';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import * as Sentry from '@sentry/browser';

import apiClient from 'lib/apiClient';
import {
    BUS_LOCATION_FETCHING,
    BusLocationFetchingAction,
} from 'store/bus-location/types';
import {
    busLocationError,
    busLocationSuccess,
} from 'store/bus-location/actions';

function* fetchBusLocation(action: BusLocationFetchingAction): SagaIterator {
    try {
        const { orderId } = action.payload;
        const { data } = yield call(apiClient.getBusLocation, orderId);

        yield put(busLocationSuccess(data));
    } catch (err) {
        yield put(busLocationError(err));
        Sentry.captureException(err);
    }
}

export function* watchBusLocation(): SagaIterator {
    yield all([takeLatest(BUS_LOCATION_FETCHING, fetchBusLocation)]);
}
