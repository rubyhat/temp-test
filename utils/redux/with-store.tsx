import NextApp from 'next/app';
import withRedux from 'next-redux-wrapper';
import nextReduxSaga from 'next-redux-saga';

import { Store, makeStore } from 'store';

declare global {
    interface Window {
        __NEXT_REDUX_STORE__?: Store;
        cordova: Cordova;
    }
}

declare module 'next/dist/next-server/lib/utils' {
    interface NextPageContext {
        store: Store;
    }
}

export function withReduxSaga(BaseComponent: typeof NextApp) {
    return withRedux(makeStore)(nextReduxSaga(BaseComponent));
}
