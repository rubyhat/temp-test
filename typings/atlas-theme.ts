import { CSSProperties } from '@material-ui/styles/withStyles';

export type AtlasTypographyNames =
    | 'promo2'
    | 'promo1'
    | 'header2'
    | 'header'
    | 'title'
    | 'subtitle'
    | 'body6'
    | 'body5'
    | 'body4'
    | 'body3'
    | 'body2'
    | 'body1'
    | 'caption'
    | 'micro';

export type TypographyStyle = Required<Pick<CSSProperties, 'fontSize'>> &
    Partial<
        Pick<
            CSSProperties,
            | 'fontFamily'
            | 'fontStyle'
            | 'fontWeight'
            | 'color'
            | 'letterSpacing'
            | 'lineHeight'
            | 'textTransform'
        >
    >;

export interface AtlasTypography
    extends Record<AtlasTypographyNames, TypographyStyle> {}

export interface AtlasPalette {
    background: {
        brandMinor: string;
        brand: string;
        dark: string;
        support: string;
        white: string;
        deepWarm: string;
        deepCold: string;
        disabled: string;
        purple: string; // surge
        grey100: string;

        blueGray80: string;
        blueGray60: string;
        blueGray10: string;
        blueGray4: string;
        blueGray1: string;
        lightBlueGray: string;
        grey300: string;
    };
    text: {
        base60: string;

        base: string;
        minor: string;
        disabled: string;
        link: string;
        alert: string;

        trinity: string;
    };
    textInv: {
        base: string;
        minor: string;
        disabled: string;
        link: string;
        alert: string;
    };
    divider: {
        default: string;
        separator: string;
        inverted: string;
    };
    icons: {
        secondary: string;
    };
}

export type PlatformId = 'ios' | 'android' | 'browser';

export interface AtlasTheme {
    atlas: {
        gradients: {
            blue: string; // shuttle feature
            blueDark: string; // d2d button
            active: string;
            inactive: string;
            purple: string; // surge
        };
        shadows: {
            bottom: string;
            top: string;
            fly: string;
            flyRed: string;
            flyGreen: string;
            flyDark: string;

            above: string;
            superAbove: string;
            inset: string;
        };
        borderRadius: {
            light: number;
            soft: number;
            medium: number;
            high: number;
        };
        typography: AtlasTypography;
        palette: AtlasPalette;
        appBar: {
            paddingTop: (offset: number) => CSSProperties;
            marginTop: (padding: number) => CSSProperties;
        };
        bottomBar: {
            paddingBottom: (offset: number) => CSSProperties;
            height: (offset: number) => CSSProperties;
        };
        platformId: PlatformId;
    };
}
