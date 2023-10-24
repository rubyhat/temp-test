import {
    CARDS_ERROR,
    CARDS_FETCHING,
    CARDS_SUCCESS,
    CardsActionTypes,
    CardsState,
} from './types';

const initialState: CardsState = {
    cards: [],
    status: null,
    error: null,
};

export const creditCardsReducer = (
    state: CardsState = initialState,
    action: CardsActionTypes
): CardsState => {
    switch (action.type) {
        case CARDS_FETCHING: {
            return {
                ...state,
                cards: [],
                status: CARDS_FETCHING,
                error: null,
            };
        }
        case CARDS_SUCCESS: {
            const cards = action.payload;

            return {
                ...state,
                status: CARDS_SUCCESS,
                cards,
            };
        }
        case CARDS_ERROR: {
            return {
                ...state,
                status: CARDS_ERROR,
                error: action.payload,
            };
        }
        default:
            return state;
    }
};
