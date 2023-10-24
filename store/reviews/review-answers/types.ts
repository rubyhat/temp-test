export type ReviewAnswersState = {
    answers: Record<string, boolean>;
    comment: string;
};

export const TOGGLE_REVIEW_ANSWER = 'review-answers/toggleReviewAnswer';
export const RESET_REVIEW_ANSWERS = 'review-answers/resetReviewAnswers';
export const CHANGE_REVIEW_COMMENT = 'review-answers/changeReviewComment';
export const RESET_REVIEW_COMMENT = 'review-answers/resetReviewComment';
export const RESET_REVIEW_ANSWERS_STATE =
    'review-answers/resetReviewAnswersState';

export type ToggleReviewAnswer = {
    type: typeof TOGGLE_REVIEW_ANSWER;
    payload: {
        code: string;
        value: boolean;
    };
};

export type ResetReviewAnswers = {
    type: typeof RESET_REVIEW_ANSWERS;
};

export type ChangeReviewComment = {
    type: typeof CHANGE_REVIEW_COMMENT;
    payload: string;
};

export type ResetReviewComment = {
    type: typeof RESET_REVIEW_COMMENT;
};

export type ResetReviewAnswersState = {
    type: typeof RESET_REVIEW_ANSWERS_STATE;
};

export type ReviewAnswersActionTypes =
    | ToggleReviewAnswer
    | ResetReviewAnswers
    | ChangeReviewComment
    | ResetReviewComment
    | ResetReviewAnswersState;
