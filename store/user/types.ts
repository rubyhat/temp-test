export type UserState = {
    phoneNumber: string;
    email: string;
    employee: boolean;
    role: string;
    isPartner: boolean;
    isAdmin: boolean;
    ordersCount: number;
    lastPickupDate?: string;
    hashedPhone: string;
    policyVersion?: string;
};

export const USER_FETCHING = 'USER_FETCHING';
export const USER_SUCCESS = 'USER_SUCCESS';
export const USER_FETCHING_ERROR = 'USER_FETCHING_ERROR'; // probably 401 Unauthorized
export const USER_LOGOUT = 'USER_LOGOUT';

export const PERSIST_USER = 'PERSIST_USER';

export type UserFetchingAction = {
    type: typeof USER_FETCHING;
};

export type UserSuccessAction = {
    type: typeof USER_SUCCESS;
    payload: UserState;
};

export type UserFetchingError = {
    type: typeof USER_FETCHING_ERROR;
};

export type UserLogoutAction = {
    type: typeof USER_LOGOUT;
};

export type PersistUserAction = {
    type: typeof PERSIST_USER;
    payload: UserState;
};

export type UserActionTypes =
    | UserFetchingAction
    | UserSuccessAction
    | UserFetchingError
    | UserLogoutAction
    | PersistUserAction;
