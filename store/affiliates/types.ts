export type AffiliateState = {};

export const HOTEL_BANNER_CLICKED = 'HOTEL_BANNER_CLICKED';
export const FILTER_CLICKED = 'FILTER_CLICKED';
export const STOPS_CLICKED = 'STOPS_CLICKED';

export type AffiliateList = typeof HOTEL_BANNER_CLICKED;

type HotelBannerClick = {
    type: typeof HOTEL_BANNER_CLICKED;
};

type FilterClick = {
    type: typeof FILTER_CLICKED;
};

type StopsClick = {
    type: typeof STOPS_CLICKED;
};

export type AffiliateActionTypes = HotelBannerClick | FilterClick | StopsClick;
