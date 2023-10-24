import { makeStyles, Theme } from '@material-ui/core/styles';
import { AtlasTheme } from 'typings/atlas-theme';

export const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        successCard: {
            backgroundColor: theme.palette.secondary.main,
            color: '#FFF',
            padding: theme.spacing(3, 2),
            ...theme.atlas.appBar.paddingTop(theme.spacing(2)),
            [theme.breakpoints.up('sm')]: {
                borderRadius: theme.spacing(1),
                boxShadow:
                    '0px 1px 8px 1px rgba(0, 0, 0, 0.08), 0px 0px 16px 2px rgba(0, 0, 0, 0.04), 0px -1px 2px rgba(0, 0, 0, 0.04)',
            },
        },
        successCardDesc: {
            marginTop: theme.spacing(1),
            color: 'rgba(255, 255, 255, 0.64)',
        },
    }),
    { name: 'SuccessCard' }
);
