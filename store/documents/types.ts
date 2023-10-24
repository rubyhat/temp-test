import { PersonalDataDto } from 'swagger/client';

export type DocumentsState = {
    documents: PersonalDataDto[];
    status: DocumentStatuses | null;
    error: Error | null;
};

export type DocumentStatuses =
    | typeof DOCUMENTS_FETCHING
    | typeof DOCUMENTS_SUCCESS
    | typeof DOCUMENTS_ERROR
    | typeof DOCUMENT_DELETING;

export const DOCUMENTS_FETCHING = 'DOCUMENTS_FETCHING';
export const DOCUMENTS_SUCCESS = 'DOCUMENTS_SUCCESS';
export const DOCUMENTS_ERROR = 'DOCUMENTS_ERROR';

export const DOCUMENT_DELETING = 'DOCUMENT_DELETING';

export type DocumentsFetchingAction = {
    type: typeof DOCUMENTS_FETCHING;
};

export type DocumentsSuccessAction = {
    type: typeof DOCUMENTS_SUCCESS;
    payload: PersonalDataDto[];
};

export type DocumentsErrorAction = {
    type: typeof DOCUMENTS_ERROR;
    payload: Error;
};

export type DocumentsDeletingAction = {
    type: typeof DOCUMENT_DELETING;
    payload: {
        document: PersonalDataDto;
    };
};

export type DocumentsActionTypes =
    | DocumentsFetchingAction
    | DocumentsSuccessAction
    | DocumentsErrorAction
    | DocumentsDeletingAction;
