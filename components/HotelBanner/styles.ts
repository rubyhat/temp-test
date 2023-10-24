import { AtlasTheme } from 'typings/atlas-theme';
import { makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            width: '100%',
            display: 'inline-block',
            position: 'relative',
            textDecoration: 'none',
            color: '#fff',
        },
        bannerImage: {
            borderRadius: theme.spacing(1),
            width: '100%',
            position: 'relative',
            zIndex: 1,
            minHeight: 103,
            [theme.breakpoints.down(385)]: {
                minHeight: 300,
            },
        },
        content: {
            display: 'flex',
            justifyContent: 'space-between',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 2,
            padding: theme.spacing(3),
            height: '100%',
            width: '100%',
            [theme.breakpoints.down(768)]: {
                flexDirection: 'column',
                justifyContent: 'flex-start',
                padding: theme.spacing(2),
            },
        },
        title: {
            fontSize: 26,
            margin: 0,
            lineHeight: '120%',
            [theme.breakpoints.down(768)]: {
                fontSize: 22,
            },
        },
        textWrap: {},
        text: {
            fontSize: 15,
            fontWeight: 500,
            marginTop: theme.spacing(1),
            marginBottom: 0,
            lineHeight: '120%',
            [theme.breakpoints.down(768)]: {
                margin: '16px 0',
            },
            [theme.breakpoints.down(385)]: {
                margin: '12px 0',
            },
        },
        button: {
            background: '#fff',
            color: '#1673D6',
            borderRadius: theme.spacing(1),
            minHeight: 'inherit',
            padding: theme.spacing(2),
            '&:hover': {
                color: '#fff',
            },
            [theme.breakpoints.down(385)]: {
                padding: theme.spacing(1.5),
            },
        },
    }),
    { name: 'HotelBanner' }
);
