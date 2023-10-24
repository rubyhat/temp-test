export type UserReferralDialogState = {
    showDialog: boolean;

    // Для аналитики
    userCopiedPromocode: boolean; // пользователь поделился промокодом
    userSharedPromocode: boolean; // пользователь скопировал промокод
};

export const USER_REFERRAL_SHOW_DIALOG = 'user-referral-dialog/show-dialog';
export const USER_REFERRAL_CLOSE_DIALOG = 'user-referral-dialog/close-dialog';
export const USER_REFERRAL_DISMISS_DIALOG =
    'user-referral-dialog/dismiss-dialog';
export const USER_REFERRAL_DIALOG_RESET_STATE =
    'user-referral-dialog/reset-state';
export const USER_REFERRAL_DIALOG_COPY_PROMOCODE =
    'user-referral-dialog/copy-promocode'; // для аналитики
export const USER_REFERRAL_DIALOG_SHARE_PROMOCODE =
    'user-referral-dialog/share-promocode'; // для аналитики

export type UserReferralShowDialog = {
    type: typeof USER_REFERRAL_SHOW_DIALOG;
};

export type UserReferralCloseDialog = {
    type: typeof USER_REFERRAL_CLOSE_DIALOG;
};

export type UserReferralDismissDialog = {
    type: typeof USER_REFERRAL_DISMISS_DIALOG;
};

export type UserReferralDialogResetState = {
    type: typeof USER_REFERRAL_DIALOG_RESET_STATE;
};

export type UserReferralDialogCopyPromocode = {
    type: typeof USER_REFERRAL_DIALOG_COPY_PROMOCODE;
    payload: {
        promocode: string;
    };
};

export type UserReferralDialogSharePromocode = {
    type: typeof USER_REFERRAL_DIALOG_SHARE_PROMOCODE;
    payload: {
        promocode: string;
        isWebShareApiSupported: boolean;
    };
};

export type UserReferralDialogActionTypes =
    | UserReferralShowDialog
    | UserReferralCloseDialog
    | UserReferralDismissDialog
    | UserReferralDialogCopyPromocode
    | UserReferralDialogSharePromocode
    | UserReferralDialogResetState;
