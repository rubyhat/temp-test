import { SagaIterator } from 'redux-saga';
import { all, select, takeLatest, put } from 'redux-saga/effects';
import * as Sentry from '@sentry/browser';

import { RootState } from 'store';
import { initSearchForm } from 'store/search-form/actions';
import { PERSIST_SEARCH_FORM, SearchFormState } from 'store/search-form/types';
import { SUCCESS_RIDES } from 'store/search-rides/types';
import { format } from 'utils/date';

type PersistentSearch = {
    fromValue: string; // id
    fromInputValue: string;
    toValue: string; // id
    toInputValue: string;
    passengers: string;
    time?: string;
};

function* persistState(): SagaIterator {
    try {
        const savedSearchForm: Partial<PersistentSearch> = JSON.parse(
            window.localStorage.getItem('searchForm') || '{}'
        );
        const rootState: RootState | undefined = yield select();
        if (!rootState) {
            return;
        }
        const { searchForm }: RootState = rootState;

        const searchFormData: Partial<SearchFormState> = {
            fromInputValue:
                searchForm.fromInputValue ||
                savedSearchForm.fromInputValue ||
                '',
            fromValue: searchForm.fromValue
                ? searchForm.fromValue
                : savedSearchForm.fromValue && savedSearchForm.fromInputValue
                ? {
                      id: savedSearchForm.fromValue,
                      name: savedSearchForm.fromInputValue,
                  }
                : null,
            toInputValue:
                searchForm.toInputValue || savedSearchForm.toInputValue || '',
            toValue: searchForm.toValue
                ? searchForm.toValue
                : savedSearchForm.toValue && savedSearchForm.toInputValue
                ? {
                      id: savedSearchForm.toValue,
                      name: savedSearchForm.toInputValue,
                  }
                : null,
            date: format(new Date(), 'yyyy-MM-dd'),
            passengers: '1',
        };
        if (searchForm.time) searchFormData.time = searchForm.time;
        yield put(initSearchForm(searchFormData));
    } catch (err) {
        window.localStorage.removeItem('searchForm');
        Sentry.captureException(err);
    }
}

function* saveState(): SagaIterator {
    const state: RootState = (yield select()) as any;
    const { searchForm } = state;
    const { fromValue, toValue, passengers, time } = searchForm;

    if (fromValue && toValue) {
        const json: PersistentSearch = {
            fromValue: fromValue.id,
            fromInputValue: fromValue.name,
            toValue: toValue.id,
            toInputValue: toValue.name,
            passengers,
            time,
        };

        window.localStorage.setItem('searchForm', JSON.stringify(json));
    }
}

export function* watchPersistentSearch(): SagaIterator {
    if (process.browser) {
        yield all([
            takeLatest(PERSIST_SEARCH_FORM, persistState),
            takeLatest(SUCCESS_RIDES, saveState),
        ]);
    }
}
