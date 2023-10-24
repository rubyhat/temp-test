import { IncomingMessage } from 'http';

import { FeaturedResponseDto, SeoDto } from 'swagger/client';

export type SeoFeaturedState = {
    searchHistory: SeoDto[];
    nearbyRoutes: SeoDto[];
    status: SeaFeaturedStatuses | null;
    error: Error | null;
};

export type SeaFeaturedStatuses =
    | typeof SEO_FEATURED_FETCHING
    | typeof SEO_FEATURED_SUCCESS
    | typeof SEO_FEATURED_ERROR;

export const SEO_FEATURED_FETCHING = '[SEO featured] Fetching';
export const SEO_FEATURED_SUCCESS = '[SEO featured] Success';
export const SEO_FEATURED_ERROR = '[SEO featured] Error';

export type SeoFeaturedFetchingAction = {
    type: typeof SEO_FEATURED_FETCHING;
    payload: {
        req?: IncomingMessage;
    };
};

type SeoFeaturedSuccessAction = {
    type: typeof SEO_FEATURED_SUCCESS;
    payload: FeaturedResponseDto;
};

type SeoFeaturedErrorAction = {
    type: typeof SEO_FEATURED_ERROR;
    payload: Error;
};

export type SeoFeaturedActionTypes =
    | SeoFeaturedFetchingAction
    | SeoFeaturedSuccessAction
    | SeoFeaturedErrorAction;
