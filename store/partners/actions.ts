import {
    PARTNERS_ERROR,
    PARTNERS_FETCHING,
    PARTNERS_SUCCESS,
    PartnersActionTypes,
} from './types';
import { AtlasPartnerContactsDto } from 'swagger/client';

export const partnersFetching = (): PartnersActionTypes => ({
    type: PARTNERS_FETCHING,
});

export const partnersSuccess = (
    payload: AtlasPartnerContactsDto[]
): PartnersActionTypes => ({
    type: PARTNERS_SUCCESS,
    payload,
});

export const partnersError = (err: Error): PartnersActionTypes => ({
    type: PARTNERS_ERROR,
    payload: err,
});
