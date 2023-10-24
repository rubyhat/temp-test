import {
    CARD_DELETING,
    CARDS_ERROR,
    CARDS_FETCHING,
    CARDS_SUCCESS,
    CardsActionTypes,
} from './types';
import { CardDto } from 'swagger/client';

export const cardsFetching = (): CardsActionTypes => ({
    type: CARDS_FETCHING,
});

export const cardsSuccess = (cards: CardDto[]): CardsActionTypes => ({
    type: CARDS_SUCCESS,
    payload: cards,
});

export const cardsError = (error: Error): CardsActionTypes => ({
    type: CARDS_ERROR,
    payload: error,
});

export const cardDelete = (cardId: string | number): CardsActionTypes => ({
    type: CARD_DELETING,
    payload: {
        cardId,
    },
});
