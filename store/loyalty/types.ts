import { CalculateLoyaltyResponseDto } from 'swagger/client';

export type LoyaltyState = {
    price: number;
    onlinePrice: number;
    milesPrice: number;

    bonus: number;
    onlineBonus: number;

    promocodeApplied: boolean | null;
    withPromocode: boolean;
    promocodeError?: string;

    status: LoyaltyStatuses | null;
    error: Error | null;
};

export type LoyaltyStatuses =
    | typeof LOYALTY_FETCHING
    | typeof LOYALTY_SUCCESS
    | typeof LOYALTY_ERROR;

export const LOYALTY_FETCHING = 'LOYALTY_FETCHING';
export const LOYALTY_SUCCESS = 'LOYALTY_SUCCESS';
export const LOYALTY_ERROR = 'LOYALTY_ERROR';
export const LOYALTY_RESET = 'LOYALTY_RESET';

export type LoyaltyFetchingAction = {
    type: typeof LOYALTY_FETCHING;
    payload: {
        orderId: string;
        promocode: string;
    };
};

type LoyaltySuccessAction = {
    type: typeof LOYALTY_SUCCESS;
    payload: CalculateLoyaltyResponseDto;
};

type LoyaltyErrorAction = {
    type: typeof LOYALTY_ERROR;
    payload: Error;
};

type LoyaltyResetAction = {
    type: typeof LOYALTY_RESET;
};

export type LoyaltyActionTypes =
    | LoyaltyFetchingAction
    | LoyaltySuccessAction
    | LoyaltyErrorAction
    | LoyaltyResetAction;
