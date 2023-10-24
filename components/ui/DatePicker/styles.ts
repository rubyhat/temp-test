import { makeStyles, Theme } from '@material-ui/core/styles';
import { AtlasTheme } from 'typings/atlas-theme';

export const useStyles = makeStyles((theme: Theme & AtlasTheme) => ({
    root: {
        color: 'rgba(2, 10, 13, 0.9)',
    },
    day: {
        width: 36,
        height: 36,
        fontSize: theme.typography.caption.fontSize,
        margin: '0 2px',
        color: 'inherit',
        borderRadius: 3,
    },
    nonCurrentMonthDay: {
        color: 'rgba(8, 41, 59, 0.38)',
    },
    selectedDate: {
        background: theme.palette.primary.main,
        color: theme.palette.common.white,
        '&:hover': {
            backgroundColor: theme.palette.primary.main,
        },
    },
    today: {
        fontWeight: 'bold',
    },
    past: {
        color: theme.atlas.palette.text.disabled,
    },
    weekend: {
        color: '#E62E4F',
    },
}));
