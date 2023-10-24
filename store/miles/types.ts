import { MilesBalanceDto, MilesCurrencyDto } from 'swagger/client';

export type MilesState = {
    balance: number;
    currency: Array<MilesCurrencyDto>;
    status: MilesStatuses | null;
    error: Error | null;
};

export type MilesStatuses =
    | typeof MILES_FETCHING
    | typeof MILES_SUCCESS
    | typeof MILES_ERROR;

export const MILES_FETCHING = 'MILES_FETCHING';
export const MILES_SUCCESS = 'MILES_SUCCESS';
export const MILES_ERROR = 'MILES_ERROR';

type MilesFetchingAction = {
    type: typeof MILES_FETCHING;
};

type MilesSuccessAction = {
    type: typeof MILES_SUCCESS;
    payload: MilesBalanceDto;
};

type MilesErrorAction = {
    type: typeof MILES_ERROR;
    payload: Error;
};

export type MilesActionTypes =
    | MilesFetchingAction
    | MilesSuccessAction
    | MilesErrorAction;
