import React, { FC } from 'react';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { ShareData } from 'components/social/types';
import { ShareIcon } from 'components/social/icons';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            width: '100%',
            height: 'auto',
            cursor: 'pointer',
            border: 0,
            background: theme.palette.primary.main,
            padding: 12,
            borderRadius: theme.atlas.borderRadius.medium,
            fontSize: 0,
        },
    }),
    { name: 'CopyIconButton' }
);

type CopyIconButtonProps = {
    className?: string;
    onClick?: () => void;
    onClose?: () => void;
    shareData: ShareData;
};

const shareIcon: ShareIcon = {
    path: (
        <path d="M16 1H4a2 2 0 00-2 2v14h2V3h12V1zm3 4H8a2 2 0 00-2 2v14c0 1.1.9 2 2 2h11a2 2 0 002-2V7a2 2 0 00-2-2zm0 16H8V7h11v14z" />
    ),
    viewBox: '0 0 24 24',
    color: '#718096',
    e: () => {}, // имплементация ниже, в компоненте
};

export const CopyIconButton: FC<CopyIconButtonProps> = props => {
    const { className, onClick, onClose, shareData } = props;
    const { path, viewBox = '0 0 24 24', color, e } = shareIcon;
    const classes = useStyles();

    const handleClick = () => {
        if (onClick) {
            onClick();
        }

        if (onClose) {
            onClose();
        }
    };

    return (
        <button
            className={clsx(classes.root, className)}
            onClick={handleClick}
            style={{
                backgroundColor: color,
            }}
        >
            <svg fill="white" viewBox={viewBox}>
                {path}
            </svg>
        </button>
    );
};
