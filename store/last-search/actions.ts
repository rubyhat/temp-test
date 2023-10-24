import { LastSearch, LastSearchActionTypes, SAVE_LAST_SEARCH } from './types';

export const saveLastSearch = (payload: LastSearch): LastSearchActionTypes => ({
    type: SAVE_LAST_SEARCH,
    payload,
});
