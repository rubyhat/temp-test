import React, { FC } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
    {
        root: {
            height: '100%',
            width: '100%',
            position: 'relative',
            background: 'rgba(43, 74, 85, 0.08)',
            overflow: 'hidden',
            '&:before': {
                content: "''",
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background:
                    'linear-gradient(90deg, rgba(255, 255, 255, 0) 0%,' +
                    'rgba(255, 255, 255, 0.75) 33%,' +
                    'rgba(255, 255, 255, 0) 66%)',
                animation: '$move 3s linear 0s infinite',
            },
        },
        transparent: {
            background: 'transparent',
        },
        absolute: {
            position: 'absolute',
            top: 0,
            left: 0,
        },
        '@keyframes move': {
            from: { transform: 'translateX(-66%)' },
            to: { transform: 'translateX(100%)' },
        },
    },
    { name: 'Stub' }
);

export const Stub: FC<{ transparent?: boolean; absolute?: boolean }> = ({
    transparent = false,
    absolute = false,
}) => {
    const classes = useStyles();
    const classList = clsx({
        [classes.root]: true,
        [classes.transparent]: transparent,
        [classes.absolute]: absolute,
    });

    return <div className={classList} />;
};
