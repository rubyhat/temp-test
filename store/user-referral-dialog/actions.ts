import {
    USER_REFERRAL_CLOSE_DIALOG,
    USER_REFERRAL_DIALOG_COPY_PROMOCODE,
    USER_REFERRAL_DIALOG_RESET_STATE,
    USER_REFERRAL_DIALOG_SHARE_PROMOCODE,
    USER_REFERRAL_DISMISS_DIALOG,
    USER_REFERRAL_SHOW_DIALOG,
    UserReferralDialogActionTypes,
} from './types';

export const userReferralShowDialog = (): UserReferralDialogActionTypes => ({
    type: USER_REFERRAL_SHOW_DIALOG,
});

export const userReferralCloseDialog = (): UserReferralDialogActionTypes => ({
    type: USER_REFERRAL_CLOSE_DIALOG,
});

export const userReferralDismissDialog = (): UserReferralDialogActionTypes => ({
    type: USER_REFERRAL_DISMISS_DIALOG,
});

export const userReferralDialogCopyPromocode = (
    promocode: string
): UserReferralDialogActionTypes => ({
    type: USER_REFERRAL_DIALOG_COPY_PROMOCODE,
    payload: {
        promocode,
    },
});

export const userReferralDialogSharePromocode = (
    promocode: string,
    isWebShareApiSupported: boolean
): UserReferralDialogActionTypes => ({
    type: USER_REFERRAL_DIALOG_SHARE_PROMOCODE,
    payload: {
        promocode,
        isWebShareApiSupported,
    },
});

export const resetUserReferralDialogState = (): UserReferralDialogActionTypes => ({
    type: USER_REFERRAL_DIALOG_RESET_STATE,
});
