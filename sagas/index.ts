import { SagaIterator } from 'redux-saga';
import {
    take,
    takeLatest,
    call,
    put,
    select,
    all,
    delay,
    fork,
    cancel,
    cancelled,
} from 'redux-saga/effects';
import format from 'date-fns/format';
import * as Sentry from '@sentry/browser';
import { AxiosResponse } from 'axios';

import apiClient from 'lib/apiClient';
import {
    errorRides,
    pollingRides,
    continuePollingOnClient,
    successRides,
    fetchingRides,
    debugNearDayWithRides,
} from 'store/search-rides/actions';
import { saveLastSearch } from 'store/last-search/actions';
import {
    ERROR_RIDES,
    FETCHING_RIDES,
    FetchingRidesAction,
    POLLING_RIDES,
    SUCCESS_RIDES,
} from 'store/search-rides/types';
import { RootState } from 'store';
import { watchLogin } from './login';
import { watchRecaptcha } from 'sagas/recaptcha';
import { watchRide } from './ride';
import { watchOrder } from './order';
import { watchOrders } from './orders';
import { watchMiles } from './miles';
import { watchSuggestions } from './suggestions';
import { watchTicket } from './ticket';
import { watchCards } from './credit-cards';
import { watchDocuments } from './documents';
import { watchLoyalty } from './loyalty';
import { watchBusLocation } from './bus-location';
import { watchPersistentSearch } from './persistent-search';
import { watchBooking } from './booking';
import { watchPayment } from './payment';
import { watchSearchForm } from './search-form';
import { watchSentry } from './sentry';
import { watchKarma } from './karma';
import { watchFilters } from './filters';
import { watchPartners } from './partners';
import { getPollingDelay } from 'utils/polling';
import { isClient, isServer } from 'utils/platform';
import { watchAnalytics } from './analytics';
import { watchOneSignal } from './onesignal';
import { watchSeoFeatured } from 'sagas/seo-featured';
import { watchSeoCity } from 'sagas/seo-city';
import { watchPWAInstall } from 'sagas/pwa-install';
import { watchReviewOrders } from 'sagas/reviews/review-orders';
import { watchSubmitReview } from 'sagas/reviews/submit-review';
import { watchSkipReview } from 'sagas/reviews/skip-review';
import { watchGeolocation } from 'sagas/geolocation';
import { watchUserReferral } from 'sagas/user-referral';
import { watchUserReferralDialog } from 'sagas/user-referral-dialog';
import { changeSearchForm } from 'store/search-form/actions';
import { SearchResultDto } from 'swagger/client';
import { checkIsInfoPortal } from 'utils/infoportal';

