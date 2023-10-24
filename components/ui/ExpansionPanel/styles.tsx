import { makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) => ({
    activator: {
        textTransform: 'unset',
        fontSize: 16,
        justifyContent: 'left',
    },
    icon: {
        marginLeft: theme.spacing(1.5),
        marginRight: theme.spacing(2.5),
    },
    collapse: {
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
    },
    title: {},
}));
