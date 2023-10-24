import React, { FC } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

import { Button } from 'components/ui/Button';
import { useTranslation } from 'i18n';

const useStyles = makeStyles(
    theme => ({
        /* Styles applied to the root element. */
        root: {},
        comment: {},
        divider: {
            paddingLeft: theme.spacing(1),
        },
        editButton: {
            minHeight: 'unset',
            minWidth: 'unset',
            paddingTop: 0,
            paddingBottom: 0,
            paddingLeft: theme.spacing(1),
            paddingRight: theme.spacing(1),
            textTransform: 'lowercase',

            '&:hover, &:active': {
                backgroundColor: 'unset',
            },
        },
    }),
    { name: 'CommentEditor' }
);

type CommentEditorProps = {
    className?: string;
    comment: string;
    onEdit: () => void;
};

export const CommentEditor: FC<CommentEditorProps> = props => {
    const { className, comment, onEdit } = props;
    const classes = useStyles();
    const { t } = useTranslation();

    return (
        <div className={clsx(classes.root, className)}>
            <span>{comment}</span>

            <span className={classes.divider}>—</span>

            <Button
                className={classes.editButton}
                size="small"
                color="primary"
                variant="text"
                disableRipple
                disableFocusRipple
                disableTouchRipple
                onClick={onEdit}
            >
                {t('edit')}
            </Button>
        </div>
    );
};
