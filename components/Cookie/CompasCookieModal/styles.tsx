import { makeStyles, Theme } from '@material-ui/core/styles';

interface ComponentProps {
    isOpen: boolean;
    isPrivacy: boolean;
    isOptions: boolean;
}

const useStyles = makeStyles<Theme, ComponentProps>(
    theme => ({
        wrapper: {
            zIndex: props => (props.isPrivacy && !props.isOptions ? 1 : 2000),
            position: 'fixed',
            height: '100vh',
            width: '100vw',
            top: '0px',
            backgroundColor: props =>
                props.isPrivacy && !props.isOptions
                    ? 'rgba(34, 79, 223, 0)'
                    : 'rgba(34, 79, 223, 0.2)',
            overflow: 'auto',
            display: props => (props.isOpen ? 'block' : 'none'),
        },
        root: {
            position: 'fixed',
            bottom: '0px',
            left: '0px',
            right: '0px',
            display: props => (props.isOpen ? 'block' : 'none'),
        },
        cookieContainer: {
            display: 'flex',
            justifyContent: 'center',
            borderRadius: '0',
            [theme.breakpoints.up('xs')]: {
                padding: '24px 16px',
            },
            [theme.breakpoints.up('sm')]: {
                padding: '24px 24px',
            },
            [theme.breakpoints.up('md')]: {
                padding: '24px 24px',
            },
        },
        cookieContent: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            maxWidth: '1232px',
            [theme.breakpoints.down('sm')]: {
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
            [theme.breakpoints.down('sm')]: {
                flexDirection: 'column',
                paddingBottom: '16px',
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
            lineHeight: '23px',
            marginRight: '34px',
        },
        linkText: {
            color: '#1673D6',
            cursor: 'pointer',
            fontWeight: 400,
            fontSize: '16px',
            lineHeight: '140%',
        },
        buttons: {
            display: 'flex',
            flexDirection: 'row',
            [theme.breakpoints.down('sm')]: {
                width: '100%',
            },
        },
        cookieAcceptButton: {
            height: '54px',
            width: '100%',
            borderRadius: '8px',
            [theme.breakpoints.up('sm')]: {
                minWidth: '143px',
            },
            [theme.breakpoints.up('md')]: {
                minWidth: '143px',
            },
            '&:first-child': {
                marginRight: theme.spacing(1),
            },
        },
        buttonLabel: {
            textTransform: 'none',
        },
        optionsRoot: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            width: '100%',
            overflow: 'auto',
            [theme.breakpoints.down(600)]: {
                background: '#FFFFFF',
            },
        },
        optionsWrapper: {
            zIndex: 2000,
            maxWidth: '660px',
            maxHeight: 'max-content',
            background: '#FFFFFF',
            padding: '0 32px 32px 32px',
            overflow: 'auto',
            [theme.breakpoints.down(600)]: {
                height: '100%',
                width: '100%',
            },
            [theme.breakpoints.up('sm')]: {
                borderRadius: '16px',
            },
        },
        optionsHeader: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            height: '56px',
        },
        closeIcon: {
            height: '24px',
            width: '24px',
        },
        optionsText: {
            display: 'flex',
            alignItems: 'center',
            fontWeight: 400,
            fontSize: '16px',
            lineHeight: '140%',
            color: '#1E1E1E',
            marginBottom: '34px',
        },
        optionsTitle: {
            display: 'flex',
            fontWeight: 400,
            fontSize: '20px',
            lineHeight: '140%',
            color: '#1E1E1E',
            marginBottom: '16px',
        },
        optionsTextContainer: {
            marginBottom: '34px',
        },
        radioGroup: {
            display: 'flex',
            flexDirection: 'row',
            marginBottom: '16px',
        },
        saveButton: {
            width: '130px',
        },
    }),
    { name: 'CookieModal' }
);
export default useStyles;
