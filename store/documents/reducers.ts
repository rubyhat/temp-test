import {
    DOCUMENTS_ERROR,
    DOCUMENTS_FETCHING,
    DOCUMENTS_SUCCESS,
    DocumentsActionTypes,
    DocumentsState,
} from './types';

const initialState: DocumentsState = {
    documents: [],
    status: null,
    error: null,
};

export const documentsReducer = (
    state: DocumentsState = initialState,
    action: DocumentsActionTypes
): DocumentsState => {
    switch (action.type) {
        case DOCUMENTS_FETCHING: {
            return {
                ...state,
                documents: [],
                status: DOCUMENTS_FETCHING,
                error: null,
            };
        }
        case DOCUMENTS_SUCCESS: {
            const documents = action.payload;

            return {
                ...state,
                status: DOCUMENTS_SUCCESS,
                documents,
            };
        }
        case DOCUMENTS_ERROR: {
            return {
                ...state,
                status: DOCUMENTS_ERROR,
                error: action.payload,
            };
        }
        default:
            return state;
    }
};
