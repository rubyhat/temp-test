import { SagaIterator } from 'redux-saga';
import { Action } from 'redux';
import { takeLatest, call, put, all, delay, select } from 'redux-saga/effects';
import * as Sentry from '@sentry/browser';

import { FETCH_FETCHING } from 'store/fetchFactory/types';
import { fetchError, fetchSuccess } from 'store/fetchFactory/actions';
import { SuggestionFetchingAction } from 'store/suggestion/types';
import apiClient from 'lib/apiClient';
import { RootState } from 'store';

function* fetchSuggestions(action: SuggestionFetchingAction): SagaIterator {
    try {
        yield delay(200);
        const { searchForm }: RootState = yield select();
        const { fromValue } = searchForm;
        const from =
            action.name === 'suggestionTo' && fromValue ? fromValue.id : '';
        const { data } = yield call(
            apiClient.searchSuggestGet,
            action.query,
            from
        );

        yield put(
            fetchSuccess(action.name, {
                data,
                userInput: action.query,
            })
        );
    } catch (err) {
        yield put(fetchError(action.name, err));
        Sentry.captureException(err);
    }
}

type AdvancedAction = Action & {
    name?: string;
};

export function* watchSuggestions(): SagaIterator {
    yield all([
        takeLatest(
            (action: AdvancedAction) =>
                action.type === FETCH_FETCHING &&
                action.name === 'suggestionFrom',
            fetchSuggestions
        ),
        takeLatest(
            (action: AdvancedAction) =>
                action.type === FETCH_FETCHING &&
                action.name === 'suggestionTo',
            fetchSuggestions
        ),
    ]);
}
