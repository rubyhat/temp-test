import {
    DOCUMENT_DELETING,
    DOCUMENTS_ERROR,
    DOCUMENTS_FETCHING,
    DOCUMENTS_SUCCESS,
    DocumentsActionTypes,
} from './types';
import { PersonalDataDto } from 'swagger/client';

export const documentsFetch = (): DocumentsActionTypes => ({
    type: DOCUMENTS_FETCHING,
});

export const documentsSuccess = (
    documents: PersonalDataDto[]
): DocumentsActionTypes => ({
    type: DOCUMENTS_SUCCESS,
    payload: documents,
});

export const documentsError = (err: Error): DocumentsActionTypes => ({
    type: DOCUMENTS_ERROR,
    payload: err,
});

export const documentDelete = (
    document: PersonalDataDto
): DocumentsActionTypes => ({
    type: DOCUMENT_DELETING,
    payload: {
        document,
    },
});
