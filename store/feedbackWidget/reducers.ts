import {
    WidgetActionTypes,
    WidgetState,
    IS_OPEN_MODAL,
    FEEDBACK_FORM_UPDATE_STATE,
    FEEDBACK_FORM_RESET_STATE,
    ZAMMAD_CHAT_IS_LOAD,
} from 'store/feedbackWidget/types';

const initialState: WidgetState = {
    isOpen: false,
    firstname: '',
    lastname: '',
    mobile: '',
    email: '',
    domain: 'RU',
    text: '',
    attachments: [],
    feedbackStatus: null,
    zammadChatIsLoad: false,
    brandName: '',
};

export const widgetReducer = (
    state: WidgetState = initialState,
    action: WidgetActionTypes
): WidgetState => {
    switch (action.type) {
        case IS_OPEN_MODAL: {
            const isOpen = action.payload;
            return { ...initialState, isOpen };
        }
        case ZAMMAD_CHAT_IS_LOAD: {
            const zammadChatIsLoad = action.payload;
            return { ...initialState, zammadChatIsLoad };
        }
        case FEEDBACK_FORM_UPDATE_STATE: {
            return { ...state, ...action.payload };
        }
        case FEEDBACK_FORM_RESET_STATE: {
            return initialState;
        }
        default:
            return state;
    }
};
