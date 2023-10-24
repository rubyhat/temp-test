import {
    RECAPTCHA_KEYS_ERROR,
    RECAPTCHA_KEYS_FETCHING,
    RECAPTCHA_KEYS_SUCCESS,
    RecaptchaActionTypes,
    RecaptchaState,
} from './types';

const initialState: RecaptchaState = {
    status: null,
    error: null,
    recaptchaKeys: null,
};

export const authRecaptchaReducer = (
    state: RecaptchaState = initialState,
    action: RecaptchaActionTypes
): RecaptchaState => {
    switch (action.type) {
        case RECAPTCHA_KEYS_FETCHING: {
            return {
                ...state,
                status: RECAPTCHA_KEYS_FETCHING,
            };
        }
        case RECAPTCHA_KEYS_SUCCESS: {
            return {
                ...state,
                status: RECAPTCHA_KEYS_SUCCESS,
                recaptchaKeys: action.payload,
            };
        }
        case RECAPTCHA_KEYS_ERROR: {
            return {
                ...state,
                status: RECAPTCHA_KEYS_ERROR,
                error: action.payload,
            };
        }
        default: {
            return state;
        }
    }
};
