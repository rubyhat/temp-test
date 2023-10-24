import {
    SEO_ERROR,
    SEO_FETCHING,
    SEO_RESET,
    SEO_SUCCESS,
    SeoActionTypes,
} from './types';
import { SeoDtoResponse } from 'swagger/client';

export const seoFetching = (
    locale: Locale,
    fromName: string,
    toName: string
): SeoActionTypes => ({
    type: SEO_FETCHING,
    payload: {
        locale,
        fromName,
        toName,
    },
});

export const seoSuccess = (data: SeoDtoResponse): SeoActionTypes => ({
    type: SEO_SUCCESS,
    payload: data,
});

export const seoError = (error: Error): SeoActionTypes => ({
    type: SEO_ERROR,
    payload: error,
});

export const seoReset = (): SeoActionTypes => ({
    type: SEO_RESET,
});
