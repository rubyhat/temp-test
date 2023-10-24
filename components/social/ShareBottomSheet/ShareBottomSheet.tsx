import React, { FC } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

import { ModalBottomSheet } from 'components/ui/ModalBottomSheet';
import { ShareData } from 'components/social/types';
import { SocialIconButtons } from './SocialIconButtons';
import { Typo } from 'components/Typo/Typo';
import { shareIcons, SocialNetwork } from 'components/social/icons';

const useStyles = makeStyles(
    theme => ({
        /* Styles applied to the root element. */
        root: {},
        content: {
            padding: theme.spacing(2),
        },
        title: {
            padding: theme.spacing(2),
        },
    }),
    { name: 'ShareBottomSheet' }
);

type ShareBottomSheetProps = {
    className?: string;
    onClose?: () => void;
    open: boolean;
    shareData: ShareData;
    title?: string;
};

export const ShareBottomSheet: FC<ShareBottomSheetProps> = props => {
    const { className, onClose, open, shareData, title } = props;
    const classes = useStyles();

    return (
        <ModalBottomSheet
            open={open}
            onClose={onClose}
            className={clsx(classes.root, className)}
        >
            {title ? (
                <Typo className={classes.title} variant="title">
                    {title}
                </Typo>
            ) : null}

            <div className={classes.content}>
                <SocialIconButtons
                    shareData={shareData}
                    networks={Object.keys(shareIcons) as SocialNetwork[]}
                    showCopyIcon
                />
            </div>
        </ModalBottomSheet>
    );
};
