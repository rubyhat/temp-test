import { CardDto } from 'swagger/client';

export type CardsState = {
    cards: CardDto[];
    status: CardsStatuses | null;
    error: Error | null;
};

export type CardsStatuses =
    | typeof CARDS_FETCHING
    | typeof CARDS_SUCCESS
    | typeof CARDS_ERROR
    | typeof CARD_DELETING;

export const CARDS_FETCHING = 'CARDS_FETCHING';
export const CARDS_SUCCESS = 'CARDS_SUCCESS';
export const CARDS_ERROR = 'CARDS_ERROR';
export const CARD_DELETING = 'CARD_DELETING';

export type CardsFetchingAction = {
    type: typeof CARDS_FETCHING;
};

export type CardsSuccessAction = {
    type: typeof CARDS_SUCCESS;
    payload: CardDto[];
};

export type CardsErrorAction = {
    type: typeof CARDS_ERROR;
    payload: Error;
};

export type CardDeletingAction = {
    type: typeof CARD_DELETING;
    payload: {
        cardId: string | number;
    };
};

export type CardsActionTypes =
    | CardsFetchingAction
    | CardsSuccessAction
    | CardsErrorAction
    | CardDeletingAction;
