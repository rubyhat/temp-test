import { SeoDtoResponse } from 'swagger/client';

export type SeoState = {
    seo: SeoDtoResponse | null;
    phones: string[];
    status: SeoStatuses | null;
    error: Error | null;
};

export type SeoStatuses =
    | typeof SEO_FETCHING
    | typeof SEO_SUCCESS
    | typeof SEO_ERROR;

export const SEO_FETCHING = 'SEO_FETCHING';
export const SEO_SUCCESS = 'SEO_SUCCESS';
export const SEO_ERROR = 'SEO_ERROR';
export const SEO_RESET = 'SEO_RESET';

export type SeoFetchingAction = {
    type: typeof SEO_FETCHING;
    payload: {
        locale: Locale;
        fromName: string;
        toName: string;
    };
};

type SeoSuccessAction = {
    type: typeof SEO_SUCCESS;
    payload: SeoDtoResponse;
};

type SeoErrorAction = {
    type: typeof SEO_ERROR;
    payload: Error;
};

type SeoResetAction = {
    type: typeof SEO_RESET;
};

export type SeoActionTypes =
    | SeoFetchingAction
    | SeoSuccessAction
    | SeoErrorAction
    | SeoResetAction;