function* fetchRidesAsync(action: FetchingRidesAction): SagaIterator {
    try {
        const state: RootState = ((yield select()) as unknown) as RootState;
        const {
            fromValue,
            toValue,
            time,
            date = format(new Date(), 'yyyy-MM-dd'),
            passengers,
        } = state.searchForm;
        const { brandName } = state.brand;

        if (!fromValue || !toValue) {
            yield put(successRides({ rides: [], calendar: [] }));
            return;
        }

        const isInfoPortal = checkIsInfoPortal(fromValue, toValue);
        const { data, status }: AxiosResponse<SearchResultDto> = yield call(
            apiClient.searchGet,
            fromValue.id,
            toValue.id,
            date,
            passengers,
            isInfoPortal ? 'infoportal' : 'morda',
            '30',
            time,
            brandName
        );

        if (status === 202) {
            if (isServer) {
                yield put(continuePollingOnClient());
            } else {
                yield put(pollingRides());
            }
        } else if (status === 200) {
            yield put(
                saveLastSearch({
                    from: fromValue,
                    to: toValue,
                    date,
                    time,
                    passengers: +passengers,
                })
            );
            yield put(successRides(data));
        }

        /**
         * Найти ближайшую дату где есть рейсы и свободные места
         * @see https://tracker.yandex.ru/ATLASDEV-1071
         *
         * Если:
         *   - Это браузер (колбек в useEffect и так работает только в браузере)
         *   - Это SEO страница
         *   - Дата не указана в строке URL
         *   - Получили первый результат поиска (SUCCESS_RIDES)
         *   - Список рейсов пустой || Нет свободных мест
         *
         * Тогда: ищем в календаре цен ближайшую дату где `rideCount > 0`
         * и делаем повторный поиск с новой датой.
         */
        if (isServer) {
            // Если по какой-то причине не получили календарь цен
            // при статусе 202
            const { rides, calendar = [] } = data;

            const noFreeSeats = !rides.find(ride => ride.freeSeats > 0);
            const { withDateInQuery } = action.payload;
            const shouldSearchNearDate =
                !withDateInQuery && (rides.length === 0 || noFreeSeats);

            const dayWithRides = calendar.find(
                ({ rideCount }) => rideCount > 0
            );

            if (shouldSearchNearDate && dayWithRides) {
                yield put(
                    changeSearchForm({
                        date: dayWithRides.date,
                    })
                );

                // Меняем status на FETCHING_RIDES чтобы отобразить плейсхолдеры
                // по SSR (без этого будет мелькать "Рейсов не найдено").
                // Мы изменили дату поэтому нужно получить новый список рейсов.
                // Говорим фронту что надо полить всегда.
                //
                // Важно: `fetchingRides()` не перезапустит текущий таск.
                // После выхода из текущего таска, сага остановится.
                // Так и задумано. Нам нужно просто вернуть статус
                // FETCHING_RIDES.
                yield put(fetchingRides()); //
                yield put(continuePollingOnClient());
            }

            // Для дебага в Redux DevTools.
            yield put(
                debugNearDayWithRides({
                    request: {
                        fromValueId: fromValue.id,
                        toValueId: toValue.id,
                        date,
                        passengers,
                        brandName,
                    },
                    withDateInQuery,
                    ridesLength: rides.length,
                    noFreeSeats,
                    dayWithRides: dayWithRides || null,
                    shouldSearchNearDate,
                    initialStatus: status, // HTTP код первого поиска
                    calendar,
                })
            );
        }
    } catch (err) {
        yield put(errorRides(err));
        Sentry.captureException(err);
    }
}

function* pollingRidesAsync() {
    const state: RootState = ((yield select()) as unknown) as RootState;
    const {
        fromValue,
        toValue,
        date = format(new Date(), 'yyyy-MM-dd'),
        time,
        passengers,
    } = state.searchForm;
    const { brandName } = state.brand;

    if (!fromValue || !toValue) return;

    try {
        while (true) {
            const { pollingCount } = state.searchRides;
            const pollingDelay = getPollingDelay(pollingCount);

            const isInfoPortal = checkIsInfoPortal(fromValue, toValue);
            const { data, status } = yield call(
                apiClient.searchGet,
                fromValue.id,
                toValue.id,
                date,
                passengers,
                isInfoPortal ? 'infoportal' : 'morda',
                '30',
                time,
                brandName
            );

            if (status === 200) {
                yield put(
                    saveLastSearch({
                        from: fromValue,
                        to: toValue,
                        date,
                        time,
                        passengers: +passengers,
                    })
                );
                yield put(successRides(data));
            }

            yield delay(pollingDelay);
        }
    } catch (err) {
        yield put(errorRides(err));
        Sentry.captureException(err);
    } finally {
        if (yield cancelled()) {
        } // polling cancelled
    }
}

function* watchFetchingRides() {
    if (isClient) {
        while (yield take(POLLING_RIDES)) {
            const task = yield fork(pollingRidesAsync);
            console.log('POLLING_RIDES');

            yield take([SUCCESS_RIDES, ERROR_RIDES]);
            yield cancel(task);
        }
    } else {
        // skip polling on server
    }
}

export function* indexSaga() {
    yield all([
        takeLatest(FETCHING_RIDES, fetchRidesAsync),
        watchLogin(),
        watchRecaptcha(),
        watchFetchingRides(),
        watchRide(),
        watchOrder(),
        watchOrders(),
        watchMiles(),
        watchSuggestions(),
        watchTicket(),
        watchCards(),
        watchDocuments(),
        watchLoyalty(),
        watchBusLocation(),
        watchPersistentSearch(),
        watchBooking(),
        watchPayment(),
        watchSentry(),
        watchSearchForm(),
        watchKarma(),
        watchFilters(),
        watchPartners(),
        watchAnalytics(),
        watchOneSignal(),
        watchSeoFeatured(),
        watchSeoCity(),
        watchPWAInstall(),
        watchReviewOrders(),
        watchSubmitReview(),
        watchSkipReview(),
        watchGeolocation(),
        watchUserReferral(),
        watchUserReferralDialog(),
    ]);
}
