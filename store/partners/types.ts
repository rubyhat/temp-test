import { AtlasPartnerContactsDto } from 'swagger/client';

export type PartnersState = {
    partners: AtlasPartnerContactsDto[];
    status: PartnersStatuses | null;
    error: Error | null;
};

export type PartnersStatuses =
    | typeof PARTNERS_FETCHING
    | typeof PARTNERS_SUCCESS
    | typeof PARTNERS_ERROR;

export const PARTNERS_FETCHING = 'PARTNERS_FETCHING';
export const PARTNERS_SUCCESS = 'PARTNERS_SUCCESS';
export const PARTNERS_ERROR = 'PARTNERS_ERROR';

type PartnersFetchingAction = {
    type: typeof PARTNERS_FETCHING;
};

type PartnersSuccessAction = {
    type: typeof PARTNERS_SUCCESS;
    payload: AtlasPartnerContactsDto[];
};

type PartnersErrorAction = {
    type: typeof PARTNERS_ERROR;
    payload: Error;
};

export type PartnersActionTypes =
    | PartnersFetchingAction
    | PartnersSuccessAction
    | PartnersErrorAction;
