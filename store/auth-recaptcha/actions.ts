import {
    RECAPTCHA_KEYS_ERROR,
    RECAPTCHA_KEYS_FETCHING,
    RECAPTCHA_KEYS_SUCCESS,
    RecaptchaActionTypes,
} from 'store/auth-recaptcha/types';
import { RecaptchaResponseDto } from 'swagger/client';

export const recaptchaKeysFetch = (): RecaptchaActionTypes => ({
    type: RECAPTCHA_KEYS_FETCHING,
});

export const recaptchaKeysSuccess = (
    payload: RecaptchaResponseDto
): RecaptchaActionTypes => ({
    type: RECAPTCHA_KEYS_SUCCESS,
    payload,
});

export const recaptchaKeysError = (err: Error): RecaptchaActionTypes => ({
    type: RECAPTCHA_KEYS_ERROR,
    payload: err,
});
