import { IncomingMessage } from 'http';

import { SeoDto } from 'swagger/client';

export type SeoCityState = {
    city: string;
    destinations: SeoDto[];
    status: SeoCityStatuses | null;
    error: Error | null;
};

export type SeoCityStatuses =
    | typeof SEO_CITY_FETCHING
    | typeof SEO_CITY_SUCCESS
    | typeof SEO_CITY_ERROR;

export const SEO_CITY_FETCHING = '[SEO city] Fetching';
export const SEO_CITY_SUCCESS = '[SEO city] Success';
export const SEO_CITY_ERROR = '[SEO city] Error';

export type SeoCityFetchingAction = {
    type: typeof SEO_CITY_FETCHING;
    payload: {
        city: string;
        req?: IncomingMessage;
    };
};

type SeoCitySuccessAction = {
    type: typeof SEO_CITY_SUCCESS;
    payload: SeoDto[];
};

type SeoCityErrorAction = {
    type: typeof SEO_CITY_ERROR;
    payload: Error;
};

export type SeoCityActionTypes =
    | SeoCityFetchingAction
    | SeoCitySuccessAction
    | SeoCityErrorAction;
