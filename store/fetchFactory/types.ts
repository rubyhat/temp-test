export type FetchState<D = null> = {
    data: D;
    status: FetchStatus | null;
    error: Error | null;
    userInput: string;
};

export type FetchStatus =
    | typeof FETCH_FETCHING
    | typeof FETCH_SUCCESS
    | typeof FETCH_ERROR;

export const FETCH_FETCHING = 'FETCH_FETCHING';
export const FETCH_SUCCESS = 'FETCH_SUCCESS';
export const FETCH_ERROR = 'FETCH_ERROR';

export type FetchFetchingAction = {
    name: string;
    type: typeof FETCH_FETCHING;
};

export type FetchSuccessAction<P> = {
    name: string;
    type: typeof FETCH_SUCCESS;
    payload: {
        data: P;
        userInput: string;
    };
};

export type FetchErrorAction = {
    name: string;
    type: typeof FETCH_ERROR;
    payload: Error;
};

export type FetchActionTypes<P = any> =
    | FetchFetchingAction
    | FetchSuccessAction<P>
    | FetchErrorAction;
