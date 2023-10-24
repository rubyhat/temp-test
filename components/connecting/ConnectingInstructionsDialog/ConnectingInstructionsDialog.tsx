import React, { FC } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

import { ResponsiveDialog } from 'components/ui/ResponsiveDialog';

const useStyles = makeStyles(
    theme => ({
        /* Styles applied to the root element. */
        root: {},
        /* Styles applied to the html `div` element. */
        html: {
            padding: theme.spacing(2, 3),
            marginBottom: theme.spacing(2),
            '& h1': {
                fontSize: theme.typography.body1.fontSize,
                marginTop: 0,
            },
            '& ul': {
                margin: 0,
                paddingLeft: 0,
                listStyleType: 'disc',
                listStylePosition: 'inside',
            },
            '& li': {
                lineHeight: 1.5,
            },
        },
    }),
    { name: 'ConnectingInstructionsDialog' }
);

type ConnectingInstructionsDialogProps = {
    open: boolean;
    onClose: () => void;
    html: string;
    className?: string;
};

export const ConnectingInstructionsDialog: FC<
    ConnectingInstructionsDialogProps
> = props => {
    const { html, open, onClose, className } = props;
    const classes = useStyles();

    return (
        <ResponsiveDialog
            open={open}
            onClose={onClose}
            className={clsx(classes.root, className)}
        >
            <div
                className={classes.html}
                dangerouslySetInnerHTML={{
                    __html: html,
                }}
            />
        </ResponsiveDialog>
    );
};
