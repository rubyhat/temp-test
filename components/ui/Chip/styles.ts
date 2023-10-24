import { fade, makeStyles, Theme } from '@material-ui/core/styles';
import { AtlasTheme } from 'typings/atlas-theme';

export const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        root: {
            borderRadius: theme.atlas.borderRadius.light,
        },
        label: {
            fontWeight: 500,
        },
        labelSmall: {
            paddingTop: 2,
            paddingBottom: 2,
            paddingLeft: 6,
            paddingRight: 6,
        },
        sizeSmall: {
            fontSize: 14,
            lineHeight: theme.atlas.typography.body1.lineHeight,
        },
        colorPrimary: {
            backgroundColor: fade(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
        },
        colorSecondary: {
            backgroundColor: fade(theme.palette.secondary.main, 0.1),
            color: theme.palette.secondary.main,
        },
        colorDanger: {
            backgroundColor: fade(theme.palette.error.main, 0.1),
            color: theme.palette.error.main,
        },
    }),
    {
        name: 'Chip',
    }
);
