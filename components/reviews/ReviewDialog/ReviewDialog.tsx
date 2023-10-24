import React, { FC } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Collapse from '@material-ui/core/Collapse';
import parseISO from 'date-fns/parseISO';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { Button } from 'components/ui/Button';
import { CommentEditor } from 'components/reviews/CommentEditor';
import { CommentRadioButton } from 'components/reviews/CommentRadioButton';
import { ModalBottomSheet } from 'components/ui/ModalBottomSheet';
import { Rating } from 'components/ui/Rating';
import { ReviewAnswers } from 'components/reviews/ReviewAnswers';
import { ReviewCommentDialog } from 'components/reviews/ReviewCommentDialog';
import { SkipReviewStatus } from 'store/reviews/skip-review';
import { Snackbar } from 'components/ui/Snackbar/Snackbar';
import { SubmitReviewStatus } from 'store/reviews/submit-review';
import { Typo } from 'components/Typo/Typo';
import { format } from 'utils/date';
import { useReviewState } from 'store/reviews/hooks';
import { useTranslation } from 'i18n';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {},
        content: {
            padding: theme.spacing(2),
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
    { name: 'ReviewDialog' }
);

type Props = {
    open: boolean;
    onClose: () => void;
};

export const ReviewDialog: FC<Props> = props => {
    const { open, onClose } = props;
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
    } = useReviewState({
        onClose,
    });

    if (!order || !order.rideInfo) return null;

    return (
        <ModalBottomSheet
            className={classes.root}
            open={open}
            onClose={onClose}
            DialogProps={{
                BackdropProps: {
                    invisible: true,
                },
            }}
        >
            <div className={classes.content}>
                <Typo variant="subtitle" weight="bold">
                    {t('rateQuestion', {
                        from: order.rideInfo.from.desc,
                        to: order.rideInfo.to.desc,
                        date: format(
                            parseISO(order.rideInfo.departure),
                            'd MMMM'
                        ),
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
                        {submitReviewStatus ===
                        SubmitReviewStatus.SUBMITTING ? (
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

            <Snackbar />
        </ModalBottomSheet>
    );
};
