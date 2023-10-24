import { SagaIterator } from 'redux-saga';
import {
    all,
    call,
    put,
    takeLatest,
    delay,
    select,
    fork,
    take,
    cancel,
} from 'redux-saga/effects';
import Router from 'next/router';
import parseISO from 'date-fns/parseISO';
import * as Sentry from '@sentry/browser';

import {
    BOOKING_INIT,
    BOOKING_ORDER_SENDING,
    BookingInitPayload,
} from 'store/booking/types';
import { RootState } from 'store';
import apiClient from 'lib/apiClient';
import { rideError, rideFetching, rideSuccess } from 'store/ride/actions';
import {
    bookingDocumentsAutocompleted,
    bookingUpdateState,
    bookingEditPassenger,
    bookingOrderError,
    bookingOrderSuccess,
    bookingSetDefaultPickupDropoff,
} from 'store/booking/actions';
import { RIDE_SUCCESS } from 'store/ride/types';
import { getPollingDelay } from 'utils/polling';
import { documentsSuccess } from 'store/documents/actions';
import { isCordova } from 'utils/platform';
import { USER_SUCCESS } from 'store/user/types';
import { format } from 'utils/date';
import { hasDocumentEnoughData, passengersToDTO } from './util';
import { normaliseDocNumber } from 'utils/documents';
import { PersonalDataDto, StopsDto } from 'swagger/client';
import { getFirstImportantStop, getLastImportantStop } from 'utils/booking';
import { findStopInLS } from './util/stops-localstorage';
import { rideUpdating } from 'store/ride/actions';

function* bookingInit(action: any): SagaIterator {
    try {
        yield fork(fetchRide, action);
        yield take(RIDE_SUCCESS);
        yield call(setDefaultStops);

        const state: RootState = ((yield select()) as unknown) as RootState;
        const { user } = state;
        const isLoggedIn = !!user.phoneNumber;

        if (!isLoggedIn) {
            yield take(USER_SUCCESS);
        }

        yield call(fetchDocuments);
        yield call(autoDocuments);
    } catch (err) {
        Sentry.captureException(err);
    }
}

function* autoDocuments(): SagaIterator {
    const state: RootState = ((yield select()) as unknown) as RootState;
    const { documents } = state.documents;
    const { rideInfo, bookParams } = state.ride;
    const { passengers } = state.booking;
    const numberOfPassengers = Object.keys(passengers).length;
    const passengersCompleted = Object.values(passengers).some(
        passenger => passenger !== null
    );
    if (!rideInfo || !bookParams) return;

    if (!passengersCompleted) {
        const suitableDocuments = documents.filter(d =>
            hasDocumentEnoughData(d, rideInfo.bookFields)
        );
        for (let i = 0; i < numberOfPassengers; i++) {
            const document = suitableDocuments[i];
            if (document) {
                yield put(
                    bookingEditPassenger({
                        index: i,
                        passenger: {
                            id: document.id,
                            lastName: document.surname,
                            firstName: document.name,
                            middleName: document.patronymic || '',
                            birthDate: document.birthday
                                ? format(
                                      parseISO(document.birthday),
                                      'dd.MM.yyyy'
                                  )
                                : '',
                            genderCode: document.gender || '',

                            docTypeCode: document.docType || '',
                            docNumber: document.docNum || '',
                            citizenshipCode: document.citizen || '',

                            ticketTypeCode: bookParams.ticketTypes[0][0].code,
                        },
                    })
                );
            }
        }

        yield put(bookingDocumentsAutocompleted(true));
    }
}

/**
 * Автозаполнение инпутов с остановками по приоритету:
 *
 * 1. Остановки из фильтрах серпа (router.query)
 * 2. Автозаполнение сохраненных остановок (из LocalStorage)
 * 3. Автозаполнение остановок (из rideInfo.{pickupStops, dischargeStops})
 */
function* setDefaultStops(): SagaIterator {
    const { pickup: pickupQuery, discharge: dischargeQuery } = Router.query;
    const {
        pickupStops = [],
        dischargeStops = [],
    }: {
        pickupStops: StopsDto[];
        dischargeStops: StopsDto[];
    } = yield select(rootState => rootState.ride.rideInfo);
    let defaultPickupStop: StopsDto | undefined;
    let defaultDischargeStop: StopsDto | undefined;
    const pickupStopLS = findStopInLS(pickupStops);
    const dischargeStopLS = findStopInLS(dischargeStops);

    if (pickupQuery) {
        defaultPickupStop = pickupStops.find(stop => stop.id === pickupQuery);
    } else if (pickupStopLS) {
        defaultPickupStop = pickupStopLS;
    } else {
        defaultPickupStop = getFirstImportantStop(pickupStops);
    }

    if (dischargeQuery) {
        defaultDischargeStop = dischargeStops.find(
            stop => stop.id === dischargeQuery
        );
    } else if (dischargeStopLS) {
        defaultDischargeStop = dischargeStopLS;
    } else {
        defaultDischargeStop = getLastImportantStop(dischargeStops);
    }

    if (defaultPickupStop && defaultDischargeStop) {
        yield put(
            bookingSetDefaultPickupDropoff({
                defaultPickupStop,
                defaultDischargeStop,
            })
        );
    }
}

