import { SuggestResultDto } from 'swagger/client';

// При автозаполнении формы когда данные берутся из QueryParams.
// Будут доступны только `id` и `name`.
type PartialSuggestResultDto = Pick<SuggestResultDto, 'id' | 'name'> &
    Partial<Pick<SuggestResultDto, 'description' | 'country'>>;
export type Suggestion = SuggestResultDto | PartialSuggestResultDto;

export type SearchFormState = {
    fromValue: Suggestion | null;
    fromInputValue: string;
    toValue: Suggestion | null;
    toInputValue: string;
    date?: string;
    time?: string;
    passengers: string;
};

export const CHANGE_SEARCH_FORM = 'CHANGE_SEARCH_FORM';
export const INPUT_CHANGE_SEARCH_FORM = 'INPUT_CHANGE_SEARCH_FORM';
export const INIT_SEARCH_FORM = 'INIT_SEARCH_FORM';
export const SWITCH_SEARCH_FORM = 'SWITCH_SEARCH_FORM';
export const PERSIST_SEARCH_FORM = 'PERSIST_SEARCH_FORM';
export const RESET_SEARCH_FORM = 'RESET_SEARCH_FORM';

export type ChangeSearchFormAction = {
    type: typeof CHANGE_SEARCH_FORM;
    payload: Partial<SearchFormState>;
};

export type InputChangeSearchFormAction = {
    type: typeof INPUT_CHANGE_SEARCH_FORM;
    payload: Partial<Pick<SearchFormState, 'fromInputValue' | 'toInputValue'>>;
};

type InitSearchFormAction = {
    type: typeof INIT_SEARCH_FORM;
    payload: Partial<SearchFormState>;
};

type ResetSearchFormAction = {
    type: typeof RESET_SEARCH_FORM;
};

type SwitchSearchFormAction = {
    type: typeof SWITCH_SEARCH_FORM;
};

type PersistSearchFormAction = {
    type: typeof PERSIST_SEARCH_FORM;
};

export type SearchFormActionTypes =
    | ChangeSearchFormAction
    | InputChangeSearchFormAction
    | InitSearchFormAction
    | SwitchSearchFormAction
    | PersistSearchFormAction
    | ResetSearchFormAction;
