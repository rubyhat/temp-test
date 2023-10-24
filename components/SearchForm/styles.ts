import { makeStyles, Theme } from '@material-ui/core/styles';
import { AtlasTheme } from 'typings/atlas-theme';

export const useStyles = makeStyles((theme: Theme & AtlasTheme) => ({
    card: {
        boxSizing: 'border-box',
        display: 'flex',
        width: '100%',
        backgroundColor: 'transparent',
    },
    date: {
        width: '100%',
    },
    button: {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        paddingTop: 15,
        paddingBottom: 15,
        [theme.breakpoints.up('sm')]: {
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
        },
    },
    divider: {
        marginLeft: 12,
        marginRight: 12,
        '&.MuiDivider-vertical': {
            height: 'inherit',
            marginTop: 8,
            marginBottom: 8,
            marginLeft: 4,
            marginRight: 4,
        },
    },
    passengersSelect: {
        '& .MuiFilledInput-root, & .MuiSelect-select:focus': {
            backgroundColor: 'unset',
        },
        '& .MuiFormLabel-root': {
            color: theme.atlas.palette.text.disabled,
        },
    },
    inputContainer: {
        backgroundColor: theme.palette.background.paper,
    },
}));
