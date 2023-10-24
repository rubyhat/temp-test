import { createMuiTheme } from '@material-ui/core/styles';
import { PlatformId } from 'typings/atlas-theme';

// use this object to access `themeInstance.breakpoints` inside `theme` below
const themeInstance = createMuiTheme();

const platformId: PlatformId = process.browser
    ? window.cordova
        ? (window.cordova.platformId as PlatformId)
        : 'browser'
    : 'browser';

// Create a theme instance.
// @ts-ignore
const theme = {
    palette: {
        primary: {
            main: '#2A5FCF', // Accent/CTA
        },
        secondary: {
            main: 'rgba(0, 148, 80, 1)', // Accent/Success
        },
        error: {
            main: '#E62E4F', // Accent/Alert
        },
        background: {
            default: '#F0F3F5', // Bg/Deep_cold
            paper: '#FFF',
        },
        contrastThreshold: 3,
        tonalOffset: 0.2, // should be negative (lighter)
        action: {
            active: 'rgba(5, 38, 48, 0.62)', // Text/Minor
            disabled: 'rgba(8, 41, 59, 0.38)', // Text/Disabled
            disabledBackground: 'rgba(43, 74, 85, 0.08)', // Bg/Disabled
            hoverOpacity: 0.08, // works only for (variant="contained")
        },
        text: {
            primary: 'rgba(2, 10, 13, 0.9)', // Text/Base
            secondary: 'rgba(5, 38, 48, 0.62)', // Text/Minor
            disabled: 'rgba(8, 41, 59, 0.38)', // Text/Disabled
        },
        divider: 'rgba(3, 44, 59, 0.16)',
    },
    atlas: {
        gradients: {
            blue: 'linear-gradient(72.01deg, #0260FD 0%, #0ACBFF 100%)',
            blueDark:
                'linear-gradient(44.99deg, #0260FD 23.79%, #0ACBFF 144.45%),' +
                'linear-gradient(0deg, #1673D6, #1673D6), #2752C1',
            /* Light Background / Active */
            active:
                'linear-gradient(0deg, rgba(22, 115, 214, 0.04), rgba(22, 115, 214, 0.04))',
            /* Light Background / Inactive */
            inactive: 'linear-gradient(0deg, #F2F3F5, #F2F3F5)',
            purple:
                'radial-gradient(114.27% 1123.96% at -0.72% 2.68%, #5925EC 0%, rgba(89, 37, 236, 0) 100%),' +
                'linear-gradient(44.99deg, #0260FD 23.79%, #0ACBFF 144.45%),' +
                'linear-gradient(0deg, #1673D6, #1673D6), #2752C1', // surge
        },
        shadows: {
            bottom:
                '0px 2px 4px rgba(8, 78, 104, 0.12),' +
                '0px 0px 2px rgba(8, 78, 104, 0.18)',
            top:
                '0px -2px 4px rgba(8, 78, 104, 0.12),' +
                ' 0px 0px 2px rgba(8, 78, 104, 0.18)',
            fly:
                '0px 6px 12px rgba(8, 78, 104, 0.18),' +
                ' 0px 0px 2px rgba(8, 78, 104, 0.26)',
            flyRed:
                '0px 6px 12px rgba(146, 16, 39, 0.24),' +
                ' 0px 0px 2px rgba(146, 16, 39, 0.18)',
            flyGreen:
                '0px 6px 12px rgba(0, 94, 60, 0.24),' +
                ' 0px 0px 2px rgba(0, 94, 60, 0.18)',
            flyDark:
                '0px 6px 12px rgba(4, 34, 46, 0.36),' +
                ' 0px 0px 2px rgba(4, 34, 46, 0.26)',
            above:
                '0px 1px 8px 1px rgba(0, 0, 0, 0.08),' +
                '0px 0px 16px 2px rgba(0, 0, 0, 0.04),' +
                '0px -1px 2px rgba(0, 0, 0, 0.04)',
            superAbove:
                '0px 8px 20px rgba(0, 0, 0, 0.04),' +
                '0px 2px 8px rgba(0, 0, 0, 0.02);',
            inset: 'inset 0px 4px 12px rgba(8, 78, 104, 0.12)',
        },
        borderRadius: {
            light: 4,
            soft: 6,
            medium: 8,
            high: 16,
        },
        typography: {
            promo2: {
                fontSize: 36,
                lineHeight: '38px',
                [themeInstance.breakpoints.up('sm')]: {
                    fontSize: 60,
                    lineHeight: '64px',
                },
            },
            promo1: {
                fontSize: 28,
                lineHeight: '32px',
                [themeInstance.breakpoints.up('sm')]: {
                    fontSize: 48,
                    lineHeight: '52px',
                },
            },
            header: {
                fontSize: 24,
                lineHeight: '28px',
                [themeInstance.breakpoints.up('sm')]: {
                    fontSize: 32,
                    lineHeight: '38px',
                },
            },
            header2: {
                fontSize: 22,
                lineHeight: '26px',
            },
            title: {
                fontSize: 21,
                lineHeight: '25px',
                [themeInstance.breakpoints.up('sm')]: {
                    fontSize: 26,
                    lineHeight: '30px',
                },
            },
            subtitle: {
                fontSize: 18,
                lineHeight: '22px',
                [themeInstance.breakpoints.up('sm')]: {
                    fontSize: 20,
                    lineHeight: '24px',
                },
            },
            // @todo reverse fontSize's from body1 to body3
            body3: {
                fontSize: 26,
                lineHeight: '34px',
                // body3 is missing on Mobile
            },
            body2: {
                fontSize: 18,
                lineHeight: '24px',
                [themeInstance.breakpoints.up('sm')]: {
                    fontSize: 17,
                    lineHeight: '25px',
                },
            },
            body1: {
                fontSize: 16,
                lineHeight: '22px',
                [themeInstance.breakpoints.up('sm')]: {
                    fontSize: 15,
                    lineHeight: '21px',
                },
            },
            body4: {
                fontSize: 15,
                lineHeight: '18px',
            },
            body5: {
                fontSize: 14,
                lineHeight: '16px',
            },
            body6: {
                fontSize: 13,
                lineHeight: '16px',
            },
            caption: {
                fontSize: 12, // same on all devices
                lineHeight: '18px',
            },
            micro: {
                fontSize: 10, // same on all devices
                lineHeight: '14px',
            },
        },
        palette: {
            background: {
                brandMinor: '#1154C8',
                brand: '#075FFA',
                dark: '#0F183D',
                support: '#4AE3ED',
                white: '#FFFFFF',
                deepWarm: '#F8EFEB',
                deepCold: '#F0F3F5',
                disabled: 'rgba(43, 74, 85, 0.08)',
                purple: '#5925EC', // surge
                grey100: '#F2F3F5',

                // @todo Занести в Фигму. Придумать названия получше.
                blueGray80: 'rgba(8, 41, 59, 0.8)',
                blueGray60: 'rgba(8, 41, 59, 0.6)',
                blueGray10: 'rgba(8, 41, 59, 0.1)',
                blueGray4: 'rgba(8, 41, 59, 0.04)',
                blueGray1: 'rgba(8, 41, 59, 0.01)',
                lightBlueGray: 'rgba(57, 84, 98, 0.6)',
                grey300: ' rgba(0, 0, 0, 0.08)',
            },
            text: {
                base: 'rgba(2, 10, 13, 0.9)',
                base60: 'rgba(2, 10, 13, 0.6)',
                minor: 'rgba(5, 38, 48, 0.62)',
                disabled: 'rgba(8, 41, 59, 0.38)',
                link: '#075FFA',
                alert: '#E62E4F',

                trinity: ' #68787D',
            },
            textInv: {
                base: '#FFFFFF',
                minor: 'rgba(255, 255, 255, 0.64)',
                disabled: 'rgba(255, 255, 255, 0.36)',
                link: '#4E8BF3',
                alert: '#FF756C',
            },
            divider: {
                default: 'rgba(3, 44, 59, 0.16)',
                separator: 'rgba(0, 0, 0, 0.08)',
                inverted: 'rgba(198, 235, 247, 0.32)',
            },
            icons: {
                secondary: '#A1ADB3',
            },
        },
        appBar: {
            paddingTop: (offset: number) => ({
                paddingTop: `calc(${offset}px + env(safe-area-inset-top))`,
                fallbacks: [
                    {
                        // @ts-ignore
                        paddingTop: `calc(${offset} + constant(safe-area-inset-top))`,
                    },
                    { paddingTop: offset + (platformId === 'ios' ? 20 : 0) },
                ],
            }),
            marginTop: (offset: number) => ({
                marginTop: `calc(56px + ${offset}px + env(safe-area-inset-top))`,
                fallbacks: [
                    {
                        // @ts-ignore
                        marginTop: `calc(56px + ${offset}px + constant(safe-area-inset-top))`,
                    },
                    {
                        marginTop:
                            56 + offset + (platformId === 'ios' ? 20 : 0),
                    },
                ],
            }),
        },
        bottomBar: {
            paddingBottom: (offset: number) => ({
                paddingBottom: `calc(${offset}px + env(safe-area-inset-bottom))`,
                fallbacks: [
                    {
                        // @ts-ignore
                        paddingBottom: `calc(${offset}px + env(safe-area-inset-bottom))`,
                    },
                    { paddingBottom: offset },
                ],
            }),
            height: (offset: number) => ({
                height: `calc(${offset}px + env(safe-area-inset-bottom))`,
                fallbacks: [
                    {
                        // @ts-ignore
                        height: `calc(${offset}px + constant(safe-area-inset-bottom))`,
                    },
                    { height: offset },
                ],
            }),
        },
        platformId,
    },
    shape: {
        borderRadius: 3,
    },
    typography: {
        /**
         * System Fonts
         * @see https://css-tricks.com/snippets/css/system-font-stack/
         */
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            'Oxygen-Sans',
            'Ubuntu',
            'Cantarell',
            '"Helvetica Neue"',
            'sans-serif',
        ].join(','),
    },
    props: {
        MuiButtonBase: {
            disableRipple: false,
        },
        MuiButtonGroup: {
            disableRipple: false,
        },
    },
    overrides: {
        MuiListItem: {
            button: {
                '&:$hover': {
                    backgroundColor: 'rgba(7, 95, 250, 0.05)', // Accent/CTA
                },
            },
        },
        MuiPickersCalendarHeader: {
            switchHeader: {},
            daysHeader: {
                padding: 6,
                maxHeight: 'unset',
                backgroundColor: '#F0F3F5',
                // hardcode weekend days
                '& > :last-child, & > :nth-last-child(2)': {
                    color: '#E62E4F',
                },
            },
        },
        MuiPickersSlideTransition: {
            transitionContainer: {
                '& > *': {
                    fontWeight: 'bold',
                },
            },
        },
    },
};

export default createMuiTheme(theme);

export const createTheme = (brandName: string = 'atlas', partners: any[]) => {
    const partner = partners.find(p => p.meta.partnerID === brandName);
    const partnerTheme = partner ? partner.theme : {};

    return createMuiTheme(theme, partnerTheme);
};
