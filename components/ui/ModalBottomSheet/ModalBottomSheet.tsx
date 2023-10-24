import React, { FC, ReactNode } from 'react';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {},
        /* Styles applied to the container element. */
        container: {
            alignItems: 'flex-end', // align dialog to bottom
        },
        /* Styles applied to the `Paper` root component. */
        paper: {
            borderTopLeftRadius: theme.atlas.borderRadius.medium,
            borderTopRightRadius: theme.atlas.borderRadius.medium,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,

            boxShadow: theme.atlas.shadows.fly,
        },
        /* Styles applied to the `Dialog` root component if `fullWidth={true}`. */
        paperFullWidth: {
            margin: theme.spacing(1),
            marginBottom: 0,
            width: 'calc(100% - 16px)', // margin x 2 = 16px
        },
    }),
    { name: 'ModalBottomSheet' }
);

type BottomSheetProps = {
    open: boolean;
    children: ReactNode;
    onClose?: () => void;
    className?: string;
    DialogProps?: Omit<
        DialogProps,
        'open' | 'onClose' | 'children' | 'className'
    >;
};

export const ModalBottomSheet: FC<BottomSheetProps> = props => {
    const { open, onClose, className, children, DialogProps } = props;
    const classes = useStyles();

    return (
        <Dialog
            disableScrollLock
            className={clsx(classes.root, className)}
            classes={{
                container: classes.container,
                paper: classes.paper,
                paperFullWidth: classes.paperFullWidth,
            }}
            fullWidth
            {...DialogProps}
            open={open}
            onClose={onClose}
            BackdropProps={DialogProps && DialogProps.BackdropProps}
        >
            {children}
        </Dialog>
    );
};
