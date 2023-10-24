import { makeStyles, Theme } from '@material-ui/core/styles';
import { AtlasTheme } from 'typings/atlas-theme';

interface Props {
    isDesktop: boolean;
}

export const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        root: {
            padding: theme.spacing(2),
            margin: theme.spacing(2),
            borderRadius: theme.spacing(1),
            boxShadow:
                '0px 1px 8px 1px rgba(0, 0, 0, 0.08), 0px 0px 16px 2px rgba(0, 0, 0, 0.04), 0px -1px 2px rgba(0, 0, 0, 0.04)',
        },
        buttonWrap: {
            textAlign: 'center',
        },
        button: {
            width: 44,
            height: 44,
            minWidth: 44,
            minHeight: 44,
            borderRadius: theme.spacing(1),
        },
    }),
    { name: 'SeatButton' }
);
