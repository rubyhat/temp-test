import { makeStyles, Theme } from '@material-ui/core/styles';
import { AtlasTheme } from 'typings/atlas-theme';

export const useStyles = makeStyles((theme: Theme & AtlasTheme) => ({
    accordion: {
        display: 'grid',
        gap: '16px',
        marginBottom: '16px',
    },

    accordionRoot: {
        backgroundColor: 'inherit',
        color: '#fff',
        '& .Mui-expanded': {
            margin: '0',
            minHeight: 'unset',
        },
    },

    accordionSummaryRoot: {
        padding: '0',
        margin: 0,
        minHeight: 'unset',
        '& .MuiIconButton-root': {
            margin: '0',
            padding: '0',
            minHeight: 'unset',
        },
    },

    accordionSummaryContent: {
        padding: '0',
        margin: '0',
    },

    accordionArrowIcon: {
        width: '25px',
        height: '25px',
        color: '#fff',
        margin: '0',
        padding: '0',
    },

    accordionSummeryType: {
        fontWeight: 700,
        fontSize: '16px',
        lineHeight: '120%',
    },

    accordionDetailsRoot: {
        padding: '16px 0 0',
    },

    accordionDetailsInner: {
        display: 'grid',
        rowGap: '16px',
    },

    accordionLink: {
        display: 'block',
        fontSize: '12px',
        lineHeight: '120%',
        color: 'white',
        textDecoration: 'none',
    },

    menuColumn: {
        display: 'grid',
        rowGap: '24px',
    },

    menuTitle: {
        lineHeight: '120%',
        fontWeight: 700,
        [theme.breakpoints.down('lg')]: {
            fontSize: '14px',
        },
        [theme.breakpoints.down('sm')]: {
            fontSize: '16px',
        },
        [theme.breakpoints.up('lg')]: {
            fontSize: '16px',
        },
    },

    menuItem: {
        lineHeight: '120%',
        width: 'fit-content',
        fontWeight: 700,
        [theme.breakpoints.down('lg')]: {
            fontSize: '12px',
        },
        [theme.breakpoints.down('sm')]: {
            fontSize: '12px',
        },
        [theme.breakpoints.up('lg')]: {
            fontSize: '16px',
        },
    },
}));
