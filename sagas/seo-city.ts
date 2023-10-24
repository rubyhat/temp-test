import { SagaIterator } from 'redux-saga';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import * as Sentry from '@sentry/browser';
import { AxiosResponse } from 'axios';

import apiClient from 'lib/apiClient';
import { RootState } from 'store';
import { SEO_CITY_FETCHING, SeoCityFetchingAction } from 'store/seo-city/types';
import { SeoDto } from 'swagger/client';
import { getInitialLanguage } from 'utils/getInitialLanguage';
import { seoCityError, seoCitySuccess } from 'store/seo-city/actions';
import { format } from 'utils/date';
import { initSearchForm } from 'store/search-form/actions';
import { isServer } from 'utils/platform';
import { getRealIP } from 'utils/getRealIP';

function* fetchSeoCity(action: SeoCityFetchingAction): SagaIterator {
    const { brand }: RootState = yield select();
    const locale = getInitialLanguage();

    const { city: cityName, req } = action.payload;
    const xForwardedFor = isServer && req ? getRealIP(req) : undefined;

    try {
        const { data: destinations }: AxiosResponse<SeoDto[]> = yield call(
            apiClient.getSeoList,
            locale || 'ru',
            brand.brandName,
            undefined,
            cityName,
            xForwardedFor
        );

        const cityDestinations = destinations.filter(
            destination => destination.from.name === cityName
        );
        yield put(seoCitySuccess(cityDestinations));

        // Заполнит саджест "Откуда"
        const city = cityDestinations.find(
            destination => destination.from.name === cityName
        );
        if (city) {
            yield put(
                initSearchForm({
                    fromValue: {
                        id: `c${city.from.id}`,
                        name: city.from.name,
                    },
                    date: format(new Date(), 'yyyy-MM-dd'),
                    passengers: '1',
                    fromInputValue: city.from.name,
                })
            );
        }
    } catch (err) {
        yield put(seoCityError(err));
        Sentry.captureException(err);
    }
}

export function* watchSeoCity(): SagaIterator {
    yield all([takeLatest(SEO_CITY_FETCHING, fetchSeoCity)]);
}
