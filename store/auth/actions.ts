import { AxiosError, AxiosResponse } from 'axios';

import {
    AUTH_RESET,
    AuthActionTypes,
    AuthState,
    LOGIN,
    LOGIN_ERROR,
    LOGIN_SUCCESS,
    SEND_CODE,
    SEND_CODE_ERROR,
    SEND_CODE_SUCCESS,
    UPDATE_AUTH_DATA,
    REGISTER_NEW_USER,
} from './types';
import { SignupResponseDto } from 'swagger/client';

export const sendCode = (
    captchaToken: string,
    useFirebase: boolean
): AuthActionTypes => ({
    type: SEND_CODE,
    payload: {
        captchaToken,
        useFirebase,
    },
});

export const sendCodeSuccess = (
    payload: AxiosResponse<SignupResponseDto>
): AuthActionTypes => ({
    type: SEND_CODE_SUCCESS,
    payload,
});

export const sendCodeError = (
    err: AxiosError<SignupResponseDto>
): AuthActionTypes => ({
    type: SEND_CODE_ERROR,
    payload: err,
});

export const login = (): AuthActionTypes => ({
    type: LOGIN,
});

export const loginSuccess = (payload: boolean): AuthActionTypes => ({
    type: LOGIN_SUCCESS,
    payload,
});

export const registerNewUser = (): AuthActionTypes => ({
    type: REGISTER_NEW_USER,
});

export const loginError = (err: Error): AuthActionTypes => ({
    type: LOGIN_ERROR,
    payload: err,
});

export const updateAuthData = (
    payload: Partial<Pick<AuthState, 'phoneNumber' | 'smsCode' | 'remember'>>
): AuthActionTypes => ({
    type: UPDATE_AUTH_DATA,
    payload,
});

export const authReset = (): AuthActionTypes => ({
    type: AUTH_RESET,
});
