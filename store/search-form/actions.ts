import {
    CHANGE_SEARCH_FORM,
    INIT_SEARCH_FORM,
    INPUT_CHANGE_SEARCH_FORM,
    InputChangeSearchFormAction,
    PERSIST_SEARCH_FORM,
    SearchFormActionTypes,
    SearchFormState,
    SWITCH_SEARCH_FORM,
    RESET_SEARCH_FORM,
} from './types';

export const changeSearchForm = (
    payload: Partial<SearchFormState>
): SearchFormActionTypes => ({
    type: CHANGE_SEARCH_FORM,
    payload,
});

export const inputChangeSearchForm = (
    payload: InputChangeSearchFormAction['payload']
): SearchFormActionTypes => ({
    type: INPUT_CHANGE_SEARCH_FORM,
    payload,
});

export const initSearchForm = (
    payload: Partial<SearchFormState>
): SearchFormActionTypes => ({
    type: INIT_SEARCH_FORM,
    payload,
});

export const resetSearchForm = (): SearchFormActionTypes => ({
    type: RESET_SEARCH_FORM,
});

export const switchSearchForm = (): SearchFormActionTypes => ({
    type: SWITCH_SEARCH_FORM,
});

export const persistSearchForm = (): SearchFormActionTypes => ({
    type: PERSIST_SEARCH_FORM,
});
