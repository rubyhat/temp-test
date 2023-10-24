import {
    AffiliateActionTypes,
    AffiliateState,
    HOTEL_BANNER_CLICKED,
} from 'store/affiliates/types';

const initialState: AffiliateState = {};

export const affiliatesReducer = (
    state: AffiliateState = initialState,
    action: AffiliateActionTypes
): AffiliateState => {
    switch (action.type) {
        case HOTEL_BANNER_CLICKED: {
            return state;
        }
        default: {
            return state;
        }
    }
};
