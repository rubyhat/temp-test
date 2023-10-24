import {
    USER_REFERRAL_CLOSE_DIALOG,
    USER_REFERRAL_DIALOG_COPY_PROMOCODE,
    USER_REFERRAL_DIALOG_RESET_STATE,
    USER_REFERRAL_DIALOG_SHARE_PROMOCODE,
    USER_REFERRAL_DISMISS_DIALOG,
    USER_REFERRAL_SHOW_DIALOG,
    UserReferralDialogActionTypes,
    UserReferralDialogState,
} from './types';

const initialState: UserReferralDialogState = {
    showDialog: false,
    userSharedPromocode: false,
    userCopiedPromocode: false,
};

export const userReferralDialogReducer = (
    state: UserReferralDialogState = initialState,
    action: UserReferralDialogActionTypes
): UserReferralDialogState => {
    switch (action.type) {
        case USER_REFERRAL_SHOW_DIALOG: {
            return {
                ...state,
                showDialog: true,
            };
        }
        case USER_REFERRAL_DIALOG_COPY_PROMOCODE: {
            return {
                ...state,
                userCopiedPromocode: true,
            };
        }
        case USER_REFERRAL_DIALOG_SHARE_PROMOCODE: {
            return {
                ...state,
                userSharedPromocode: true,
            };
        }
        case USER_REFERRAL_CLOSE_DIALOG: {
            return {
                ...state,
                showDialog: false,
            };
        }
        case USER_REFERRAL_DISMISS_DIALOG: {
            return {
                ...state,
                showDialog: false,
            };
        }
        case USER_REFERRAL_DIALOG_RESET_STATE: {
            return {
                ...initialState,
            };
        }
        default:
            return state;
    }
};
