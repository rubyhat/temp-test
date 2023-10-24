import { CountryCode } from 'utils/country';

type FeedbackFormStatuses =
    | typeof FEEDBACK_FORM_SENDING
    | typeof FEEDBACK_FORM_SUCCESS
    | typeof FEEDBACK_FORM_ERROR;
export const FEEDBACK_FORM_SENDING = 'FEEDBACK_FORM_SENDING';
export const FEEDBACK_FORM_SUCCESS = 'FEEDBACK_FORM_SUCCESS';
export const FEEDBACK_FORM_ERROR = 'FEEDBACK_FORM_ERROR';

export const ZAMMAD_CHAT_IS_LOAD = 'ZAMMAD_CHAT_IS_LOAD';
export const IS_OPEN_MODAL = 'IS_OPEN_MODAL';
export const SEND_FEEDBACK_FORM = 'SEND_FEEDBACK_FORM';
export const FEEDBACK_FORM_UPDATE_STATE = 'FEEDBACK_FORM_UPDATE_STATE';
export const FEEDBACK_FORM_RESET_STATE = 'FEEDBACK_FORM_RESET_STATE';

interface FeedbackFormFile {
    filename: string;
    ['mime-type']: string;
    data: string;
    size: string;
}

export interface FeedbackFormData {
    firstname: string;
    lastname: string;
    mobile: string;
    email: string;
    domain: CountryCode | 'app';
    text: string;
    attachments: FeedbackFormFile[];
    brandName: string;
}
export type WidgetState = {
    isOpen: boolean;
    firstname: string;
    lastname: string;
    mobile: string;
    email: string;
    domain: CountryCode | 'app';
    text: string;
    attachments: FeedbackFormFile[];
    feedbackStatus: FeedbackFormStatuses | null;
    zammadChatIsLoad: boolean;
    brandName: string;
};

export type IsOpenModal = {
    type: typeof IS_OPEN_MODAL;
    payload: boolean;
};

export type SendFeedbackForm = {
    type: typeof SEND_FEEDBACK_FORM;
};

export type ResetFeedbackForm = {
    type: typeof FEEDBACK_FORM_RESET_STATE;
};

type FeedbackFormUpdateState = {
    type: typeof FEEDBACK_FORM_UPDATE_STATE;
    payload: Partial<WidgetState>;
};

export type ZammadChatIsLoad = {
    type: typeof ZAMMAD_CHAT_IS_LOAD;
    payload: boolean;
};

export type WidgetActionTypes =
    | IsOpenModal
    | SendFeedbackForm
    | ResetFeedbackForm
    | FeedbackFormUpdateState
    | ZammadChatIsLoad;
