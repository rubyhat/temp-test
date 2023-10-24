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
    SEND_CODE_TOO_MANY_REQUESTS,
    UPDATE_AUTH_DATA,
    REGISTER_NEW_USER,
} from './types';

const initialState: AuthState = {
    status: null,
    error: null,
    phoneNumber: '',
    smsCode: '',
    remember: true,
    nextMessage: 0,
    codeLength: 4,
    isNewUser: false,
};

export const authReducer = (
    state: AuthState = initialState,
    action: AuthActionTypes
): AuthState => {
    switch (action.type) {
        case LOGIN: {
            return {
                ...state,
                status: LOGIN,
            };
        }
        case LOGIN_SUCCESS: {
            return {
                ...state,
                status: LOGIN_SUCCESS,
                isNewUser: action.payload,
            };
        }
        case REGISTER_NEW_USER: {
            return {
                ...state,
                status: REGISTER_NEW_USER,
            };
        }
        case LOGIN_ERROR: {
            return {
                ...state,
                status: LOGIN_ERROR,
                error: action.payload,
            };
        }
        case SEND_CODE: {
            return {
                ...state,
                status: SEND_CODE,
            };
        }
        case SEND_CODE_SUCCESS: {
            const { data } = action.payload;

            return {
                ...state,
                status: SEND_CODE_SUCCESS,
                nextMessage: data.nextMessage,
                codeLength: data.codeLength,
            };
        }
        case SEND_CODE_ERROR: {
            const { response } = action.payload;

            if (response && response.status === 429) {
                return {
                    ...state,
                    status: SEND_CODE_TOO_MANY_REQUESTS,
                    nextMessage: response.data.nextMessage,
                };
            }

            return {
                ...state,
                status: SEND_CODE_ERROR,
                error: action.payload,
            };
        }
        case UPDATE_AUTH_DATA: {
            return {
                ...state,
                ...action.payload,
            };
        }
        case AUTH_RESET: {
            return {
                ...initialState,
            };
        }
        default: {
            return state;
        }
    }
};
