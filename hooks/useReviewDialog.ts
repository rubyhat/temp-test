import { useEffect, useState } from 'react';
import Cookie from 'universal-cookie';
import { batch, useDispatch, useSelector } from 'react-redux';

import {
    fetchReviewOrders,
    resetReviewOrdersState,
    ReviewOrdersState,
    ReviewOrdersStatus,
} from 'store/reviews/review-orders';
import { OrderDto } from 'swagger/client';
import { RootState } from 'store';
import { resetReviewAnswersState } from 'store/reviews/review-answers';
import { resetSkipReviewState } from 'store/reviews/skip-review';
import { resetSubmitReviewState } from 'store/reviews/submit-review';
import { isDebugging } from 'utils/debugging/storage';

const cookie = new Cookie();

export const REVIEW_COOKIE_KEY = 'review-dialog';

export function getReviewCookie(): boolean {
    return !!cookie.get(REVIEW_COOKIE_KEY);
}

export function setReviewCookie() {
    cookie.set(REVIEW_COOKIE_KEY, true);
}

export function useReviewDialog() {
    const dispatch = useDispatch();

    const [open, setOpen] = useState(false);
    const handleClose = () => {
        setOpen(false);
        // Ресетим редюсеры после закрытия диалога
        batch(() => {
            dispatch(resetReviewAnswersState());
            dispatch(resetReviewOrdersState());
            dispatch(resetSubmitReviewState());
            dispatch(resetSkipReviewState());
        });

        // Ставим куку та текущую сессию
        setReviewCookie();
    };

    const reviewState: ReviewOrdersState = useSelector<
        RootState,
        ReviewOrdersState
    >(rootState => rootState.reviewOrders);
    const { orders, status } = reviewState;
    const order: OrderDto | undefined =
        Array.isArray(orders) && orders.length ? orders[0] : undefined;

    useEffect(() => {
        dispatch(fetchReviewOrders());
    }, []);

    useEffect(() => {
        if (status === ReviewOrdersStatus.SUCCESS) {
            setOpen(true);
        }
    }, [status]);

    return {
        open,
        setOpen,
        handleClose,
        order,
        showDialog: order && (!getReviewCookie() || isDebugging('review')),
    };
}
