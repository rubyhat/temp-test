import {
    USER_REFERRAL_COPY_PROMOCODE,
    USER_REFERRAL_ERROR,
    USER_REFERRAL_FETCHING,
    USER_REFERRAL_RESET,
    USER_REFERRAL_SHARE_PROMOCODE,
    USER_REFERRAL_SUCCESS,
    UserReferralActionTypes,
} from './types';
import { UserReferralPromocodeDto } from 'swagger/client';

export const userReferralFetch = (): UserReferralActionTypes => ({
    type: USER_REFERRAL_FETCHING,
});

export const userReferralSuccess = (
    data: UserReferralPromocodeDto
): UserReferralActionTypes => ({
    type: USER_REFERRAL_SUCCESS,
    payload: data,
});

export const userReferralError = (error: Error): UserReferralActionTypes => ({
    type: USER_REFERRAL_ERROR,
    payload: error,
});

export const userReferralReset = (): UserReferralActionTypes => ({
    type: USER_REFERRAL_RESET,
});

export const userReferralCopyPromocode = (
    promocode: string
): UserReferralActionTypes => ({
    type: USER_REFERRAL_COPY_PROMOCODE,
    payload: {
        promocode,
    },
});

export const userReferralSharePromocode = (
    promocode: string,
    isWebShareApiSupported: boolean
): UserReferralActionTypes => ({
    type: USER_REFERRAL_SHARE_PROMOCODE,
    payload: {
        promocode,
        isWebShareApiSupported,
    },
});
