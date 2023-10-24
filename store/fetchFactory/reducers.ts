import {
    FETCH_ERROR,
    FETCH_FETCHING,
    FETCH_SUCCESS,
    FetchActionTypes,
    FetchState,
} from './types';

export function fetchFactory<D>(
    reducerName: string,
    initialState: FetchState<D>
): (
    state: FetchState<D> | undefined,
    action: FetchActionTypes<D>
) => FetchState<D> {
    function fetchReducer(
        state: FetchState<D> = initialState,
        action: FetchActionTypes<D>
    ): FetchState<D> {
        if (reducerName !== action.name) return state;

        switch (action.type) {
            case FETCH_FETCHING: {
                return {
                    ...state,
                    status: FETCH_FETCHING,
                    error: null,
                };
            }
            case FETCH_SUCCESS: {
                const { data, userInput } = action.payload;

                return {
                    ...state,
                    status: FETCH_SUCCESS,
                    data,
                    userInput,
                };
            }
            case FETCH_ERROR: {
                return {
                    ...state,
                    status: FETCH_ERROR,
                    error: action.payload,
                };
            }
            default:
                return state;
        }
    }

    fetchReducer.displayName = `${reducerName}FetchReducer`;

    return fetchReducer;
}
