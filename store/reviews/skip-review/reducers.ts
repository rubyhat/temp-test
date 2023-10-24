import { Reducer } from 'redux';

import {
    RESET_SKIP_REVIEW_STATE,
    REVIEW_SKIPPED,
    SKIP_REVIEW,
    SKIP_REVIEW_ERROR,
    SkipReviewActionTypes,
    SkipReviewState,
    SkipReviewStatus,
} from './types';

const initialState: SkipReviewState = {
    status: SkipReviewStatus.IDLE,
    err: null,
};

export const skipReviewReducer: Reducer<
    SkipReviewState,
    SkipReviewActionTypes
> = (state = initialState, action): SkipReviewState => {
    switch (action.type) {
        case SKIP_REVIEW: {
            return {
                ...state,
                status: SkipReviewStatus.SKIPPING,
            };
        }
        case REVIEW_SKIPPED: {
            return {
                ...state,
                status: SkipReviewStatus.SUCCESS,
            };
        }
        case SKIP_REVIEW_ERROR: {
            return {
                ...state,
                status: SkipReviewStatus.ERROR,
                err: action.payload,
            };
        }
        case RESET_SKIP_REVIEW_STATE: {
            return {
                ...initialState,
            };
        }
        default:
            return state;
    }
};
