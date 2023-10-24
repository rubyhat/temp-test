import { SagaIterator } from 'redux-saga';
import { select, all, call, put, delay, takeLatest } from 'redux-saga/effects';
import * as Sentry from '@sentry/browser';
import { AxiosResponse } from 'axios';

import { RootState } from 'store';
import {
    rideError,
    rideFetching,
    rideUpdating,
    ridePolling,
    rideSuccess,
    rideBookingSeatingSuccess,
    rideBookingSeatingPolling,
    rideBookingSeating,
} from 'store/ride/actions';

import { bookingUpdateState } from 'store/booking/actions';

import {
    RIDE_FETCHING,
    RIDE_UPDATING,
    RIDE_POLLING,
    RIDE_BOOKING_SEATING,
    RIDE_BOOKING_SEATING_POLLING,
} from 'store/ride/types';
import apiClient from 'lib/apiClient';
import { getPollingDelay } from 'utils/polling';
import {
    BookParamsDto,
    RideDto,
    SeatingBookReqDto,
    SeatingBookResDto,
} from 'swagger/client';

export function* updateRide(): SagaIterator {
    try {
        const state: RootState = ((yield select()) as unknown) as RootState;
        const { rideId, fromId, toId, date, selectedSeats } = state.booking;

        const { country } = state.country;

        const [rideInfo, bookParams]: [
            AxiosResponse<RideDto>,
            AxiosResponse<BookParamsDto>
        ] = yield all([
            call(apiClient.getRide, rideId),
            call(apiClient.getBookParams, rideId, fromId, toId, date, country),
        ]);

        if (rideInfo.status === 202 || bookParams.status === 202) {
            const { pollingCount } = state.ride;
            const pollingDelay = getPollingDelay(pollingCount);

            yield delay(pollingDelay);
            yield put(rideUpdating());
        } else if (rideInfo.status === 200 && bookParams.status === 200) {
            const { seatingScheme } = rideInfo.data;

            const selectedSeatsNew = selectedSeats.filter(seat => {
                if (Array.isArray(seatingScheme)) {
                    return seatingScheme.find(({ groups }) => {
                        if (Array.isArray(groups)) {
                            return groups.find(({ cells }) => {
                                if (Array.isArray(cells)) {
                                    return cells.find(
                                        ({ number, status }) =>
                                            number &&
                                            status &&
                                            number === seat &&
                                            status === 'free'
                                    );
                                } else {
                                    return false;
                                }
                            });
                        } else {
                            return false;
                        }
                    });
                } else {
                    return false;
                }
            });
            yield put(
                bookingUpdateState({
                    seatingScheme,
                    selectedSeats: selectedSeatsNew,
                })
            );
            yield put(rideSuccess(rideInfo.data, bookParams.data));
        }
    } catch (err) {
        yield put(rideError(err));
        Sentry.captureException(err);
    }
}

export function* pollingRide(): SagaIterator {
    const state: RootState = ((yield select()) as unknown) as RootState;
    const { pollingCount } = state.ride;
    const pollingDelay = getPollingDelay(pollingCount);

    yield delay(pollingDelay);
    yield put(rideUpdating());
}

export function* rideBookingPolling(): SagaIterator {
    const state: RootState = ((yield select()) as unknown) as RootState;
    const {
        bookingPollingCount,
        bookingSeatNumber,
        bookingAction,
    } = state.ride;

    if (bookingSeatNumber === null || bookingAction === null) {
        yield put(rideBookingSeatingSuccess());
        return;
    }
    const pollingDelay = getPollingDelay(bookingPollingCount);

    yield delay(pollingDelay);
    yield put(
        rideBookingSeating({
            bookingSeatNumber,
            bookingAction,
        })
    );
}

export function* rideBookingSeatingFetch(): SagaIterator {
    try {
        const state: RootState = ((yield select()) as unknown) as RootState;
        const { bookingSeatNumber, bookingAction, rideInfo } = state.ride;
        const { selectedSeats } = state.booking;
        const { id: tripId = null } = rideInfo || { id: null };

        if (!tripId || bookingSeatNumber === null || bookingAction === null) {
            yield put(rideBookingSeatingSuccess());
            return;
        }

        const reqData: SeatingBookReqDto = {
            trip: tripId
                .split(':')
                .slice(1)
                .join(':'),
        };

        if (bookingAction === 'selected') {
            reqData.selected = bookingSeatNumber;
        } else if (bookingAction === 'unselected') {
            reqData.unselected = bookingSeatNumber;
        } else {
            yield put(rideBookingSeatingSuccess());
            return;
        }

        const { data }: AxiosResponse<SeatingBookResDto> = ((yield call(
            apiClient.bookingSeatingTemp,
            reqData
        )) as unknown) as AxiosResponse<SeatingBookResDto>;

        if (data.status === 'error') {
            yield put(bookingUpdateState({ seatingScheme: data.scheme }));

            if (selectedSeats.includes(bookingSeatNumber)) {
                const selectedSeatsNew = selectedSeats.filter(
                    seating => seating !== bookingSeatNumber
                );
                yield put(
                    bookingUpdateState({ selectedSeats: selectedSeatsNew })
                );
            }
            yield put(rideBookingSeatingSuccess());
        } else if (data.status === 'success') {
            yield put(rideBookingSeatingSuccess());
        }
    } catch (err) {
        yield put(rideBookingSeatingPolling());
        Sentry.captureException(err);
    }
}

export function* watchRide(): SagaIterator {
    yield all([
        // takeLatest(RIDE_FETCHING, fetchRide), // @todo refactor polling
        takeLatest(RIDE_UPDATING, updateRide),
        //takeLatest(RIDE_POLLING, pollingRide),
        //takeLatest(RIDE_BOOKING_SEATING, rideBookingSeatingFetch),
        //takeLatest(RIDE_BOOKING_SEATING_POLLING, rideBookingPolling),
    ]);
}
