import { SagaIterator } from 'redux-saga';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import * as Sentry from '@sentry/browser';

import apiClient from 'lib/apiClient';
import { AxiosResponse } from 'axios';
import { RecaptchaResponseDto } from 'swagger/client';
import {
    recaptchaKeysError,
    recaptchaKeysSuccess,
} from 'store/auth-recaptcha/actions';
import { RECAPTCHA_KEYS_FETCHING } from 'store/auth-recaptcha/types';

function* recaptchaFetch(): SagaIterator {
    try {
        const { data }: AxiosResponse<RecaptchaResponseDto> = yield call(
            apiClient.recaptchaKeys
        );
        yield put(recaptchaKeysSuccess(data));
    } catch (err) {
        yield put(recaptchaKeysError(err));
        Sentry.captureException(err);
    }
}

export function* watchRecaptcha(): SagaIterator {
    yield all([takeLatest(RECAPTCHA_KEYS_FETCHING, recaptchaFetch)]);
}
