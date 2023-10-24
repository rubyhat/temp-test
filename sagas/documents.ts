import { SagaIterator } from 'redux-saga';
import { takeLatest, call, put, all } from 'redux-saga/effects';
import * as Sentry from '@sentry/browser';

import {
    DOCUMENT_DELETING,
    DOCUMENTS_FETCHING,
    DocumentsDeletingAction,
} from 'store/documents/types';
import { documentsError, documentsSuccess } from 'store/documents/actions';
import apiClient from 'lib/apiClient';

export function* fetchDocuments(): SagaIterator {
    try {
        const { data: documents } = yield call(apiClient.getDocuments);

        yield put(documentsSuccess(documents));
    } catch (err) {
        yield put(documentsError(err));
        Sentry.captureException(err);
    }
}

function* deleteDocument(action: DocumentsDeletingAction): SagaIterator {
    try {
        const { document } = action.payload;
        yield call(apiClient.deleteDocument, document);
        yield call(fetchDocuments);
    } catch (err) {
        yield put(documentsError(err));
        Sentry.captureException(err);
    }
}

export function* watchDocuments(): SagaIterator {
    yield all([
        takeLatest(DOCUMENTS_FETCHING, fetchDocuments),
        takeLatest(DOCUMENT_DELETING, deleteDocument),
    ]);
}
