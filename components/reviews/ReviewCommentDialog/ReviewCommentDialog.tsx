import React, { ChangeEvent, FC } from 'react';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';

import {
    changeReviewComment,
    ReviewAnswersState,
} from 'store/reviews/review-answers';
import { Button } from 'components/ui/Button';
import { ResponsiveDialog } from 'components/ui/ResponsiveDialog';
import { RootState } from 'store';
import { TextField } from 'components/ui/TextField/TextField';
import { Typo } from 'components/Typo/Typo';
import { useTranslation } from 'i18n';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            '& .MuiPaper-root': {
                borderRadius: theme.atlas.borderRadius.medium,
            },
        },
        content: {
            padding: theme.spacing(2),
        },
        commentInput: {
            marginTop: theme.spacing(3),
        },
        doneButton: {
            marginTop: theme.spacing(3),
            borderRadius: theme.atlas.borderRadius.high,
        },
    }),
    { name: 'ReviewCommentDialog' }
);

type ReviewCommentDialogProps = {
    open: boolean;
    onClose: () => void;
    className?: string;
};

export const ReviewCommentDialog: FC<ReviewCommentDialogProps> = props => {
    const { open, onClose, className } = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const { comment } = useSelector<RootState, ReviewAnswersState>(
        rootState => rootState.reviewAnswers
    );

    const handleCommentChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        dispatch(changeReviewComment(e.target.value));
    };

    const handleDone = () => {
        onClose();
    };

    // Place cursor at end of the text after focus
    const handleInputRef = (el: HTMLTextAreaElement | null) => {
        if (!el) return;

        el.selectionStart = comment.length;
        el.selectionEnd = comment.length;
    };

    return (
        <ResponsiveDialog
            className={clsx(classes.root, className)}
            open={open}
            onClose={onClose}
            fullScreen={false}
            fullWidth
            position="center"
        >
            <div className={classes.content}>
                <Typo variant="subtitle" weight="bold">
                    {t('reviewCommentDialogTitle')}
                </Typo>

                <TextField
                    className={classes.commentInput}
                    value={comment}
                    onChange={handleCommentChange}
                    placeholder={t('reviewCommentInputPlaceholder')}
                    fullWidth
                    multiline
                    autoFocus
                    inputRef={handleInputRef}
                />

                <Button
                    onClick={handleDone}
                    className={classes.doneButton}
                    variant="contained"
                    color="primary"
                    fullWidth
                >
                    {t('done')}
                </Button>
            </div>
        </ResponsiveDialog>
    );
};
