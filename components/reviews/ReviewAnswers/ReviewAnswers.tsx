import React, { FC } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

import { ReviewAnswer } from './ReviewAnswer';
import { ReviewOrdersState } from 'store/reviews/review-orders';
import { RootState } from 'store';

const useStyles = makeStyles(
    theme => ({
        /* Styles applied to the root element. */
        root: {},
        ReviewAnswer: {
            '& ~ &': {
                marginTop: theme.spacing(1),
            },
        },
    }),
    { name: 'ReviewAnswers' }
);

type ReviewAnswersProps = {
    className?: string;
};

export const ReviewAnswers: FC<ReviewAnswersProps> = props => {
    const { className } = props;
    const classes = useStyles();
    const { reviewSettings } = useSelector<RootState, ReviewOrdersState>(
        rootState => rootState.reviewOrders
    );

    if (!reviewSettings) return null;

    return (
        <div className={clsx(classes.root, className)}>
            {reviewSettings.dislikes.map(dislike => (
                <ReviewAnswer
                    className={classes.ReviewAnswer}
                    key={dislike.code}
                    code={dislike.code}
                    value={dislike.title}
                />
            ))}
        </div>
    );
};
