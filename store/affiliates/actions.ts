import {
    AffiliateActionTypes,
    FILTER_CLICKED,
    HOTEL_BANNER_CLICKED,
    STOPS_CLICKED,
} from 'store/affiliates/types';

export const hotelBannerClick = (): AffiliateActionTypes => ({
    type: HOTEL_BANNER_CLICKED,
});

export const filterClickAnalytics = (): AffiliateActionTypes => ({
    type: FILTER_CLICKED,
});

export const stopsClickAnalytics = (): AffiliateActionTypes => ({
    type: STOPS_CLICKED,
});
