import { IncomingMessage } from 'http';

import {
    SEO_FEATURED_ERROR,
    SEO_FEATURED_FETCHING,
    SEO_FEATURED_SUCCESS,
    SeoFeaturedActionTypes,
} from 'store/seo-featured/types';
import { FeaturedResponseDto } from 'swagger/client';

export const seoFeaturedFetching = (
    req?: IncomingMessage
): SeoFeaturedActionTypes => ({
    type: SEO_FEATURED_FETCHING,
    payload: {
        req,
    },
});

export const seoFeaturedSuccess = (
    data: FeaturedResponseDto
): SeoFeaturedActionTypes => ({
    type: SEO_FEATURED_SUCCESS,
    payload: data,
});

export const seoFeaturedError = (error: Error): SeoFeaturedActionTypes => ({
    type: SEO_FEATURED_ERROR,
    payload: error,
});
