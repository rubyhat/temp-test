import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Sentry from '@sentry/browser';
import { Severity } from '@sentry/browser';

import useSnackBar from 'components/ui/Snackbar/useSnackbar';

import {
    submitReview,
    SubmitReviewState,
    SubmitReviewStatus,
} from 'store/reviews/submit-review';
import { ReviewOrdersState } from 'store/reviews/review-orders';
import {
    answersToDto,
    resetReviewAnswers,
    ReviewAnswersState,
} from 'store/reviews/review-answers';
import {
    skipReview,
    SkipReviewState,
    SkipReviewStatus,
} from 'store/reviews/skip-review';
import { RootState } from 'store/index';
import { OrderDto } from 'swagger/client';
import { useTranslation } from 'i18n';

export type UseReviewStateProps = {
    onClose?: () => void;
};

export function useReviewState(props: UseReviewStateProps) {
    const { onClose } = props;

    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [, snackbar] = useSnackBar();

    // Orders to review
    const { orders } = useSelector<RootState, ReviewOrdersState>(
        rootState => rootState.reviewOrders
    );
    const order: OrderDto | undefined =
        Array.isArray(orders) && orders.length ? orders[0] : undefined;

    // Star rating
    const [stars, setStars] = useState<number | null>(null);
    useEffect(() => {
        // Five star rating can not contain bad reviews
        if (stars === 5) {
            dispatch(resetReviewAnswers());
        }
    }, [stars]);

    // Submit review
    const { status: submitReviewStatus } = useSelector<
        RootState,
        SubmitReviewState
    >(rootState => rootState.submitReview);

    useEffect(() => {
        if (submitReviewStatus === SubmitReviewStatus.SUCCESS) {
            const snackbarTimeout = 1500;

            snackbar({
                type: 'show',
                payload: {
                    message: t('sendReviewSuccess'),
                    variant: 'success',
                    timeout: snackbarTimeout,
                },
            });

            // Ровно столько отображается Snackbar
            setTimeout(() => {
                onClose && onClose();
            }, snackbarTimeout);
        } else if (submitReviewStatus === SubmitReviewStatus.ERROR) {
            snackbar({
                type: 'show',
                payload: {
                    message: t('sendReviewErrorReasonUnknown'),
                    variant: 'alert',
                },
            });
        }
    }, [submitReviewStatus]);

    const handleSubmitReview = () => {
        if (!order) {
            Sentry.captureMessage(
                'handleSubmitReview: `order` is undefined',
                Severity.Error
            );
            return;
        }

        if (stars === null) {
            Sentry.captureMessage(
                'handleSubmitReview: `stars` is null',
                Severity.Error
            );
            return;
        }

        dispatch(
            submitReview(
                {
                    orderId: order.id,
                    dislikes: answersToDto(answers),
                    comment,
                    rate: stars,
                },
                order
            )
        );
    };

    // Skip review
    const { status: skipReviewStatus } = useSelector<
        RootState,
        SkipReviewState
    >(rootState => rootState.skipReview);

    useEffect(() => {
        if (
            skipReviewStatus === SkipReviewStatus.SUCCESS ||
            skipReviewStatus === SkipReviewStatus.ERROR
        ) {
            onClose && onClose();
        }
    }, [skipReviewStatus]);

    const handleSkipReview = () => {
        if (!order) {
            Sentry.captureMessage(
                'handleSkipReview: `order` is undefined',
                Severity.Error
            );
            return;
        }

        dispatch(skipReview(order.id));
    };

    // Comment
    const [commentDialogOpen, setCommentDialogOpen] = useState(false);
    const handleCommentDialogClose = () => {
        setCommentDialogOpen(false);
    };

    const { answers, comment } = useSelector<RootState, ReviewAnswersState>(
        rootState => rootState.reviewAnswers
    );

    // Helpers
    const submitButtonDisabled =
        submitReviewStatus === SubmitReviewStatus.SUBMITTING ||
        submitReviewStatus === SubmitReviewStatus.SUCCESS;
    const skipButtonDisabled =
        skipReviewStatus === SkipReviewStatus.SKIPPING ||
        skipReviewStatus === SkipReviewStatus.SUCCESS;

    return {
        orders,
        order,

        stars,
        setStars,

        submitReviewStatus,
        handleSubmitReview,
        submitButtonDisabled,

        skipReviewStatus,
        handleSkipReview,
        skipButtonDisabled,

        commentDialogOpen,
        setCommentDialogOpen,
        handleCommentDialogClose,
        answers,
        comment,
    };
}
