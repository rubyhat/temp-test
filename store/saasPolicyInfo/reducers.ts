import {
    PolicyActionTypes,
    PolicyState,
    POLICY_LOADED,
    POLICY_LOADED_ERROR,
} from 'store/saasPolicyInfo/types';
import { Reducer } from 'redux';

const initialState: PolicyState = {
    id: '',
    link: '',
    version: '',
    isActive: false,
    titleMain: '',
    countryCodes: [],
    titleSecondery: '',
};

export const policyReducer: Reducer<PolicyState, PolicyActionTypes> = (
    state: PolicyState = initialState,
    action: PolicyActionTypes
): PolicyState => {
    switch (action.type) {
        case POLICY_LOADED: {
            return { ...state, ...action.payload };
        }
        case POLICY_LOADED_ERROR: {
            return initialState;
        }
        default:
            return state;
    }
};
