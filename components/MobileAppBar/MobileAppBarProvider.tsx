import React, {
    Context,
    Dispatch,
    FC,
    ReactNode,
    Reducer,
    ReducerAction,
    ReducerState,
    useReducer,
} from 'react';
import { SvgIconProps } from '@material-ui/core/SvgIcon';

export type MobileAppBarState = {
    title: string;
    subtitle: string;
    disableBackIcon: boolean;
    actionIcon: FC<SvgIconProps> | null;
    onClickAction: (() => void) | null;
};

type Props = {
    children: ReactNode;
};

type MobileAppBarActionType = 'replace';

export type MobileAppBarAction = {
    type: MobileAppBarActionType;
    payload: Partial<MobileAppBarState>;
};

export const initialState: MobileAppBarState = {
    title: '',
    subtitle: '',
    disableBackIcon: false,
    actionIcon: null,
    onClickAction: null,
};

type MobileAppBarReducer = Reducer<MobileAppBarState, MobileAppBarAction>;
export const MobileAppBarContext: Context<
    [
        ReducerState<MobileAppBarReducer>,
        Dispatch<ReducerAction<MobileAppBarReducer>>
    ]
> = React.createContext([
    initialState,
    _ => console.error('No MobileAppBar context'),
]);

const reducer = (state: MobileAppBarState, action: MobileAppBarAction) => {
    switch (action.type) {
        case 'replace': {
            return {
                ...initialState,
                ...action.payload,
            };
        }
        default:
            return state;
    }
};

const MobileAppBarProvider: FC<Props> = props => {
    const { children } = props;

    return (
        <MobileAppBarContext.Provider value={useReducer(reducer, initialState)}>
            {children}
        </MobileAppBarContext.Provider>
    );
};

export default MobileAppBarProvider;
