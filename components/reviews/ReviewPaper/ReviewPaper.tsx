import React, { FC } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Collapse from '@material-ui/core/Collapse';
import clsx from 'clsx';
import parseISO from 'date-fns/parseISO';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { Button } from 'components/ui/Button';
import { CommentEditor } from 'components/reviews/CommentEditor';
import { CommentRadioButton } from 'components/reviews/CommentRadioButton';
import { Rating } from 'components/ui/Rating';
import { ReviewAnswers } from 'components/reviews/ReviewAnswers';
import { ReviewCommentDialog } from 'components/reviews/ReviewCommentDialog';
import { SkipReviewStatus } from 'store/reviews/skip-review';
import { SubmitReviewStatus } from 'store/reviews/submit-review';
import { Typo } from 'components/Typo/Typo';
import { format } from 'utils/date';
import { useReviewState } from 'store/reviews/hooks';
import { useTranslation } from 'i18n';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            padding: theme.spacing(2),
            marginTop: 16,
            marginBottom: 16,
            backgroundColor: theme.palette.common.white,
        },
        ratingContainer: {
            marginTop: theme.spacing(3),
            display: 'flex',
            justifyContent: 'space-around',
        },
        ReviewAnswers: {
            marginTop: theme.spacing(2),
        },
        commentContainer: {},
        CommentEditor: {
            marginTop: theme.spacing(2),
        },
        CommentRadioButton: {
            marginTop: theme.spacing(1),
        },
        rateButton: {
            marginTop: theme.spacing(3),
            borderRadius: theme.atlas.borderRadius.high,
        },
        skipButton: {
            marginTop: theme.spacing(3),
            borderRadius: theme.atlas.borderRadius.high,
        },
    }),
    { name: 'ReviewPaper' }
);

type ReviewPaperProps = {
    className?: string;
};

export const ReviewPaper: FC<ReviewPaperProps> = props => {
    const { className } = props;
    const classes = useStyles();
    const { t } = useTranslation();

    const {
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
        comment,
    } = useReviewState({});

    if (!order || !order.rideInfo) return null;

    return (
        <div className={clsx(classes.root, className)}>
            <Typo variant="subtitle" weight="bold">
                {t('rateQuestion', {
                    from: order.rideInfo.from.desc,
                    to: order.rideInfo.to.desc,
                    date: format(parseISO(order.rideInfo.departure), 'd MMMM'),
                })}
            </Typo>

            <div className={classes.ratingContainer}>
                <Rating
                    value={stars}
                    onChange={(e, newValue) => setStars(newValue)}
                    size="xl"
                />
            </div>

            <Collapse in={stars !== null && stars < 5}>
                <ReviewAnswers className={classes.ReviewAnswers} />
            </Collapse>

            <Collapse in={stars !== null}>
                <div className={classes.commentContainer}>
                    {comment ? (
                        <CommentEditor
                            className={classes.CommentEditor}
                            comment={comment}
                            onEdit={() => setCommentDialogOpen(true)}
                        />
                    ) : (
                        <CommentRadioButton
                            className={classes.CommentRadioButton}
                            onClick={() => setCommentDialogOpen(true)}
                        >
                            {t('leaveComment')}
                        </CommentRadioButton>
                    )}
                </div>
            </Collapse>

            <ReviewCommentDialog
                open={commentDialogOpen}
                onClose={handleCommentDialogClose}
            />

            {stars !== null ? (
                <Button
                    onClick={handleSubmitReview}
                    className={classes.rateButton}
                    color="primary"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={submitButtonDisabled}
                >
                    {submitReviewStatus === SubmitReviewStatus.SUBMITTING ? (
                        <CircularProgress color="inherit" size={18} />
                    ) : (
                        t('rate')
                    )}
                </Button>
            ) : (
                <Button
                    onClick={handleSkipReview}
                    className={classes.skipButton}
                    color="primary"
                    variant="outlined"
                    size="large"
                    fullWidth
                    disabled={skipButtonDisabled}
                >
                    {skipReviewStatus === SkipReviewStatus.SKIPPING ? (
                        <CircularProgress color="inherit" size={18} />
                    ) : (
                        t('skip')
                    )}
                </Button>
            )}
        </div>
    );
};
