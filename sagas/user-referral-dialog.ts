import { SagaIterator } from 'redux-saga';
import { takeLatest, put, all, take, race } from 'redux-saga/effects';

import { SUBMIT_REVIEW, SubmitReview } from 'store/reviews/submit-review';
import {
    USER_REFERRAL_ERROR,
    USER_REFERRAL_SUCCESS,
    UserReferralErrorAction,
    userReferralFetch,
    UserReferralSuccessAction,
} from 'store/user-referral';
import { userReferralShowDialog } from 'store/user-referral-dialog';

function* onSubmitReview(action: SubmitReview): SagaIterator {
    const { review } = action.payload;

    // Если оценили на пятерку -- показываем диалог с рефералкой
    if (review.rate === 5) {
        yield put(userReferralFetch());

        const {
            referral,
            error,
        }: {
            referral: UserReferralSuccessAction;
            error: UserReferralErrorAction;
        } = yield race({
            referral: take(USER_REFERRAL_SUCCESS),
            error: take(USER_REFERRAL_ERROR),
        });

        if (referral && referral.payload.available) {
            yield put(userReferralShowDialog());
        }
    }
}

export function* watchUserReferralDialog(): SagaIterator {
    yield all([takeLatest(SUBMIT_REVIEW, onSubmitReview)]);
}
