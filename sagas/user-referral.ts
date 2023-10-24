import { AxiosResponse } from 'axios';
import { SagaIterator } from 'redux-saga';
import { takeLatest, call, put, all } from 'redux-saga/effects';
import * as Sentry from '@sentry/browser';

import apiClient from 'lib/apiClient';
import {
    USER_REFERRAL_FETCHING,
    userReferralError,
    userReferralSuccess,
} from 'store/user-referral';
import { UserReferralPromocodeDto } from 'swagger/client';

function* fetchUserReferral(): SagaIterator {
    try {
        const { data }: AxiosResponse<UserReferralPromocodeDto> = ((yield call(
            apiClient.getUserReferralPromocode
        )) as unknown) as AxiosResponse<UserReferralPromocodeDto>;
        yield put(userReferralSuccess(data));
    } catch (err) {
        yield put(userReferralError(err as Error));
        Sentry.captureException(err);
    }
}

export function* watchUserReferral(): SagaIterator {
    yield all([takeLatest(USER_REFERRAL_FETCHING, fetchUserReferral)]);
}
