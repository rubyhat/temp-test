import { Middleware } from 'redux';
import { NextJSContext } from 'next-redux-wrapper';
import Cookies from 'universal-cookie';
import get from 'lodash/get';
import set from 'lodash/set';
import merge from 'lodash/merge';

import { RootState } from 'store';

type Paths = Record<string, string>;
type MiddlewareFactory = (paths: Paths) => Middleware;

/**
 * Parse cookies on client and server side and merge with initialState.
 * @param initialState
 * @param cookiePaths
 * @param req
 */
export const getStateWithCookies = (
    initialState: RootState,
    cookiePaths: Record<string, any>,
    req: NextJSContext['req'] | null
) => {
    let cookies: Cookies;
    const stateFromCookies = {};

    // if isServer, then parse cookies from Headers
    if (!process.browser) {
        if (req) {
            cookies = new Cookies(req.headers.cookie);
        } else {
            // when is server but `req = null`,
            // just return initialState
            return initialState;
        }
    } else {
        // parse cookies on client
        cookies = new Cookies();
    }

    Object.entries(cookiePaths).map(([storePath, cookieName]) => {
        const cookieValue = cookies.get(cookieName);

        set(stateFromCookies, storePath, cookieValue);
    });

    return merge(initialState, stateFromCookies);
};

/**
 * Sync redux store with cookies.
 * @param paths
 */
export const cookiesMiddleware: MiddlewareFactory = paths => {
    const cookies = new Cookies();

    return store => dispatch => action => {
        const prevState = store.getState();
        dispatch(action);
        const nextState = store.getState();

        Object.entries(paths).map(([storePath, cookieName]) => {
            const prevStateValue = get(prevState, storePath);
            const nextStateValue = get(nextState, storePath);

            if (prevStateValue !== nextStateValue) {
                cookies.set(cookieName, nextStateValue);
            }
        });
    };
};
