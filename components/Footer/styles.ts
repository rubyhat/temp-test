import { darken, makeStyles, Theme } from '@material-ui/core/styles';
import { AtlasTheme } from 'typings/atlas-theme';

export const useStyles = makeStyles((theme: Theme & AtlasTheme) => ({
    root: {
        backgroundColor: darken(theme.palette.primary.main, 0.7),
        color: '#FFF',
        fontSize: 16,
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        boxSizing: 'border-box',
        minHeight: 80,
        marginTop: 64,
        padding: '0 16px',
    },
    container: {
        display: 'flex',
        columnGap: '24px',
        rowGap: '24px',
    },
    items: {},
    item: {
        width: 'auto',
        padding: theme.spacing(2),
    },
    copyright: {
        color: 'rgba(255, 255, 255, 0.64)',

        '& a': {
            color: theme.atlas.palette.textInv.link,
            textDecoration: 'none',
        },
    },
    link: {
        color: theme.atlas.palette.textInv.link,
        textDecoration: 'none',
    },
    footer: {
        backgroundColor: '#0c1c3e',
        color: 'white',
        marginTop: 40,
        [theme.breakpoints.down('lg')]: {
            padding: '32px 0',
        },
        [theme.breakpoints.down('sm')]: {
            padding: '18px 0',
        },
        [theme.breakpoints.up('lg')]: {
            padding: '64px 0',
        },
    },
    iconsTitle: {
        fontWeight: 700,
        lineHeight: '120%',
        [theme.breakpoints.down('lg')]: {
            fontSize: '12px',
        },
        [theme.breakpoints.down('sm')]: {
            fontSize: '14px',
        },
        [theme.breakpoints.up('lg')]: {
            fontSize: '14px',
        },
    },
    mobileApps: {
        marginTop: '24px',
    },
    iconsRow: {
        display: 'flex',
        gap: '4px',
        marginTop: '12px',
    },
    icon: {
        height: '32px',
        width: '32px',
        lineHeight: '100%',
        borderRadius: '4px',
        backgroundColor: 'rgba(255, 255, 255, 0.16)',
        padding: '9px',
        transition: 'backgroundColor 300ms',
        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
        },
    },
    mobileAdditionalLinks: {
        display: 'flex',
        flexWrap: 'wrap',
        columnGap: '32px',
        rowGap: '12px',
        marginTop: '40px',

        '& > a': {
            fontSize: '12px',
            lineHeight: '120%',
        },
    },
    menuItem: {
        color: 'white',
        textDecoration: 'none',
    },
    bottomRow: {
        borderTop: '1px solid rgba(226, 226, 226, 0.2)',
        paddingTop: theme.spacing(4),
        marginTop: theme.spacing(4),
        display: 'flex',
        columnGap: '24px',
        rowGap: '24px',
        boxSizing: 'border-box',
    },
    type: {
        fontSize: '14px',
        lineHeight: '120%',
        color: '#68787d',
    },
    hiTitle: {
        fontSize: '14px',
        lineHeight: '120%',
        fontWeight: 700,
    },
    hiIcon: {
        marginTop: '12px',
        textDecoration: 'none',
    },
    description: {
        '& a': {
            color: 'white',
            textDecoration: 'none',
        },
    },
    desktopPhones: {
        [theme.breakpoints.down('lg')]: {
            marginBottom: '17px',
        },
        [theme.breakpoints.down('sm')]: {
            marginBottom: '28px',
        },
        [theme.breakpoints.up('lg')]: {
            marginBottom: '17px',
        },
    },
}));
