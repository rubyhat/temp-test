import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

const useStyles = makeStyles(
    theme => ({
        /* Styles applied to the root element. */
        root: {},
    }),
    { name: 'D2DMapPinHole' }
);

type D2DMapPinHoleProps = {
    className?: string;
};

export const D2DMapPinHole: FC<D2DMapPinHoleProps> = props => {
    const { className } = props;
    const classes = useStyles();

    return (
        <svg
            className={clsx(classes.root, className)}
            width="6"
            height="2"
            viewBox="0 0 6 2"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g filter="url(#filter0_i)">
                <ellipse
                    cx="3"
                    cy="1"
                    rx="3"
                    ry="1"
                    fill="black"
                    fillOpacity="0.16"
                />
            </g>
            <defs>
                <filter
                    id="filter0_i"
                    x="0"
                    y="0"
                    width="6"
                    height="2"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="BackgroundImageFix"
                        result="shape"
                    />
                    <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                    />
                    <feOffset />
                    <feGaussianBlur stdDeviation="0.5" />
                    <feComposite
                        in2="hardAlpha"
                        operator="arithmetic"
                        k2="-1"
                        k3="1"
                    />
                    <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0"
                    />
                    <feBlend
                        mode="normal"
                        in2="shape"
                        result="effect1_innerShadow"
                    />
                </filter>
            </defs>
        </svg>
    );
};
