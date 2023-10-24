import { makeStyles, Theme } from '@material-ui/core/styles';
import { AtlasTheme } from 'typings/atlas-theme';

export const useStyles = makeStyles((theme: Theme & AtlasTheme) => ({
    dialog: {
        borderRadius: theme.spacing(1),
        width: '100%',
        maxWidth: '500px',
        // margin: theme.spacing(2),
    },
    header: {
        display: 'flex',
        flexDirection: 'column',
    },
    close: {
        alignSelf: 'flex-end',
        marginRight: '-12px',
    },
    title: {
        alignSelf: 'center',
        paddingTop: theme.spacing(0.5),
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: theme.spacing(2),
        fontSize: theme.spacing(2),
    },
    content: {
        padding: theme.spacing(4),
        '&:first-child': {
            paddingTop: theme.spacing(2),
        },
    },
    form: {},
    fieldWrap: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    inputWrap: {
        width: '100%',
        '& .MuiInputBase-root': {
            borderRadius: theme.spacing(1),
        },
    },
    input: {
        borderRadius: theme.spacing(1),
    },
    label: {
        fontWeight: 400,
        fontSize: theme.spacing(1.5),
        lineHeight: `${theme.spacing(1.75)}px`,
        marginBottom: theme.spacing(0.5),
    },
    fileButton: {
        padding: theme.spacing(2),
        borderRadius: theme.spacing(1),
        fontSize: theme.spacing(2),
        fontWeight: 600,
        textTransform: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    fileButtonIcon: {
        marginRight: theme.spacing(1),
    },
    checkboxLink: {
        textDecoration: 'none',
        '& a': {
            color: '#2A5FCF',
        },
    },
    formSubmitButton: {
        display: 'block',
        padding: '16px 24px',
        fontSize: theme.spacing(2),
        borderRadius: theme.spacing(1),
        textTransform: 'none',
        margin: '0 auto',
    },
    fileInfo: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    fileTitle: {
        color: '#212B2F',
        fontSize: theme.spacing(2),
        marginBottom: theme.spacing(0.5),
    },
    fileSubtitle: {
        fontSize: theme.spacing(1.5),
        color: '#68787D',
    },
    progressWrap: {
        display: 'flex',
        justifyContent: 'center',
    },
}));
