import { makeStyles, Theme } from '@material-ui/core/styles';

interface ComponentProps {
    isOpen: boolean;
}

const useStyles = makeStyles<Theme, ComponentProps>(
    theme => ({
        root: {
            zIndex: 1,
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            width: '100%',
            display: props => (props.isOpen ? 'block' : 'none'),
        },
        cookieContainer: {
            display: 'flex',
            justifyContent: 'center',
            borderRadius: '0',
            [theme.breakpoints.up('xs')]: {
                padding: '16px 16px',
            },
            [theme.breakpoints.up('sm')]: {
                padding: '8px 24px',
            },
            [theme.breakpoints.up('md')]: {
                padding: '8px 24px',
            },
        },
        cookieContent: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            maxWidth: '1232px',
            [theme.breakpoints.up('xs')]: {
                flexDirection: 'column',
            },
            [theme.breakpoints.up('sm')]: {
                flexDirection: 'row',
            },
            [theme.breakpoints.up('md')]: {
                flexDirection: 'row',
            },
        },
        textContainer: {
            display: 'flex',
            [theme.breakpoints.up('xs')]: {
                flexDirection: 'column',
                paddingBottom: '8px',
            },
            [theme.breakpoints.up('sm')]: {
                flexDirection: 'column',
                paddingBottom: '0',
            },
            [theme.breakpoints.up('md')]: {
                flexDirection: 'row',
                paddingBottom: '0',
            },
        },
        cookieText: {
            fontSize: '14px',
            lineHeight: '16px',
            marginRight: '4px',
        },
        linkText: {
            fontSize: '14px',
            lineHeight: '16px',
            color: '#1673D6',
            cursor: 'pointer',
        },
        cookieAcceptButton: {
            [theme.breakpoints.up('xs')]: {
                width: '100%',
            },
            [theme.breakpoints.up('sm')]: {
                width: 'max-content',
            },
            [theme.breakpoints.up('md')]: {
                width: 'max-content',
            },
        },
        buttonLabel: {
            textTransform: 'capitalize',
        },
    }),
    { name: 'CookieModal' }
);
export default useStyles;
