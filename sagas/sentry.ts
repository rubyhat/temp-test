import { SagaIterator } from 'redux-saga';
import { all, takeLatest } from 'redux-saga/effects';
import * as Sentry from '@sentry/browser';

import { USER_SUCCESS, UserSuccessAction } from 'store/user/types';

function* configureScope(action: UserSuccessAction): SagaIterator {
    Sentry.configureScope(scope => {
        scope.setUser({ id: action.payload.phoneNumber });
    });
}

export function* watchSentry(): SagaIterator {
    yield all([takeLatest(USER_SUCCESS, configureScope)]);
}
