import { SagaIterator } from 'redux-saga';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import * as Sentry from '@sentry/browser';

import apiClient from 'lib/apiClient';
import { getInitialLanguage } from 'utils/getInitialLanguage';
import {
    SEO_FEATURED_FETCHING,
    SeoFeaturedFetchingAction,
} from 'store/seo-featured/types';
import {
    seoFeaturedError,
    seoFeaturedSuccess,
} from 'store/seo-featured/actions';
import { RootState } from 'store';
import { isServer } from 'utils/platform';
import { getRealIP } from 'utils/getRealIP';

function* fetchSeoFeatured(action: SeoFeaturedFetchingAction): SagaIterator {
    const { brand }: RootState = yield select();
    const locale = getInitialLanguage();

    const { req } = action.payload;
    const xForwardedFor = isServer && req ? getRealIP(req) : undefined;

    try {
        const { data } = yield call(
            apiClient.getSeoFeatured,
            locale || 'ru',
            brand.brandName,
            xForwardedFor
        );
        yield put(seoFeaturedSuccess(data));
    } catch (err) {
        yield put(seoFeaturedError(err));
        Sentry.captureException(err);
    }
}

export function* watchSeoFeatured(): SagaIterator {
    yield all([takeLatest(SEO_FEATURED_FETCHING, fetchSeoFeatured)]);
}
