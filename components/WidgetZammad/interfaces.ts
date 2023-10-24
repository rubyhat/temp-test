export interface IMsgBlock {
    agreementMessage: string;
    messageTitle: string;
    messageSubmit: string;
    messageThankYou: string;
}

export interface IInputTextBlock {
    name: string;
    email: string;
    msg: string;
    phone: string;
    file?: string;
    btnSubmit?: string;
}
