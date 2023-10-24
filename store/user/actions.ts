import {
    PERSIST_USER,
    USER_FETCHING,
    USER_FETCHING_ERROR,
    USER_LOGOUT,
    USER_SUCCESS,
    UserActionTypes,
    UserState,
} from './types';

export const userFetching = (): UserActionTypes => ({
    type: USER_FETCHING,
});

export const userFetchingError = (): UserActionTypes => ({
    type: USER_FETCHING_ERROR,
});

export const persistUser = (user: UserState): UserActionTypes => ({
    type: PERSIST_USER,
    payload: user,
});

export const userSuccess = (user: UserState): UserActionTypes => ({
    type: USER_SUCCESS,
    payload: user,
});

export const userLogout = (): UserActionTypes => ({
    type: USER_LOGOUT,
});
