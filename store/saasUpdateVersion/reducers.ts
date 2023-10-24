import {
    SaasUpdateVersionActionTypes,
    SaasUpdateVersionState,
    VERSION_LOADED,
    VERSION_LOADED_ERROR,
} from 'store/saasUpdateVersion/types';

const initialState: SaasUpdateVersionState = {
    recommended: '',
    forced: '',
};

export const saasUpdateVersionReducer = (
    state: SaasUpdateVersionState = initialState,
    action: SaasUpdateVersionActionTypes
): SaasUpdateVersionState => {
    switch (action.type) {
        case VERSION_LOADED: {
            return { ...state, ...action.payload };
        }
        case VERSION_LOADED_ERROR: {
            return state;
        }
        default: {
            return state;
        }
    }
};
