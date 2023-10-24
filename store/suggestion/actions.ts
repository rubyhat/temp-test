import { FETCH_FETCHING } from '../fetchFactory/types';
import { SuggestionActionTypes } from './types';

export const suggestionFetch = (
    name: string,
    query: string
): SuggestionActionTypes => ({
    name,
    type: FETCH_FETCHING,
    query,
});
