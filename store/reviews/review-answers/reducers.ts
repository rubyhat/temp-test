import { Reducer } from 'redux';

import {
    CHANGE_REVIEW_COMMENT,
    RESET_REVIEW_ANSWERS,
    RESET_REVIEW_ANSWERS_STATE,
    RESET_REVIEW_COMMENT,
    ReviewAnswersActionTypes,
    ReviewAnswersState,
    TOGGLE_REVIEW_ANSWER,
} from './types';

const initialState: ReviewAnswersState = {
    answers: {},
    comment: '',
};

export const reviewAnswersReducer: Reducer<
    ReviewAnswersState,
    ReviewAnswersActionTypes
> = (state = initialState, action): ReviewAnswersState => {
    switch (action.type) {
        case TOGGLE_REVIEW_ANSWER: {
            const { code, value } = action.payload;

            return {
                ...state,
                answers: {
                    ...state.answers,
                    [code]: value,
                },
            };
        }
        case RESET_REVIEW_ANSWERS: {
            return {
                ...state,
                answers: {},
            };
        }
        case CHANGE_REVIEW_COMMENT: {
            return {
                ...state,
                comment: action.payload,
            };
        }
        case RESET_REVIEW_COMMENT: {
            return {
                ...state,
                comment: '',
            };
        }
        case RESET_REVIEW_ANSWERS_STATE: {
            return {
                ...initialState,
            };
        }
        default:
            return state;
    }
};
