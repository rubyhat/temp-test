import { RecaptchaResponseDto } from 'swagger/client';

export type RecaptchaState = {
    status: RecaptchaKeysStatuses | null;
    error: Error | null;
    recaptchaKeys: RecaptchaResponseDto | null;
};

export const RECAPTCHA_KEYS_FETCHING = 'RECAPTCHA_KEYS_FETCHING';
export const RECAPTCHA_KEYS_SUCCESS = 'RECAPTCHA_KEYS_SUCCESS';
export const RECAPTCHA_KEYS_ERROR = 'RECAPTCHA_KEYS_ERROR';

export type RecaptchaKeysStatuses =
    | typeof RECAPTCHA_KEYS_FETCHING
    | typeof RECAPTCHA_KEYS_SUCCESS
    | typeof RECAPTCHA_KEYS_ERROR;

type RecaptchaKeysFetchingAction = {
    type: typeof RECAPTCHA_KEYS_FETCHING;
};

type RecaptchaKeysSuccessAction = {
    type: typeof RECAPTCHA_KEYS_SUCCESS;
    payload: RecaptchaResponseDto;
};

type RecaptchaKeysErrorAction = {
    type: typeof RECAPTCHA_KEYS_ERROR;
    payload: Error;
};

export type RecaptchaActionTypes =
    | RecaptchaKeysFetchingAction
    | RecaptchaKeysSuccessAction
    | RecaptchaKeysErrorAction;
