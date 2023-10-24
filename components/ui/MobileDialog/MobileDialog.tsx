import React, { FC, ReactNode } from 'react';
import Dialog from '@material-ui/core/Dialog';
import Slide, { SlideProps } from '@material-ui/core/Slide';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { AppBar, Props as AppBarProps } from 'components/AppBar';
import { AtlasTheme } from 'typings/atlas-theme';

export type Props = {
    open: boolean;
    onClose: () => void;
    children: ReactNode;
    className?: string;
} & Omit<AppBarProps, 'position' | 'onBack'>;

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        root: {
            '& .MuiDialog-paper': {
                backgroundColor: '#F0F3F5',
            },
        },
        body: {
            height: '100%',
            ...theme.atlas.bottomBar.paddingBottom(0),
        },
    }),
    { name: 'MobileDialog' }
);

const Transition = React.forwardRef<unknown, SlideProps>((props, ref) => (
    <Slide direction="left" ref={ref} {...props} />
));

export const MobileDialog: FC<Props> = props => {
    const { open, onClose, children, className, ...appBarProps } = props;
    const classes = useStyles();

    const handleClose = () => onClose();

    return (
        <Dialog
            disableScrollLock
            open={open}
            onClose={handleClose}
            fullScreen
            className={clsx(classes.root, className)}
            TransitionComponent={Transition}
        >
            <AppBar
                backAutoHide={false}
                onBack={handleClose}
                position="sticky"
                {...appBarProps}
            />
            <div className={classes.body}>{children}</div>
        </Dialog>
    );
};
