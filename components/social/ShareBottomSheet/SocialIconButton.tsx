import React, { FC } from 'react';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { ShareData } from 'components/social/types';
import { shareIcons, SocialNetwork } from 'components/social/icons';
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
    { name: 'SocialIconButton' }
);

type SocialIconButtonProps = {
    className?: string;
    network: SocialNetwork;
    onClick?: () => void;
    onClose?: () => void;
    shareData: ShareData;
};

export const SocialIconButton: FC<SocialIconButtonProps> = props => {
    const { className, network, onClick, onClose, shareData } = props;
    const { path, viewBox = '0 0 24 24', color, e } = shareIcons[network];
    const classes = useStyles();

    const handleClick = () => {
        if (onClick) {
            onClick();
        }

        e(
            encodeURIComponent(shareData.url),
            encodeURIComponent(shareData.text || ''),
            shareData.title,
            shareData.image
        );

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
