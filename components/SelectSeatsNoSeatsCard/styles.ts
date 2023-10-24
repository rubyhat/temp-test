import { makeStyles, Theme } from '@material-ui/core/styles';
import { AtlasTheme } from 'typings/atlas-theme';

export const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        noSeatsInfoCard: {
            padding: theme.spacing(2),
            borderRadius: theme.spacing(1),
            background: '#fff',
            border: '1px solid #e2e2e2',
            marginBottom: theme.spacing(3),
        },
        noSeatsInfoText: {
            marginTop: theme.spacing(1),
        },
    }),
    { name: 'SelectSeatsNoSeatsCard' }
);
