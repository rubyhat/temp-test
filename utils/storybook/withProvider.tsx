import React from 'react';
import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@material-ui/core/styles';

import theme from 'themes/default';
import { CssBaseline } from 'components/CssBaseline';
import { rootReducer } from 'store';

const store = createStore(rootReducer, undefined, composeWithDevTools());

export const withProvider = (fn: Function) => {
    return (
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <CssBaseline />

                {fn()}
            </ThemeProvider>
        </Provider>
    );
};
