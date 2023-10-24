import { makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) => ({
    steps: {
        padding: theme.spacing(2, 0),
        flexGrow: 1,
        overflowX: 'scroll',
        // Hide dimensionless scrollbar
        scrollbarWidth: 'none', // Firefox
        '&::-webkit-scrollbar': {
            display: 'none', // Safari + Chrome
        },
    },
    stepButton: {
        padding: '0 16px',
        '& .MuiStepLabel-label': {
            fontSize: 16,
            whiteSpace: 'nowrap',
            color: 'rgba(8, 41, 59, 0.38)',

            '&.MuiStepLabel-completed': {
                color: theme.palette.primary.main,
            },
            '&.MuiStepLabel-active': {
                color: 'rgba(2, 10, 13, 0.9)',
            },
        },
    },
    iconConnector: {
        color: 'rgba(8, 41, 59, 0.38)',
        margin: theme.spacing(0, 1),
    },
}));
