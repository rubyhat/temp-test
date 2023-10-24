import { UserReferralPromocodeDto } from 'swagger/client';

export type UserReferralState = {
    available: boolean;
    code: string;
    status: 'fetching' | 'success' | 'error' | 'idle';
    error: Error | null;
};

export const USER_REFERRAL_FETCHING = 'user-referral/fetching';
export const USER_REFERRAL_SUCCESS = 'user-referral/success';
export const USER_REFERRAL_ERROR = 'user-referral/error';
export const USER_REFERRAL_RESET = 'user-referral/reset';
export const USER_REFERRAL_COPY_PROMOCODE = 'user-referral/copy-promocode'; // для аналитики
export const USER_REFERRAL_SHARE_PROMOCODE = 'user-referral/share-promocode'; // для аналитики

export type UserReferralFetchingAction = {
    type: typeof USER_REFERRAL_FETCHING;
};

export type UserReferralSuccessAction = {
    type: typeof USER_REFERRAL_SUCCESS;
    payload: UserReferralPromocodeDto;
};

export type UserReferralErrorAction = {
    type: typeof USER_REFERRAL_ERROR;
    payload: Error;
};

type UserReferralResetAction = {
    type: typeof USER_REFERRAL_RESET;
};

export type UserReferralCopyPromocode = {
    type: typeof USER_REFERRAL_COPY_PROMOCODE;
    payload: {
        promocode: string;
    };
};

export type UserReferralSharePromocode = {
    type: typeof USER_REFERRAL_SHARE_PROMOCODE;
    payload: {
        promocode: string;
        isWebShareApiSupported: boolean;
    };
};

export type UserReferralActionTypes =
    | UserReferralFetchingAction
    | UserReferralSuccessAction
    | UserReferralErrorAction
    | UserReferralResetAction
    | UserReferralCopyPromocode
    | UserReferralSharePromocode;
