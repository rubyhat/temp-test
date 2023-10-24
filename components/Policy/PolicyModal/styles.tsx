import { makeStyles, Theme } from '@material-ui/core/styles';

import { AtlasTheme } from 'typings/atlas-theme';
const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {},
        policyContent: {
            padding: '16px',
            [theme.breakpoints.up('xs')]: {
                padding: '16px',
            },
            [theme.breakpoints.up('sm')]: {
                padding: '30px 24px',
            },
            [theme.breakpoints.up('md')]: {
                padding: '40px',
            },
        },
        policyTitle: {
            fontWeight: 600,
            [theme.breakpoints.up('sm')]: {
                fontSize: '26px',
                lineHeight: '31px',
            },
            [theme.breakpoints.up('md')]: {
                fontSize: '32px',
                lineHeight: '38px',
            },
        },
        policySubTitle: {
            fontWeight: 400,
            [theme.breakpoints.up('xs')]: {
                margin: '10px 0',
                fontSize: '14px',
                lineHeight: '16px',
            },
            [theme.breakpoints.up('sm')]: {
                margin: '20px 0',
                fontSize: '16px',
                lineHeight: '19px',
            },
            [theme.breakpoints.up('md')]: {
                fontSize: '18px',
                lineHeight: '21px',
            },
        },
        policyBody: {
            border: '1px solid',
            borderColor: theme.atlas.palette.background.grey300,
            [theme.breakpoints.up('xs')]: {
                padding: '14px 10px',
            },
            [theme.breakpoints.up('md')]: {
                padding: '8px',
            },
        },
        policyWrapperText: {
            // paddingRight: '8px',
            overflowY: 'scroll',
            scrollbarColor: '#EBEBEB', // For FireFox
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': {
                width: '6px',
            },
            '&::-webkit-scrollbar-track': {},
            '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#EBEBEB',
                borderRadius: '4px',
            },
        },
        policyText: { fontSize: '12px', lineHeight: '16px' },
        policyAcceptText: {
            lineHeight: '18px',
            textAlign: 'center',
            width: '100%',
            maxWidth: '550px',
            [theme.breakpoints.up('xs')]: {
                margin: '10px auto 15px',
                fontSize: '12px',
            },
            [theme.breakpoints.up('sm')]: {
                fontSize: '14px',
                margin: '20px auto 15px',
            },
            [theme.breakpoints.up('md')]: {},
        },
        policyButton: {
            width: '100%',
            margin: '0 auto',
            display: 'inherit',
            borderRadius: '8px',
            minHeight: '51px',
            [theme.breakpoints.up('md')]: {
                width: '440px',
            },
        },
        iframe: {
            border: 'none',
            width: '100%',
            height: '100%',
            [theme.breakpoints.up('xs')]: {
                minHeight: '200px',
            },
            [theme.breakpoints.up('sm')]: {
                minHeight: '250px',
            },
            [theme.breakpoints.up('md')]: {
                minHeight: '300px',
            },
        },
    }),
    { name: 'PolicyModal' }
);
export default useStyles;
