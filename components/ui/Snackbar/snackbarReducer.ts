export type Variant = 'success' | 'alert' | 'error';

export type SnackbarState = {
    open: boolean;
    message: string;
    variant: Variant;
    timeout: number | null;
    hideAction?: boolean;
};

export type SnackbarAction = {
    type: SnackbarActionType;
    payload: Partial<SnackbarState>;
};

type SnackbarActionType = 'show' | 'close';

export const initialState: SnackbarState = {
    open: false,
    message: '',
    variant: 'success',
    timeout: 2500,
    hideAction: false,
};

export const reducer = (state: SnackbarState, action: SnackbarAction) => {
    switch (action.type) {
        case 'show':
            return {
                ...initialState,
                ...action.payload,
                open: true,
            };
        case 'close':
            return {
                ...state,
                open: false,
            };
        default:
            return state;
    }
};
