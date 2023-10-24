import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

const useStyles = makeStyles(
    () => ({
        /* Styles applied to the root element. */
        root: {},
    }),
    { name: 'D2DMapPinSvg' }
);

type D2DMapPinSvgProps = {
    className?: string;
};

export const D2DMapPinSvg: FC<D2DMapPinSvgProps> = props => {
    const { className } = props;
    const classes = useStyles();

    return (
        <svg
            className={clsx(classes.root, className)}
            width="40"
            height="60"
            viewBox="0 0 40 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M22 45.6973C22 43.7479 22 42.7732 22.2482 42.1019C22.5224 41.3602 22.7082 41.083 23.2897 40.5472C23.8161 40.0622 25.079 39.5426 27.6047 38.5035C34.8788 35.5107 40 28.3534 40 20C40 8.9543 31.0457 0 20 0C8.9543 0 0 8.9543 0 20C0 28.3534 5.12124 35.5107 12.3953 38.5035C14.921 39.5426 16.1839 40.0622 16.7103 40.5472C17.2918 41.083 17.4776 41.3602 17.7518 42.1019C18 42.7732 18 43.7479 18 45.6973V58C18 59.1046 18.8954 60 20 60C21.1046 60 22 59.1046 22 58V45.6973Z"
                fill="#F65D1B"
            />
            <circle cx="20" cy="20" r="6" fill="white" />
        </svg>
    );
};
