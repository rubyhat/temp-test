import {
    FetchActionTypes,
    FetchFetchingAction,
    FetchState,
} from '../fetchFactory/types';
import { SuggestResultDto } from 'swagger/client';

export type SuggestionState = FetchState<SuggestResultDto[]>;
export type SuggestionFetchingAction = FetchFetchingAction & {
    query: string;
};
export type SuggestionActionTypes =
    | Exclude<FetchActionTypes<SuggestResultDto[]>, FetchFetchingAction>
    | SuggestionFetchingAction;
