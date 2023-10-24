import {
    TICKET_ERROR,
    TICKET_CANCEL,
    TICKET_SUCCESS,
    TICKET_RESET,
    TicketActionTypes,
    TicketState,
} from './types';

const initialState: TicketState = {
    status: null,
    error: null,
};

export const ticketReducer = (
    state: TicketState = initialState,
    action: TicketActionTypes
): TicketState => {
    switch (action.type) {
        case TICKET_CANCEL: {
            return {
                ...state,
                status: TICKET_CANCEL,
                error: null,
            };
        }
        case TICKET_SUCCESS: {
            return {
                ...state,
                status: TICKET_SUCCESS,
            };
        }
        case TICKET_ERROR: {
            return {
                ...state,
                status: TICKET_ERROR,
                error: action.payload,
            };
        }
        case TICKET_RESET: {
            return {
                ...initialState,
            };
        }
        default:
            return state;
    }
};