function* bookingOrder(): SagaIterator {
    try {
        const stateOrigin: RootState = ((yield select()) as unknown) as RootState;

        const { selectedSeats: selectedSeatsOrigin } = stateOrigin.booking;
        const selectedSeatsByUserCount = selectedSeatsOrigin.length;

        yield put(rideUpdating());
        yield take(RIDE_SUCCESS);

        const state: RootState = ((yield select()) as unknown) as RootState;
        const { user, booking, ride } = state;
        const { rideInfo } = ride;
        const { freeSeats } = rideInfo || { freeSeats: 0 };
        const isLoggedIn = !!user.phoneNumber;

        const {
            seatingRequired,
            selectedSeats,
            passengers,
            seatingScheme,
        } = booking;
        const numberOfPassengers = Object.keys(passengers || {}).length;

        let shouldCancel = false;

        if (numberOfPassengers > freeSeats) {
            shouldCancel = true;
        }

        if (seatingRequired) {
            if (
                Array.isArray(seatingScheme) &&
                seatingScheme.length &&
                selectedSeats.length !== numberOfPassengers
            ) {
                shouldCancel = true;
            }
        } else {
            if (Array.isArray(seatingScheme) && seatingScheme.length) {
                if (
                    selectedSeatsByUserCount > 0 &&
                    selectedSeats.length !== selectedSeatsByUserCount
                ) {
                    shouldCancel = true;
                }
            }
        }

        if (shouldCancel) {
            yield put(
                bookingUpdateState({
                    orderStatus: null,
                    isOpenSelectSeatModal: true,
                })
            );
            yield cancel();
            return;
        }

        if (!isLoggedIn) {
            yield take(USER_SUCCESS);
        }

        const orderId = yield call(sendOrder);
        yield call(goToPayment, orderId);
    } catch (err) {
        Sentry.captureException(err);
    }
}

function* fetchRide(action: { payload: BookingInitPayload }): SagaIterator {
    const { discharge, pickup } = action.payload;
    const state: RootState = ((yield select()) as unknown) as RootState;
    const { rideId, fromId, toId, date } = state.booking;
    const { country } = state.country;

    let pollingCount = 0;

    yield put(rideFetching());
    try {
        while (true) {
            const [rideInfo, bookParams] = yield all([
                call(apiClient.getRide, rideId),
                call(
                    apiClient.getBookParams,
                    rideId,
                    fromId,
                    toId,
                    date,
                    country
                ),
            ]);

            if (rideInfo.status === 200 && bookParams.status === 200) {
                yield put(rideSuccess(rideInfo.data, bookParams.data));
                yield cancel();
                break;
            }

            yield delay(getPollingDelay(pollingCount));
            pollingCount++;
        }
    } catch (err) {
        yield put(rideError(err));
        Sentry.captureException(err);
    }
}

function* fetchDocuments(): SagaIterator {
    try {
        const { data: documents } = yield call(apiClient.getDocuments);
        const normalizedDocuments = (documents as PersonalDataDto[]).map(
            document => {
                const docNum = normaliseDocNumber(document.docNum || '');

                return {
                    ...document,
                    docNum,
                };
            }
        );

        yield put(documentsSuccess(normalizedDocuments));
    } catch (err) {
        Sentry.captureException(err);
    }
}

function* sendOrder(): SagaIterator {
    const state: RootState = ((yield select()) as unknown) as RootState;
    const { booking, user, ride } = state;
    const { rideInfo } = ride;
    const { selectedSeats } = booking;

    try {
        const { data } = yield call(apiClient.sendOrder, {
            passengers: passengersToDTO(
                booking,
                user,
                rideInfo ? rideInfo.bookFields : []
            ),
            rideId: booking.rideId,
            savePersonalData: booking.savePersonalData,
            seatCodes: selectedSeats,
        });
        yield put(bookingOrderSuccess());

        return data.orderId;
    } catch (err) {
        yield put(bookingOrderError());
        Sentry.captureException(err);
    }
}

function* goToPayment(orderId: string): SagaIterator {
    if (isCordova) {
        Router.replace({
            pathname: '/payment',
            query: {
                id: orderId,
            },
        });
    } else {
        Router.replace('/payment/[id]', `/payment/${orderId}`);
    }
}

export function* watchBooking(): SagaIterator {
    yield all([
        takeLatest(BOOKING_INIT, bookingInit),
        takeLatest(BOOKING_ORDER_SENDING, bookingOrder),
    ]);
}
