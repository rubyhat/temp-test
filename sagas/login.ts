import { SagaIterator } from 'redux-saga';
import { takeLatest, call, put, select, all } from 'redux-saga/effects';
import * as Sentry from '@sentry/browser';
import { AxiosResponse } from 'axios';

import { RootState } from 'store';
import {
    loginError,
    loginSuccess,
    sendCodeError,
    sendCodeSuccess,
} from 'store/auth/actions';
import { LOGIN, SEND_CODE, SendCodeAction } from 'store/auth/types';
import apiClient from 'lib/apiClient';
import firebase from 'lib/firebase';
import { userFetchingError, userSuccess } from 'store/user/actions';
import {
    USER_FETCHING,
    USER_LOGOUT,
    USER_SUCCESS,
    UserSuccessAction,
} from 'store/user/types';
import { SignupResponseDto, UserDto } from 'swagger/client';
import { signSendCode } from 'utils/auth/signSendCode';
import { policyLoaded, policyLoadError } from 'store/saasPolicyInfo/actions';
import {
    SassUpdateVersionLoaded,
    SassUpdateVersionLoadedError,
} from 'store/saasUpdateVersion/actions';
import { iOS } from 'utils/platform';
import { detectCountryByPhone } from 'utils/country';
import { VERSION_LOAD } from 'store/saasUpdateVersion/types';

function* sendCodeAsync(action: SendCodeAction): SagaIterator {
    try {
        const state: RootState = ((yield select()) as unknown) as RootState;
        const { phoneNumber } = state.auth;
        const { captchaToken, useFirebase } = action.payload;

        const { ts, s } = signSendCode(phoneNumber);
        const response: AxiosResponse<SignupResponseDto> = yield call(
            apiClient.authCode,
            phoneNumber,
            captchaToken,
            useFirebase,
            ts,
            s
        );

        yield put(sendCodeSuccess(response));
    } catch (err) {
        yield put(sendCodeError(err));
        Sentry.captureException(err);
    }
}

function* loginAsync(): SagaIterator {
    try {
        const state: RootState = ((yield select()) as unknown) as RootState;
        const { phoneNumber, smsCode, remember } = state.auth;
        const { data } = yield call(apiClient.auth, smsCode, phoneNumber);
        const auth = firebase.auth();

        if (remember) {
            yield call([auth, 'setPersistence'], 'local');
        } else {
            yield call([auth, 'setPersistence'], 'session');
        }

        yield call([auth, 'signInWithCustomToken'], data.accessToken);
        yield put(loginSuccess(data.isNewUser));
        yield call(fetchUser);
    } catch (err) {
        yield put(loginError(err));
        Sentry.captureException(err);
    }
}

function* logoutAsync(): SagaIterator {
    try {
        const auth = firebase.auth();
        yield call([auth, 'signOut']);

        if (process.env.CORDOVA) {
            localStorage.removeItem('user');
        }
    } catch (err) {
        Sentry.captureException(err);
    }
}

function* getSaasPolicyInfo(): SagaIterator {
    const state: RootState = ((yield select()) as unknown) as RootState;
    const countryByPhone = detectCountryByPhone(state.user.phoneNumber);

    try {
        const { data } = yield call(
            apiClient.getSaasPolicyInfo,
            state.brand.partner ? state.brand.partner.partner : 'atlas',
            countryByPhone || state.country.country
        );
        yield put(policyLoaded(data));
    } catch (err) {
        yield put(policyLoadError());
    }
}

function* fetchUser(): SagaIterator {
    try {
        const { data } = yield call(apiClient.getUser);
        const {
            phoneNumber,
            email = '',
            role,
            isPartner,
            isAdmin,
            ordersCount,
            lastPickupDate,
            hashedPhone,
            policyVersion,
        }: Omit<UserDto, 'phoneNumber'> & { phoneNumber: string } = data;

        yield put(
            userSuccess({
                phoneNumber,
                email,
                employee: role ? role.employee : false,
                role: role ? role.role : 'user',
                isPartner,
                isAdmin,
                ordersCount,
                lastPickupDate,
                hashedPhone,
                policyVersion,
            })
        );
    } catch (err) {
        yield put(userFetchingError());

        Sentry.captureException(err);
    }
}

function* getSaasUpdateVersion(): SagaIterator {
    const state: RootState = ((yield select()) as unknown) as RootState;

    try {
        const { data } = yield call(
            apiClient.getSaasUpdateVersion,
            state.brand.partner ? state.brand.partner.partner : 'atlas',
            iOS() ? 'ios' : 'android',
            'forced'
        );
        yield put(SassUpdateVersionLoaded({ forced: data }));
    } catch (err) {
        yield put(SassUpdateVersionLoadedError());
    }

    try {
        const { data } = yield call(
            apiClient.getSaasUpdateVersion,
            state.brand.partner ? state.brand.partner.partner : 'atlas',
            iOS() ? 'ios' : 'android',
            'recommended'
        );
        yield put(SassUpdateVersionLoaded({ recommended: data }));
    } catch (err) {
        yield put(SassUpdateVersionLoadedError());
    }
}

function* saveUserToLocalStorage(action: UserSuccessAction): SagaIterator {
    if (process.env.CORDOVA) {
        const user = action.payload;
        localStorage.setItem('user', JSON.stringify(user));
    }
}

export function* watchLogin(): SagaIterator {
    yield all([
        takeLatest(SEND_CODE, sendCodeAsync),
        takeLatest(LOGIN, loginAsync),
        takeLatest(USER_LOGOUT, logoutAsync),
        takeLatest(USER_SUCCESS, saveUserToLocalStorage),
        takeLatest(USER_FETCHING, fetchUser),
        takeLatest(USER_SUCCESS, getSaasPolicyInfo),
        takeLatest(VERSION_LOAD, getSaasUpdateVersion),
    ]);
}
