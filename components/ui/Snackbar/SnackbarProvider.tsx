import React, { FC, ReactNode, useReducer } from 'react';

import { SnackbarContext } from './useSnackbar';
import { initialState, reducer } from './snackbarReducer';

type Props = {
    children: ReactNode;
};

const SnackbarProvider: FC<Props> = props => {
    const { children } = props;

    return (
        <SnackbarContext.Provider value={useReducer(reducer, initialState)}>
            {children}
        </SnackbarContext.Provider>
    );
};

export default SnackbarProvider;
