import React, { FC } from 'react';
import clsx from 'clsx';
import { fade, makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';

import {
    ReviewAnswersState,
    toggleReviewAnswer,
} from 'store/reviews/review-answers';
import { RootState } from 'store';

const useStyles = makeStyles(
    theme => ({
        /* Styles applied to the root element. */
        root: {
            borderRadius: 100,
            borderColor: fade(theme.palette.text.disabled, 0.16),
            borderWidth: 2,
            borderStyle: 'solid',

            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1),
            paddingRight: theme.spacing(2),
            paddingLeft: theme.spacing(2),

            fontWeight: 700,
            display: 'inline-block',
            cursor: 'pointer',
            '-webkit-tap-highlight-color': 'transparent',
        },
        selected: {
            borderColor: theme.palette.primary.main,
            backgroundColor: fade(theme.palette.primary.main, 0.08),
        },
    }),
    { name: 'ReviewAnswer' }
);

type ReviewAnswerProps = {
    value: string;
    code: string;
    className?: string;
};

export const ReviewAnswer: FC<ReviewAnswerProps> = props => {
    const { value, className, code } = props;
    const classes = useStyles();
    const dispatch = useDispatch();

    const { answers } = useSelector<RootState, ReviewAnswersState>(
        rootState => rootState.reviewAnswers
    );
    const answer = !!answers[code];

    return (
        <span
            className={clsx(classes.root, className, {
                [classes.selected]: answer,
            })}
            onClick={() => dispatch(toggleReviewAnswer(code, !answer))}
        >
            {value}
        </span>
    );
};
