import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { AtlasTheme } from 'typings/atlas-theme';

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {},
        container: {
            flexGrow: 1,
            position: 'relative',
        },
        paper: {
            borderRadius: 3,
            boxShadow:
                '0px 6px 12px rgba(8, 78, 104, 0.18), 0px 0px 2px rgba(8, 78, 104, 0.26)',
            left: 0,
            marginTop: theme.spacing(1),
            position: 'absolute',
            right: 0,
            zIndex: 1,
        },
        inputRoot: {
            flexWrap: 'wrap',
        },
        inputInput: {
            flexGrow: 1,
            width: 'auto',
        },
        menuItem: {
            color: 'rgba(2, 10, 13, 0.9)',
            paddingBottom: theme.spacing(1.5),
            paddingTop: theme.spacing(1.5),

            '&:hover, &.Mui-selected:hover, &.Atlas-selected': {
                backgroundColor: 'rgba(7, 95, 250, 0.08)',
            },
        },
        textField: {},
        divider: {
            backgroundColor: 'rgba(3, 44, 59, 0.16)',
        },
    })
);
