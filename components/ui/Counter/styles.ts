import { makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) => ({
    grid: {
        width: 'auto',
        minWidth: 88,
        display: 'inline-flex',
    },
    fab: {
        width: 24,
        height: 24,
        minHeight: 24,
        boxShadow: 'none',
        '&:hover, &:active': {
            boxShadow: 'none',
            backgroundColor: 'rgba(7, 95, 250, 0.8)',
        },
        margin: theme.spacing(1),
    },
    text: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        fontSize: 16,
    },
}));
