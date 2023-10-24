import {
    USER_REFERRAL_ERROR,
    USER_REFERRAL_FETCHING,
    USER_REFERRAL_RESET,
    USER_REFERRAL_SUCCESS,
    UserReferralActionTypes,
    UserReferralState,
} from './types';

const initialState: UserReferralState = {
    available: false,
    code: '',
    status: 'idle',
    error: null,
};

export const userReferralReducer = (
    state: UserReferralState = initialState,
    action: UserReferralActionTypes
): UserReferralState => {
    switch (action.type) {
        case USER_REFERRAL_FETCHING: {
            return {
                ...state,
                status: 'fetching',
                error: null,
            };
        }
        case USER_REFERRAL_SUCCESS: {
            const { code, available } = action.payload;

            return {
                ...state,
                status: 'success',
                code: code || '',
                available,
            };
        }
        case USER_REFERRAL_ERROR: {
            return {
                ...state,
                status: 'error',
                error: action.payload,
            };
        }
        case USER_REFERRAL_RESET: {
            return {
                ...initialState,
            };
        }
        default:
            return state;
    }
};
