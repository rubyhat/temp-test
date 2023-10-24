import {
    CHANGE_REVIEW_COMMENT,
    RESET_REVIEW_ANSWERS,
    RESET_REVIEW_ANSWERS_STATE,
    RESET_REVIEW_COMMENT,
    ReviewAnswersActionTypes,
    TOGGLE_REVIEW_ANSWER,
} from './types';

export const toggleReviewAnswer = (
    code: string,
    value: boolean
): ReviewAnswersActionTypes => ({
    type: TOGGLE_REVIEW_ANSWER,
    payload: {
        code,
        value,
    },
});

export const resetReviewAnswers = (): ReviewAnswersActionTypes => ({
    type: RESET_REVIEW_ANSWERS,
});

export const changeReviewComment = (
    comment: string
): ReviewAnswersActionTypes => ({
    type: CHANGE_REVIEW_COMMENT,
    payload: comment,
});

export const resetReviewComment = (): ReviewAnswersActionTypes => ({
    type: RESET_REVIEW_COMMENT,
});

export const resetReviewAnswersState = (): ReviewAnswersActionTypes => ({
    type: RESET_REVIEW_ANSWERS_STATE,
});
