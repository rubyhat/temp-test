import React, { FC } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
    theme => ({
        /* Styles applied to the root element. */
        root: {},
    }),
    { name: 'LogoSign' }
);

export type LogoSignSize = 'xs' | 'sm' | 'md' | 'xl';
const logoSignSizeMap: Record<
    LogoSignSize,
    { width: number; height: number }
> = {
    xs: { width: 16.65, height: 12.71 },
    sm: { width: 38.79, height: 31.49 },
    md: { width: 72, height: 58.45 },
    xl: { width: 170, height: 138 },
};

export type LogoSignProps = {
    dark?: boolean;
    size?: LogoSignSize;
    className?: string;
};

export const LogoSign: FC<LogoSignProps> = props => {
    const { dark, size = 'md', className } = props;
    const classes = useStyles();

    const { width, height } = logoSignSizeMap[size];

    if (dark) {
        return (
            <svg
                className={clsx(classes.root, className)}
                width={width}
                height={height}
                viewBox="0 0 170 138"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <g filter="url(#filter00_ii)">
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12.5588 55.5323C3.44664 34.7318 -1.10942 24.3316 0.230339 17.5351C1.88018 9.16563 8.19977 2.49282 16.4677 0.390206C23.1817 -1.31724 33.8152 2.6659 55.0822 10.6322L122.5 35.8859C149.853 46.1319 163.53 51.2549 167.452 58.6975C170.849 65.1456 170.849 72.8544 167.452 79.3025C163.53 86.7451 149.853 91.8681 122.5 102.114L55.0823 127.368C33.8152 135.334 23.1817 139.317 16.4677 137.61C8.19977 135.507 1.88018 128.834 0.230339 120.465C-1.10942 113.668 3.44663 103.268 12.5588 82.4677C14.5377 77.9502 15.5272 75.6914 15.9962 73.3624C16.576 70.483 16.576 67.517 15.9962 64.6376C15.5272 62.3086 14.5377 60.0498 12.5588 55.5323Z"
                        fill="white"
                    />
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12.5588 55.5323C3.44664 34.7318 -1.10942 24.3316 0.230339 17.5351C1.88018 9.16563 8.19977 2.49282 16.4677 0.390206C23.1817 -1.31724 33.8152 2.6659 55.0822 10.6322L122.5 35.8859C149.853 46.1319 163.53 51.2549 167.452 58.6975C170.849 65.1456 170.849 72.8544 167.452 79.3025C163.53 86.7451 149.853 91.8681 122.5 102.114L55.0823 127.368C33.8152 135.334 23.1817 139.317 16.4677 137.61C8.19977 135.507 1.88018 128.834 0.230339 120.465C-1.10942 113.668 3.44663 103.268 12.5588 82.4677C14.5377 77.9502 15.5272 75.6914 15.9962 73.3624C16.576 70.483 16.576 67.517 15.9962 64.6376C15.5272 62.3086 14.5377 60.0498 12.5588 55.5323Z"
                        fill="url(#paint00_linear)"
                        fillOpacity="0.8"
                    />
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12.5588 55.5323C3.44664 34.7318 -1.10942 24.3316 0.230339 17.5351C1.88018 9.16563 8.19977 2.49282 16.4677 0.390206C23.1817 -1.31724 33.8152 2.6659 55.0822 10.6322L122.5 35.8859C149.853 46.1319 163.53 51.2549 167.452 58.6975C170.849 65.1456 170.849 72.8544 167.452 79.3025C163.53 86.7451 149.853 91.8681 122.5 102.114L55.0823 127.368C33.8152 135.334 23.1817 139.317 16.4677 137.61C8.19977 135.507 1.88018 128.834 0.230339 120.465C-1.10942 113.668 3.44663 103.268 12.5588 82.4677C14.5377 77.9502 15.5272 75.6914 15.9962 73.3624C16.576 70.483 16.576 67.517 15.9962 64.6376C15.5272 62.3086 14.5377 60.0498 12.5588 55.5323Z"
                        fill="url(#paint01_linear)"
                        fillOpacity="0.4"
                    />
                </g>
                <path
                    d="M12.5588 82.4676C14.5377 77.9501 15.5272 75.6914 15.9962 73.3623C16.2757 71.9741 16.4205 70.5657 16.4305 69.1566C16.4412 67.6431 16.2965 66.1287 15.9962 64.6376C21.3003 81.0078 40.7047 105.824 38.2178 120.465C36.4388 130.939 30.8838 135.507 22.6159 137.61C20.6354 138 19.8208 137.978 19.0879 137.983C18.355 137.988 17.2798 137.816 16.4677 137.61C8.19977 135.507 1.88017 128.834 0.230338 120.465C-1.10942 113.668 3.44666 103.268 12.5588 82.4676Z"
                    fill="#C2D1F0"
                />
                <path
                    d="M12.5588 82.4676C14.5377 77.9501 15.5272 75.6914 15.9962 73.3623C16.2757 71.9741 16.4205 70.5657 16.4305 69.1566C16.4412 67.6431 16.2965 66.1287 15.9962 64.6376C21.3003 81.0078 40.7047 105.824 38.2178 120.465C36.4388 130.939 30.8838 135.507 22.6159 137.61C20.6354 138 19.8208 137.978 19.0879 137.983C18.355 137.988 17.2798 137.816 16.4677 137.61C8.19977 135.507 1.88017 128.834 0.230338 120.465C-1.10942 113.668 3.44666 103.268 12.5588 82.4676Z"
                    fill="#CCDBFA"
                />
                <path
                    d="M12.5588 82.4676C14.5377 77.9501 15.5272 75.6914 15.9962 73.3623C16.2757 71.9741 16.4205 70.5657 16.4305 69.1566C16.4412 67.6431 16.2965 66.1287 15.9962 64.6376C21.3003 81.0078 40.7047 105.824 38.2178 120.465C36.4388 130.939 30.8838 135.507 22.6159 137.61C20.6354 138 19.8208 137.978 19.0879 137.983C18.355 137.988 17.2798 137.816 16.4677 137.61C8.19977 135.507 1.88017 128.834 0.230338 120.465C-1.10942 113.668 3.44666 103.268 12.5588 82.4676Z"
                    fill="url(#paint02_linear)"
                    fillOpacity="0.5"
                />
                <defs>
                    <filter
                        id="filter00_ii"
                        x="0"
                        y="0"
                        width="170"
                        height="144"
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
                        <feOffset dy="6" />
                        <feGaussianBlur stdDeviation="3.5" />
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
                            result="effect01_innerShadow"
                        />
                        <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                        />
                        <feOffset />
                        <feGaussianBlur stdDeviation="1" />
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
                            in2="effect01_innerShadow"
                            result="effect02_innerShadow"
                        />
                    </filter>
                    <linearGradient
                        id="paint00_linear"
                        x1="139"
                        y1="7"
                        x2="58.4207"
                        y2="173.704"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stopColor="white" stopOpacity="0.5" />
                        <stop offset="1" stopColor="#E3EBFD" />
                    </linearGradient>
                    <linearGradient
                        id="paint01_linear"
                        x1="62"
                        y1="69"
                        x2="72.6844"
                        y2="127.55"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stopColor="white" stopOpacity="0.5" />
                        <stop offset="0.56458" stopColor="#E3EBFD" />
                    </linearGradient>
                    <linearGradient
                        id="paint02_linear"
                        x1="19"
                        y1="119.5"
                        x2="49.7943"
                        y2="108.682"
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
        );
    }

    return (
        <svg
            className={clsx(classes.root, className)}
            width={width}
            height={height}
            viewBox="0 0 170 138"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g filter="url(#filter01_ii)">
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12.5588 55.5323C3.44664 34.7318 -1.10942 24.3316 0.230339 17.5351C1.88018 9.16563 8.19977 2.49282 16.4677 0.390206C23.1817 -1.31724 33.8152 2.6659 55.0822 10.6322L122.5 35.8859C149.853 46.1319 163.53 51.2549 167.452 58.6975C170.849 65.1456 170.849 72.8544 167.452 79.3025C163.53 86.7451 149.853 91.8681 122.5 102.114L55.0823 127.368C33.8152 135.334 23.1817 139.317 16.4677 137.61C8.19977 135.507 1.88018 128.834 0.230339 120.465C-1.10942 113.668 3.44663 103.268 12.5588 82.4677C14.5377 77.9502 15.5272 75.6914 15.9962 73.3624C16.576 70.483 16.576 67.517 15.9962 64.6376C15.5272 62.3086 14.5377 60.0498 12.5588 55.5323Z"
                    fill="url(#paint00_linear)"
                />
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12.5588 55.5323C3.44664 34.7318 -1.10942 24.3316 0.230339 17.5351C1.88018 9.16563 8.19977 2.49282 16.4677 0.390206C23.1817 -1.31724 33.8152 2.6659 55.0822 10.6322L122.5 35.8859C149.853 46.1319 163.53 51.2549 167.452 58.6975C170.849 65.1456 170.849 72.8544 167.452 79.3025C163.53 86.7451 149.853 91.8681 122.5 102.114L55.0823 127.368C33.8152 135.334 23.1817 139.317 16.4677 137.61C8.19977 135.507 1.88018 128.834 0.230339 120.465C-1.10942 113.668 3.44663 103.268 12.5588 82.4677C14.5377 77.9502 15.5272 75.6914 15.9962 73.3624C16.576 70.483 16.576 67.517 15.9962 64.6376C15.5272 62.3086 14.5377 60.0498 12.5588 55.5323Z"
                    fill="url(#paint01_radial)"
                />
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12.5588 55.5323C3.44664 34.7318 -1.10942 24.3316 0.230339 17.5351C1.88018 9.16563 8.19977 2.49282 16.4677 0.390206C23.1817 -1.31724 33.8152 2.6659 55.0822 10.6322L122.5 35.8859C149.853 46.1319 163.53 51.2549 167.452 58.6975C170.849 65.1456 170.849 72.8544 167.452 79.3025C163.53 86.7451 149.853 91.8681 122.5 102.114L55.0823 127.368C33.8152 135.334 23.1817 139.317 16.4677 137.61C8.19977 135.507 1.88018 128.834 0.230339 120.465C-1.10942 113.668 3.44663 103.268 12.5588 82.4677C14.5377 77.9502 15.5272 75.6914 15.9962 73.3624C16.576 70.483 16.576 67.517 15.9962 64.6376C15.5272 62.3086 14.5377 60.0498 12.5588 55.5323Z"
                    fill="url(#paint02_radial)"
                />
            </g>
            <path
                d="M12.5588 82.4676C14.5377 77.9501 15.5272 75.6914 15.9962 73.3623C16.2757 71.9741 16.4205 70.5657 16.4305 69.1566C16.4412 67.6431 16.2965 66.1287 15.9962 64.6376C21.3003 81.0078 40.7047 105.824 38.2178 120.465C36.4388 130.939 30.8838 135.507 22.6159 137.61C20.6354 138 19.8208 137.978 19.0879 137.983C18.355 137.988 17.2798 137.816 16.4677 137.61C8.19977 135.507 1.88017 128.834 0.230338 120.465C-1.10942 113.668 3.44666 103.268 12.5588 82.4676Z"
                fill="url(#paint03_linear)"
            />
            <path
                d="M12.5588 82.4676C14.5377 77.9501 15.5272 75.6914 15.9962 73.3623C16.2757 71.9741 16.4205 70.5657 16.4305 69.1566C16.4412 67.6431 16.2965 66.1287 15.9962 64.6376C21.3003 81.0078 40.7047 105.824 38.2178 120.465C36.4388 130.939 30.8838 135.507 22.6159 137.61C20.6354 138 19.8208 137.978 19.0879 137.983C18.355 137.988 17.2798 137.816 16.4677 137.61C8.19977 135.507 1.88017 128.834 0.230338 120.465C-1.10942 113.668 3.44666 103.268 12.5588 82.4676Z"
                fill="url(#paint04_radial)"
            />
            <path
                d="M12.5588 82.4676C14.5377 77.9501 15.5272 75.6914 15.9962 73.3623C16.2757 71.9741 16.4205 70.5657 16.4305 69.1566C16.4412 67.6431 16.2965 66.1287 15.9962 64.6376C21.3003 81.0078 40.7047 105.824 38.2178 120.465C36.4388 130.939 30.8838 135.507 22.6159 137.61C20.6354 138 19.8208 137.978 19.0879 137.983C18.355 137.988 17.2798 137.816 16.4677 137.61C8.19977 135.507 1.88017 128.834 0.230338 120.465C-1.10942 113.668 3.44666 103.268 12.5588 82.4676Z"
                fill="url(#paint05_linear)"
                fillOpacity="0.6"
            />
            <path
                d="M12.5588 82.4676C14.5377 77.9501 15.5272 75.6914 15.9962 73.3623C16.2757 71.9741 16.4205 70.5657 16.4305 69.1566C16.4412 67.6431 16.2965 66.1287 15.9962 64.6376C21.3003 81.0078 40.7047 105.824 38.2178 120.465C36.4388 130.939 30.8838 135.507 22.6159 137.61C20.6354 138 19.8208 137.978 19.0879 137.983C18.355 137.988 17.2798 137.816 16.4677 137.61C8.19977 135.507 1.88017 128.834 0.230338 120.465C-1.10942 113.668 3.44666 103.268 12.5588 82.4676Z"
                fill="url(#paint06_radial)"
            />
            <path
                d="M12.5588 82.4676C14.5377 77.9501 15.5272 75.6914 15.9962 73.3623C16.2757 71.9741 16.4205 70.5657 16.4305 69.1566C16.4412 67.6431 16.2965 66.1287 15.9962 64.6376C21.3003 81.0078 40.7047 105.824 38.2178 120.465C36.4388 130.939 30.8838 135.507 22.6159 137.61C20.6354 138 19.8208 137.978 19.0879 137.983C18.355 137.988 17.2798 137.816 16.4677 137.61C8.19977 135.507 1.88017 128.834 0.230338 120.465C-1.10942 113.668 3.44666 103.268 12.5588 82.4676Z"
                fill="url(#paint07_linear)"
            />
            <defs>
                <filter
                    id="filter00_ii"
                    x="0"
                    y="0"
                    width="170"
                    height="144"
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
                    <feOffset dy="6" />
                    <feGaussianBlur stdDeviation="3.5" />
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
                    <feGaussianBlur stdDeviation="1" />
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
                    id="paint00_linear"
                    x1="103"
                    y1="27"
                    x2="39"
                    y2="132"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#09BBFF" />
                    <stop offset="0.668474" stopColor="#036FFE" />
                </linearGradient>
                <radialGradient
                    id="paint01_radial"
                    cx="0"
                    cy="0"
                    r="1"
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(175.18 -27.2004) rotate(143.79) scale(146.441 140.379)"
                >
                    <stop stopColor="white" />
                    <stop offset="1" stopColor="white" stopOpacity="0.01" />
                </radialGradient>
                <radialGradient
                    id="paint02_radial"
                    cx="0"
                    cy="0"
                    r="1"
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(143.887 -63.707) rotate(146.012) scale(192.217 179.181)"
                >
                    <stop stopColor="white" stopOpacity="0.8" />
                    <stop offset="1" stopColor="white" stopOpacity="0.01" />
                </radialGradient>
                <linearGradient
                    id="paint03_linear"
                    x1="36"
                    y1="103"
                    x2="0.377748"
                    y2="122.684"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#09BBFF" />
                    <stop offset="1" stopColor="#43CBFF" />
                </linearGradient>
                <radialGradient
                    id="paint04_radial"
                    cx="0"
                    cy="0"
                    r="1"
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(39.608 50.1809) rotate(120.158) scale(53.1767 46.4551)"
                >
                    <stop stopColor="white" />
                    <stop offset="1" stopColor="white" stopOpacity="0.01" />
                </radialGradient>
                <linearGradient
                    id="paint05_linear"
                    x1="32.2036"
                    y1="96.0519"
                    x2="6.0204"
                    y2="92.4809"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="white" stopOpacity="0.01" />
                    <stop offset="1" stopColor="white" stopOpacity="0.5" />
                </linearGradient>
                <radialGradient
                    id="paint06_radial"
                    cx="0"
                    cy="0"
                    r="1"
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(41.4487 123.669) rotate(-132.793) scale(31.5726 51.5591)"
                >
                    <stop stopColor="#ADE5FD" stopOpacity="0.5" />
                    <stop offset="1" stopColor="#ADE5FD" stopOpacity="0.01" />
                </radialGradient>
                <linearGradient
                    id="paint07_linear"
                    x1="19"
                    y1="119.5"
                    x2="49.7943"
                    y2="108.682"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#0470FE" stopOpacity="0.01" />
                    <stop offset="1" stopColor="#091C54" stopOpacity="0.34" />
                    <stop offset="1" stopColor="#0470FE" stopOpacity="0.35" />
                </linearGradient>
            </defs>
        </svg>
    );
};
