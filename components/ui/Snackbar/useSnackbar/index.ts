import React, {
    Context,
    Dispatch,
    Reducer,
    ReducerAction,
    ReducerState,
} from 'react';
import { SnackbarAction, SnackbarState } from '../snackbarReducer';
import { initialState } from '../snackbarReducer';

type SnackbarReducer = Reducer<SnackbarState, SnackbarAction>;

const SnackbarContext: Context<
    [ReducerState<SnackbarReducer>, Dispatch<ReducerAction<SnackbarReducer>>]
> = React.createContext([
    initialState,
    _ => console.error('No Snackbar context'),
]);
const useSnackBar = () => React.useContext(SnackbarContext);

export { SnackbarContext };
export default useSnackBar;
