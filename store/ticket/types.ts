export type TicketState = {
    status: TicketStatuses | null;
    error: Error | null;
};

export type TicketStatuses =
    | typeof TICKET_CANCEL
    | typeof TICKET_SUCCESS
    | typeof TICKET_ERROR;

export const TICKET_CANCEL = 'TICKET_CANCEL';
export const TICKET_SUCCESS = 'TICKET_SUCCESS';
export const TICKET_ERROR = 'TICKET_ERROR';
export const TICKET_RESET = 'TICKET_RESET';

export type TicketFetchingAction = {
    type: typeof TICKET_CANCEL;
    payload: {
        ticketId: string;
    };
};

type TicketSuccessAction = {
    type: typeof TICKET_SUCCESS;
};

type TicketErrorAction = {
    type: typeof TICKET_ERROR;
    payload: Error;
};

type TicketResetAction = {
    type: typeof TICKET_RESET;
};

export type TicketActionTypes =
    | TicketFetchingAction
    | TicketSuccessAction
    | TicketErrorAction
    | TicketResetAction;
