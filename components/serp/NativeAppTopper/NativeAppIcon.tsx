import React, { FC } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

import { useTranslation } from 'i18n';

const useStyles = makeStyles(
    theme => ({
        /* Styles applied to the root element. */
        root: {},
    }),
    { name: 'NativeAppIcon' }
);

type NativeAppIconProps = {
    className?: string;
};

export const NativeAppIcon: FC<NativeAppIconProps> = props => {
    const { className } = props;
    const classes = useStyles();
    const { t } = useTranslation();

    return (
        <div className={clsx(classes.root, className)}>
            <svg
                width="50"
                height="50"
                viewBox="0 0 50 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M0 25C0 14.6919 0 9.5378 2.58215 5.8986C3.49327 4.61449 4.61449 3.49327 5.8986 2.58215C9.5378 0 14.6919 0 25 0V0C35.3081 0 40.4622 0 44.1014 2.58215C45.3855 3.49327 46.5067 4.61449 47.4179 5.8986C50 9.5378 50 14.6919 50 25V25C50 35.3081 50 40.4622 47.4179 44.1014C46.5067 45.3855 45.3855 46.5067 44.1014 47.4179C40.4622 50 35.3081 50 25 50V50C14.6919 50 9.5378 50 5.8986 47.4179C4.61449 46.5067 3.49327 45.3855 2.58215 44.1014C0 40.4622 0 35.3081 0 25V25Z"
                    fill="#2A5FCF"
                />
                <path
                    d="M0 25C0 14.6919 0 9.5378 2.58215 5.8986C3.49327 4.61449 4.61449 3.49327 5.8986 2.58215C9.5378 0 14.6919 0 25 0V0C35.3081 0 40.4622 0 44.1014 2.58215C45.3855 3.49327 46.5067 4.61449 47.4179 5.8986C50 9.5378 50 14.6919 50 25V25C50 35.3081 50 40.4622 47.4179 44.1014C46.5067 45.3855 45.3855 46.5067 44.1014 47.4179C40.4622 50 35.3081 50 25 50V50C14.6919 50 9.5378 50 5.8986 47.4179C4.61449 46.5067 3.49327 45.3855 2.58215 44.1014C0 40.4622 0 35.3081 0 25V25Z"
                    fill="url(#paint0_linear)"
                />
                <g filter="url(#filter0_ii)">
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M13.9946 23.0482C12.5474 20.0336 11.8238 18.5263 12.0366 17.5413C12.2986 16.3284 13.3023 15.3613 14.6155 15.0566C15.6818 14.8091 17.3707 15.3864 20.7484 16.5409L31.4559 20.2009C35.8002 21.6858 37.9724 22.4282 38.5953 23.5069C39.1349 24.4414 39.1349 25.5586 38.5953 26.4931C37.9724 27.5718 35.8002 28.3142 31.4559 29.7991L20.7484 33.4591C17.3707 34.6136 15.6818 35.1909 14.6155 34.9434C13.3023 34.6387 12.2986 33.6716 12.0366 32.4587C11.8238 31.4737 12.5474 29.9664 13.9946 26.9518V26.9518C14.3089 26.2971 14.4661 25.9698 14.5406 25.6322C14.6327 25.2149 14.6327 24.7851 14.5406 24.3678C14.4661 24.0302 14.3089 23.7029 13.9946 23.0482V23.0482Z"
                        fill="white"
                    />
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M13.9946 23.0482C12.5474 20.0336 11.8238 18.5263 12.0366 17.5413C12.2986 16.3284 13.3023 15.3613 14.6155 15.0566C15.6818 14.8091 17.3707 15.3864 20.7484 16.5409L31.4559 20.2009C35.8002 21.6858 37.9724 22.4282 38.5953 23.5069C39.1349 24.4414 39.1349 25.5586 38.5953 26.4931C37.9724 27.5718 35.8002 28.3142 31.4559 29.7991L20.7484 33.4591C17.3707 34.6136 15.6818 35.1909 14.6155 34.9434C13.3023 34.6387 12.2986 33.6716 12.0366 32.4587C11.8238 31.4737 12.5474 29.9664 13.9946 26.9518V26.9518C14.3089 26.2971 14.4661 25.9698 14.5406 25.6322C14.6327 25.2149 14.6327 24.7851 14.5406 24.3678C14.4661 24.0302 14.3089 23.7029 13.9946 23.0482V23.0482Z"
                        fill="url(#paint1_linear)"
                        fillOpacity="0.8"
                    />
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M13.9946 23.0482C12.5474 20.0336 11.8238 18.5263 12.0366 17.5413C12.2986 16.3284 13.3023 15.3613 14.6155 15.0566C15.6818 14.8091 17.3707 15.3864 20.7484 16.5409L31.4559 20.2009C35.8002 21.6858 37.9724 22.4282 38.5953 23.5069C39.1349 24.4414 39.1349 25.5586 38.5953 26.4931C37.9724 27.5718 35.8002 28.3142 31.4559 29.7991L20.7484 33.4591C17.3707 34.6136 15.6818 35.1909 14.6155 34.9434C13.3023 34.6387 12.2986 33.6716 12.0366 32.4587C11.8238 31.4737 12.5474 29.9664 13.9946 26.9518V26.9518C14.3089 26.2971 14.4661 25.9698 14.5406 25.6322C14.6327 25.2149 14.6327 24.7851 14.5406 24.3678C14.4661 24.0302 14.3089 23.7029 13.9946 23.0482V23.0482Z"
                        fill="url(#paint2_linear)"
                        fillOpacity="0.4"
                    />
                </g>
                <path
                    d="M13.9946 26.9518C14.3089 26.2971 14.4661 25.9698 14.5406 25.6322C14.585 25.431 14.608 25.2269 14.6095 25.0227C14.6113 24.8033 14.5883 24.5839 14.5406 24.3678C15.383 26.7403 18.4649 30.3368 18.0699 32.4587C17.7873 33.9766 16.9051 34.6387 15.5919 34.9434C15.2774 35 15.148 34.9968 15.0316 34.9975C14.9152 34.9982 14.7444 34.9734 14.6155 34.9434C13.3023 34.6387 12.2986 33.6716 12.0366 32.4587C11.8238 31.4737 12.5474 29.9664 13.9946 26.9518Z"
                    fill="#C2D1F0"
                />
                <path
                    d="M13.9946 26.9518C14.3089 26.2971 14.4661 25.9698 14.5406 25.6322C14.585 25.431 14.608 25.2269 14.6095 25.0227C14.6113 24.8033 14.5883 24.5839 14.5406 24.3678C15.383 26.7403 18.4649 30.3368 18.0699 32.4587C17.7873 33.9766 16.9051 34.6387 15.5919 34.9434C15.2774 35 15.148 34.9968 15.0316 34.9975C14.9152 34.9982 14.7444 34.9734 14.6155 34.9434C13.3023 34.6387 12.2986 33.6716 12.0366 32.4587C11.8238 31.4737 12.5474 29.9664 13.9946 26.9518Z"
                    fill="#CCDBFA"
                />
                <path
                    d="M13.9946 26.9518C14.3089 26.2971 14.4661 25.9698 14.5406 25.6322C14.585 25.431 14.608 25.2269 14.6095 25.0227C14.6113 24.8033 14.5883 24.5839 14.5406 24.3678C15.383 26.7403 18.4649 30.3368 18.0699 32.4587C17.7873 33.9766 16.9051 34.6387 15.5919 34.9434C15.2774 35 15.148 34.9968 15.0316 34.9975C14.9152 34.9982 14.7444 34.9734 14.6155 34.9434C13.3023 34.6387 12.2986 33.6716 12.0366 32.4587C11.8238 31.4737 12.5474 29.9664 13.9946 26.9518Z"
                    fill="url(#paint3_linear)"
                    fillOpacity="0.5"
                />
                <defs>
                    <filter
                        id="filter0_ii"
                        x="12"
                        y="15"
                        width="27"
                        height="22.2327"
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
                        <feOffset dy="2.23274" />
                        <feGaussianBlur stdDeviation="1.30243" />
                        <feComposite
                            in2="hardAlpha"
                            operator="arithmetic"
                            k2="-1"
                            k3="1"
                        />
                        <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.1 0"
                        />
                        <feBlend
                            mode="normal"
                            in2="shape"
                            result="effect1_innerShadow"
                        />
                        <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                        />
                        <feOffset />
                        <feGaussianBlur stdDeviation="0.372123" />
                        <feComposite
                            in2="hardAlpha"
                            operator="arithmetic"
                            k2="-1"
                            k3="1"
                        />
                        <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"
                        />
                        <feBlend
                            mode="normal"
                            in2="effect1_innerShadow"
                            result="effect2_innerShadow"
                        />
                    </filter>
                    <linearGradient
                        id="paint0_linear"
                        x1="30.2941"
                        y1="9.78261"
                        x2="5.24094"
                        y2="43.1485"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stopColor="#09BBFF" />
                        <stop offset="0.668474" stopColor="#036FFE" />
                    </linearGradient>
                    <linearGradient
                        id="paint1_linear"
                        x1="34.0765"
                        y1="16.0145"
                        x2="23.0713"
                        y2="40.9653"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stopColor="white" stopOpacity="0.5" />
                        <stop offset="1" stopColor="#E3EBFD" />
                    </linearGradient>
                    <linearGradient
                        id="paint2_linear"
                        x1="21.8471"
                        y1="25"
                        x2="23.2677"
                        y2="33.5316"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stopColor="white" stopOpacity="0.5" />
                        <stop offset="0.56458" stopColor="#E3EBFD" />
                    </linearGradient>
                    <linearGradient
                        id="paint3_linear"
                        x1="15.0176"
                        y1="32.3188"
                        x2="19.8029"
                        y2="30.4766"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stopColor="#0470FE" stopOpacity="0.01" />
                        <stop
                            offset="1"
                            stopColor="#091C54"
                            stopOpacity="0.34"
                        />
                        <stop
                            offset="1"
                            stopColor="#0470FE"
                            stopOpacity="0.35"
                        />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
};
