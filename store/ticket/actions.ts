import {
    TICKET_ERROR,
    TICKET_CANCEL,
    TICKET_RESET,
    TICKET_SUCCESS,
    TicketActionTypes,
} from './types';

export const ticketCancel = (ticketId: string): TicketActionTypes => ({
    type: TICKET_CANCEL,
    payload: {
        ticketId,
    },
});

export const ticketSuccess = (): TicketActionTypes => ({
    type: TICKET_SUCCESS,
});

export const ticketError = (error: Error): TicketActionTypes => ({
    type: TICKET_ERROR,
    payload: error,
});

export const ticketReset = (): TicketActionTypes => ({
    type: TICKET_RESET,
});
