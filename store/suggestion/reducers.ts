import { fetchFactory } from '../fetchFactory/reducers';
import { SuggestResultDto } from 'swagger/client';
import { SuggestionState } from './types';

const initialState: SuggestionState = {
    data: [],
    status: null,
    error: null,
    userInput: '',
};

export const suggestionFromReducer = fetchFactory<SuggestResultDto[]>(
    'suggestionFrom',
    initialState
);

export const suggestionToReducer = fetchFactory<SuggestResultDto[]>(
    'suggestionTo',
    initialState
);
