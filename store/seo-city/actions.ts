import { IncomingMessage } from 'http';

import {
    SEO_CITY_ERROR,
    SEO_CITY_FETCHING,
    SEO_CITY_SUCCESS,
    SeoCityActionTypes,
} from 'store/seo-city/types';
import { SeoDto } from 'swagger/client';

export const seoCityFetching = (
    city: string,
    req?: IncomingMessage
): SeoCityActionTypes => ({
    type: SEO_CITY_FETCHING,
    payload: {
        city,
        req,
    },
});

export const seoCitySuccess = (data: SeoDto[]): SeoCityActionTypes => ({
    type: SEO_CITY_SUCCESS,
    payload: data,
});

export const seoCityError = (error: Error): SeoCityActionTypes => ({
    type: SEO_CITY_ERROR,
    payload: error,
});
