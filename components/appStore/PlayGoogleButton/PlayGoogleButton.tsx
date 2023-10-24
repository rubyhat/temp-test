import React, { FC } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

import { StoreBagde } from 'components/appStore/StoreBadge';

const useStyles = makeStyles(
    theme => ({
        /* Styles applied to the root element. */
        root: {},
    }),
    { name: 'PlayGoogleButton' }
);

type PlayGoogleButtonProps = {
    className?: string;
    onClick?: () => void;
    href?: string;
    target?: string;
};

export const PlayGoogleButton: FC<PlayGoogleButtonProps> = props => {
    const { className, onClick, href, target } = props;
    const classes = useStyles();

    return (
        <a
            className={clsx(classes.root, className)}
            onClick={onClick}
            href={href}
            target={target}
        >
            <StoreBagde
                src="/static/img/appStore/store-android-1x.webp"
                srcSet="/static/img/appStore/store-android-2x.webp 2x"
                alt="android store"
            />
        </a>
    );
};
