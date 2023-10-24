import {
    CHANGE_SEARCH_FORM,
    INIT_SEARCH_FORM,
    INPUT_CHANGE_SEARCH_FORM,
    SearchFormActionTypes,
    SearchFormState,
    SWITCH_SEARCH_FORM,
    RESET_SEARCH_FORM,
} from './types';

const initialState: SearchFormState = {
    fromValue: null,
    fromInputValue: '',
    toValue: null,
    toInputValue: '',
    passengers: '',
};

export const searchFormReducer = (
    state = initialState,
    action: SearchFormActionTypes
): SearchFormState => {
    switch (action.type) {
        case INIT_SEARCH_FORM:
        case INPUT_CHANGE_SEARCH_FORM:
        case CHANGE_SEARCH_FORM: {
            const { payload } = action;
            return {
                ...state,
                ...payload,
            };
        }
        case SWITCH_SEARCH_FORM: {
            return {
                ...state,
                fromValue: state.toValue,
                fromInputValue: state.toInputValue,
                toValue: state.fromValue,
                toInputValue: state.fromInputValue,
            };
        }
        case RESET_SEARCH_FORM: {
            return initialState;
        }
        default:
            return state;
    }
};
