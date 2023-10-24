import { Suggestion } from '../search-form/types';

export type LastSearchState = {
    lastSearch: LastSearch | null;
};

export type LastSearch = {
    from: Suggestion;
    to: Suggestion;
    date: string;
    passengers: number;
    time?: string;
};

export type SearchQuery = {
    from: string;
    to: string;
    date?: string;
    passengers?: number;
    time?: string;
    fromName: string;
    toName: string;
};

export const SAVE_LAST_SEARCH = 'SAVE_LAST_SEARCH';

type SaveLastSearchAction = {
    type: typeof SAVE_LAST_SEARCH;
    payload: LastSearch;
};

export type LastSearchActionTypes = SaveLastSearchAction;
