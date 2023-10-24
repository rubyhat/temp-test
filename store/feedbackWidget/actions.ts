import {
    WidgetActionTypes,
    IS_OPEN_MODAL,
    SEND_FEEDBACK_FORM,
    FEEDBACK_FORM_UPDATE_STATE,
    FEEDBACK_FORM_RESET_STATE,
    WidgetState,
    ZAMMAD_CHAT_IS_LOAD,
} from './types';

export const isOpenFormModal = (isOpen: boolean): WidgetActionTypes => ({
    type: IS_OPEN_MODAL,
    payload: isOpen,
});

export const sendFeedbackForm = (): WidgetActionTypes => ({
    type: SEND_FEEDBACK_FORM,
});

export const resetFeedbackForm = (): WidgetActionTypes => ({
    type: FEEDBACK_FORM_RESET_STATE,
});

export const feedbackFormUpdateState = (
    payload: Partial<WidgetState>
): WidgetActionTypes => ({
    type: FEEDBACK_FORM_UPDATE_STATE,
    payload,
});

export const zammadChatIsLoad = (payload: boolean): WidgetActionTypes => ({
    type: ZAMMAD_CHAT_IS_LOAD,
    payload,
});
