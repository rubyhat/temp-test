import {
    LOYALTY_ERROR,
    LOYALTY_FETCHING,
    LOYALTY_RESET,
    LOYALTY_SUCCESS,
    LoyaltyActionTypes,
    LoyaltyState,
} from './types';

const initialState: LoyaltyState = {
    price: 0,
    onlinePrice: 0,
    milesPrice: 0,

    bonus: 0,
    onlineBonus: 0,

    promocodeApplied: null,
    withPromocode: false,

    status: null,
    error: null,
};

export const loyaltyReducer = (
    state: LoyaltyState = initialState,
    action: LoyaltyActionTypes
): LoyaltyState => {
    switch (action.type) {
        case LOYALTY_FETCHING: {
            const { promocode } = action.payload;

            return {
                ...state,
                status: LOYALTY_FETCHING,
                error: null,
                promocodeApplied: null,
                withPromocode: !!promocode,
                promocodeError: undefined,
            };
        }
        case LOYALTY_SUCCESS: {
            const {
                price,
                onlinePrice,
                milesPrice,
                promocode,
                bonus,
                onlineBonus,
            } = action.payload;

            return {
                ...state,
                status: LOYALTY_SUCCESS,
                price,
                onlinePrice,
                milesPrice,
                bonus,
                onlineBonus,
                promocodeError: promocode.error
                    ? promocode.error.description
                    : undefined,
                promocodeApplied: state.withPromocode
                    ? promocode.applied
                    : null,
            };
        }
        case LOYALTY_ERROR: {
            return {
                ...state,
                status: LOYALTY_ERROR,
                error: action.payload,
            };
        }
        case LOYALTY_RESET: {
            return {
                ...initialState,
            };
        }
        default:
            return state;
    }
};
