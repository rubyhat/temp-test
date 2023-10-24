import { makeStyles, Theme } from '@material-ui/core/styles';
import { AtlasTheme } from 'typings/atlas-theme';

export const useStyles = makeStyles((theme: Theme & AtlasTheme) => ({
    root: {
        ...theme.atlas.appBar.marginTop(-56),
    },
    success: {
        backgroundColor: '#00B674',
    },
    alert: {
        backgroundColor: '#E62E4F',
    },
    error: {
        backgroundColor: '#0F183D',
    },
    message: {
        fontSize: 16,
    },
}));
