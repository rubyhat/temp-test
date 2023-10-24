import { makeStyles, Theme } from '@material-ui/core/styles';
import { AtlasTheme } from 'typings/atlas-theme';

export const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        root: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
        },
        textWrap: {
            display: 'flex',
            alignItems: 'center',
        },
        text: { marginLeft: theme.spacing(2) },
        icon: {
            fill: '#68787D',
        },
        activeIcon: {
            fill: '#1673D6',
        },
        modalDialog: {
            borderRadius: theme.spacing(1),
            width: '100%',
            padding: 0,
        },
        modalContent: {
            display: 'flex',
            flexDirection: 'column',
            padding: 0,
            '&:first-child': {
                paddingTop: 0,
            },
        },
        modalHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: theme.spacing(2),
            boxShadow:
                ' 0px 1px 8px 1px rgba(0, 0, 0, 0.08), 0px 0px 16px 2px rgba(0, 0, 0, 0.04), 0px -1px 2px rgba(0, 0, 0, 0.04)',
        },
        modalTitle: {
            fontWeight: 700,
        },
        modalBody: {
            padding: '24px 16px',
        },
        modalFooter: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: theme.spacing(2),
            paddingBottom: theme.spacing(2),
            marginTop: 'auto',
            boxShadow:
                '0px 1px 8px 1px rgba(0, 0, 0, 0.08), 0px 0px 16px 2px rgba(0, 0, 0, 0.04), 0px -1px 2px rgba(0, 0, 0, 0.04)',
            [theme.breakpoints.up('md')]: {
                marginTop: 'inherit',
                boxShadow: 'none',
                paddingBottom: theme.spacing(4),
            },
        },
        modalButtonSubmit: {
            width: '100%',
            maxWidth: '160px',
            borderRadius: theme.spacing(1),
        },
        modalSeatCountCap: {
            color: '#68787D',
            fontWeight: 600,
        },
        noSeatsWrap: {
            padding: '16px 16px 0 16px',
        },
    }),
    { name: 'SelectSeatField' }
);
