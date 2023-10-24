import { SagaIterator } from 'redux-saga';
import { RootState } from 'store';
import { all, takeLatest, select } from 'redux-saga/effects';
import Router from 'next/router';
import { SearchQuery } from 'store/last-search/types';
import {
    CHANGE_SEARCH_FORM,
    SWITCH_SEARCH_FORM,
} from 'store/search-form/types';
import { routerPushSeoPage } from 'utils/routerPushSeoPage';
import { seoPrefix } from 'utils/seoPrefix';
import { isCordova } from 'utils/platform';

function* changeSearchForm(): SagaIterator {
    const state: RootState = ((yield select()) as unknown) as RootState;
    const {
        date,
        fromValue,
        toValue,
        passengers,
        time,
        fromInputValue,
        toInputValue,
    } = state.searchForm;
    const { country } = state.country;
    const { status } = state.searchRides;
    if (
        date &&
        fromValue &&
        toValue &&
        passengers &&
        fromInputValue &&
        toInputValue &&
        status
    ) {
        if (isCordova) {
            // Саджест не закрывается в приложении (useDialogHash)
            // https://tracker.yandex.ru/ATLASDEV-919
            //
            // Грязный трюк чтобы поменять порядок событий
            // hashChangeComplete и Router.push.
            setTimeout(() => {
                const queryObj: SearchQuery = {
                    from: fromValue.id,
                    to: toValue.id,
                    date: date,
                    passengers: Number(passengers),
                    fromName: fromValue.name,
                    toName: toValue.name,
                };
                if (time) {
                    queryObj['time'] = time;
                }
                Router.push(
                    {
                        pathname: '/search',
                        query: queryObj,
                    },
                    undefined,
                    { shallow: true }
                );
            });
        } else {
            const queryObj: any = {
                from: fromValue,
                to: toValue,
                date,
                passengers,
            };
            if (time) {
                queryObj['time'] = time;
            }
            routerPushSeoPage(Router, queryObj, seoPrefix[country]);
        }
    }
}

export function* watchSearchForm(): SagaIterator {
    yield all([
        takeLatest([CHANGE_SEARCH_FORM, SWITCH_SEARCH_FORM], changeSearchForm),
    ]);
}
