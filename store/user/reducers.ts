import {
    PERSIST_USER,
    USER_LOGOUT,
    USER_SUCCESS,
    UserActionTypes,
    UserState,
} from './types';

const localStorageUser = process.browser && localStorage.getItem('user');
const localUser: UserState = localStorageUser && JSON.parse(localStorageUser);

const initialState: UserState = {
    phoneNumber: '',
    email: '',
    employee: false,
    role: 'user',
    isAdmin: false,
    isPartner: false,
    ordersCount: 0,
    lastPickupDate: undefined,
    hashedPhone: '',
};

export const userReducer = (
    state: UserState = localUser || initialState,
    action: UserActionTypes
): UserState => {
    switch (action.type) {
        case PERSIST_USER: {
            const user = action.payload;

            return {
                ...state,
                ...user,
            };
        }
        case USER_SUCCESS: {
            const user = action.payload;
            if (process.browser) {
                localStorage.setItem('user', JSON.stringify(user));
            }
            return {
                ...state,
                ...user,
            };
        }
        case USER_LOGOUT: {
            if (process.browser) {
                localStorage.removeItem('user');
            }
            return {
                ...initialState,
            };
        }
        default:
            return state;
    }
};
