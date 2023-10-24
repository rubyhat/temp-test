import { SagaIterator } from 'redux-saga';
import { all, takeLatest, call, select } from 'redux-saga/effects';

import { USER_SUCCESS, UserSuccessAction } from 'store/user/types';
import { oneSignalRegisterUser, requestPushPermissions } from 'utils/onesignal';
import { isCordova } from 'utils/platform';
import { rateThisApp } from 'utils/rate';
import { ORDER_SUCCESS, OrderSuccessAction } from 'store/order/types';
import { OrderDtoStatusEnum } from 'swagger/client';
import { RootState } from 'store';

function* configurePush(action: UserSuccessAction): SagaIterator {
    yield call(oneSignalRegisterUser, action.payload.phoneNumber);
}

function* requestPermissions(action: OrderSuccessAction): SagaIterator {
    const state: RootState = ((yield select()) as unknown) as RootState;
    const { brand } = state;

    if (isCordova && action.payload.status === OrderDtoStatusEnum.Active) {
        if (!rateThisApp(brand.partner)) {
            yield call(requestPushPermissions);
        }
    }
}

export function* watchOneSignal(): SagaIterator {
    yield all([
        takeLatest(USER_SUCCESS, configurePush),
        takeLatest([ORDER_SUCCESS], requestPermissions),
    ]);
}
