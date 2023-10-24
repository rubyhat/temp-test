import { SaaSConfigDto } from 'swagger/client';

export type BrandState = {
    brandName: string;
    partners: SaaSConfigDto[];
    partner: SaaSConfigDto | null;
    /**
     * Если `true` значит сайт загружен внутри WebView приложения партнера.
     * Это свойство только для партнера. Приложению Атлас'а не стоит полагаться
     * на это свойство.
     */
    inWebView: boolean | null;
};

export const BRAND_SET_PARTNER = 'BRAND_SET_PARTNER';
export const SET_IN_WEBVIEW = 'SET_IN_WEBVIEW';

export type BrandSetPartner = {
    type: typeof BRAND_SET_PARTNER;
    payload: {
        brandName: string;
        partners: SaaSConfigDto[];
        partner: SaaSConfigDto | null;
    };
};

export type SetInWebView = {
    type: typeof SET_IN_WEBVIEW;
    payload: boolean;
};

export type BrandActionTypes = BrandSetPartner | SetInWebView;
