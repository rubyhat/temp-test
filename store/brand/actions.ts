import { BRAND_SET_PARTNER, BrandActionTypes, SET_IN_WEBVIEW } from './types';
import { SaaSConfigDto } from 'swagger/client';

export const brandSetPartner = (
    brandName: string,
    partner: SaaSConfigDto | null,
    partners: SaaSConfigDto[]
): BrandActionTypes => ({
    type: BRAND_SET_PARTNER,
    payload: {
        brandName,
        partner,
        partners,
    },
});

export const setInWebView = (inWebView: boolean): BrandActionTypes => ({
    type: SET_IN_WEBVIEW,
    payload: inWebView,
});
