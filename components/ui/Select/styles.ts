import { makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 220,
    },
    select: {
        '& .MuiSelect-root:focus': {
            backgroundColor: 'unset',
        },
    },
    menu: {
        '& .MuiMenu-paper': {
            marginTop: 2,
            borderRadius: 3,
            boxShadow:
                '0px 6px 12px rgba(8, 78, 104, 0.18), 0px 0px 2px rgba(8, 78, 104, 0.26)',
        },
        '& .MuiMenu-list': {
            paddingTop: 0,
            paddingBottom: 0,
        },
    },
    menuItem: {
        color: 'rgba(2, 10, 13, 0.9)',
        padding: '14px 16px',
        borderBottom: '1px solid rgba(3, 44, 59, 0.16)',

        '&:hover, &.Mui-selected:hover': {
            backgroundColor: 'rgba(7, 95, 250, 0.08)',
        },

        '&.Mui-selected': {
            backgroundColor: 'unset',
        },
    },
    icon: {
        color: 'rgba(8, 41, 59, 0.38)',
    },
}));
