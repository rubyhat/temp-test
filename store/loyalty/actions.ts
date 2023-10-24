import {
    LOYALTY_ERROR,
    LOYALTY_FETCHING,
    LOYALTY_RESET,
    LOYALTY_SUCCESS,
    LoyaltyActionTypes,
} from './types';
import { CalculateLoyaltyResponseDto } from 'swagger/client';

export const loyaltyFetching = (
    orderId: string,
    promocode: string = ''
): LoyaltyActionTypes => ({
    type: LOYALTY_FETCHING,
    payload: {
        orderId,
        promocode,
    },
});

export const loyaltySuccess = (
    payload: CalculateLoyaltyResponseDto
): LoyaltyActionTypes => ({
    type: LOYALTY_SUCCESS,
    payload,
});

export const loyaltyError = (err: Error): LoyaltyActionTypes => ({
    type: LOYALTY_ERROR,
    payload: err,
});

export const loyaltyReset = (): LoyaltyActionTypes => ({
    type: LOYALTY_RESET,
});
