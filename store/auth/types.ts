import { AxiosError, AxiosResponse } from 'axios';
import { SignupResponseDto } from '../../swagger/client';

export type AuthState = {
    status: AuthStatuses | null;
    error: Error | null;
    phoneNumber: string;
    smsCode: string;
    remember: boolean;
    nextMessage: number;
    codeLength: number;
    isNewUser: boolean;
};

export const LOGIN = 'LOGIN';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const REGISTER_NEW_USER = 'REGISTER_NEW_USER';
export const LOGIN_ERROR = 'LOGIN_ERROR';
export const SEND_CODE = 'SEND_CODE';
export const SEND_CODE_SUCCESS = 'SEND_CODE_SUCCESS';
export const SEND_CODE_ERROR = 'SEND_CODE_ERROR';
export const SEND_CODE_TOO_MANY_REQUESTS = 'SEND_CODE_TOO_MANY_REQUESTS';
export const UPDATE_AUTH_DATA = 'UPDATE_AUTH_DATA';
export const AUTH_RESET = 'AUTH_RESET';

export type AuthStatuses =
    | typeof LOGIN
    | typeof LOGIN_SUCCESS
    | typeof REGISTER_NEW_USER
    | typeof LOGIN_ERROR
    | typeof SEND_CODE
    | typeof SEND_CODE_SUCCESS
    | typeof SEND_CODE_ERROR
    | typeof SEND_CODE_TOO_MANY_REQUESTS
    | typeof AUTH_RESET;

type LoginAction = {
    type: typeof LOGIN;
};

type LoginSuccessAction = {
    type: typeof LOGIN_SUCCESS;
    payload: boolean;
};

type RegisterNewUserAction = {
    type: typeof REGISTER_NEW_USER;
};

type LoginErrorAction = {
    type: typeof LOGIN_ERROR;
    payload: Error;
};

export type SendCodeAction = {
    type: typeof SEND_CODE;
    payload: {
        captchaToken: string;
        useFirebase: boolean;
    };
};

type SendCodeSuccessAction = {
    type: typeof SEND_CODE_SUCCESS;
    payload: AxiosResponse<SignupResponseDto>;
};

type SendCodeErrorAction = {
    type: typeof SEND_CODE_ERROR;
    payload: AxiosError<SignupResponseDto>;
};

type UpdateAuthDataAction = {
    type: typeof UPDATE_AUTH_DATA;
    payload: Partial<Pick<AuthState, 'phoneNumber' | 'smsCode' | 'remember'>>;
};

type AuthResetAction = {
    type: typeof AUTH_RESET;
};

export type AuthActionTypes =
    | LoginAction
    | LoginSuccessAction
    | RegisterNewUserAction
    | LoginErrorAction
    | SendCodeAction
    | SendCodeSuccessAction
    | SendCodeErrorAction
    | UpdateAuthDataAction
    | AuthResetAction;
