import { Reducer } from 'redux';

import {
    RESET_SUBMIT_REVIEW_STATE,
    REVIEW_ERROR,
    REVIEW_SUBMITTED,
    SUBMIT_REVIEW,
    SubmitReviewActionTypes,
    SubmitReviewState,
    SubmitReviewStatus,
} from './types';

const initialState: SubmitReviewState = {
    status: SubmitReviewStatus.IDLE,
    err: null,
};

export const submitReviewReducer: Reducer<
    SubmitReviewState,
    SubmitReviewActionTypes
> = (state = initialState, action): SubmitReviewState => {
    switch (action.type) {
        case SUBMIT_REVIEW: {
            return {
                ...state,
                status: SubmitReviewStatus.SUBMITTING,
            };
        }
        case REVIEW_SUBMITTED: {
            return {
                ...state,
                status: SubmitReviewStatus.SUCCESS,
            };
        }
        case REVIEW_ERROR: {
            return {
                ...state,
                status: SubmitReviewStatus.ERROR,
                err: action.payload,
            };
        }
        case RESET_SUBMIT_REVIEW_STATE: {
            return {
                ...initialState,
            };
        }
        default:
            return state;
    }
};
