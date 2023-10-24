import { CurrencySymbol } from 'utils/currency';
import { UserKarmaResponseDto } from 'swagger/client';

export type KarmaState = {
    karma: number;
    currency: CurrencySymbol;
    limit: number;
    maxLimit: number;

    status: KarmaStatuses | null;
    error: Error | null;
};

export type KarmaStatuses =
    | typeof KARMA_FETCHING
    | typeof KARMA_SUCCESS
    | typeof KARMA_ERROR;

export const KARMA_FETCHING = 'KARMA_FETCHING';
export const KARMA_SUCCESS = 'KARMA_SUCCESS';
export const KARMA_ERROR = 'KARMA_ERROR';

export type KarmaFetchingAction = {
    type: typeof KARMA_FETCHING;
};

export type KarmaSuccessAction = {
    type: typeof KARMA_SUCCESS;
    payload: {
        data: UserKarmaResponseDto;
        currency: CurrencySymbol;
    };
};

type KarmaErrorAction = {
    type: typeof KARMA_ERROR;
    payload: Error;
};

export type KarmaActionTypes =
    | KarmaFetchingAction
    | KarmaSuccessAction
    | KarmaErrorAction;
