import { makeStyles, Theme } from '@material-ui/core/styles';

import { AtlasTheme } from 'typings/atlas-theme';
const useStyles = makeStyles((theme: Theme & AtlasTheme) => ({
    modalContent: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
        height: '100%',
        padding: 30,
        [theme.breakpoints.down('sm')]: {
            padding: 16,
        },
    },
    modalHeader: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    modalCloseIcon: {
        marginRight: -30,
        marginTop: -30,
        [theme.breakpoints.down('sm')]: {
            marginRight: -16,
            marginTop: -16,
        },
    },
    modalTitle: {
        fontSize: '16px',
        fontWeight: 700,
        color: theme.atlas.palette.text.base,
        marginBottom: '20px',
    },
    modalSubTitle: {
        fontSize: '14px',
        maxWidth: 440,
        alignSelf: 'center',
        color: '#FF2D2D',
    },
    modalButtonGroup: {
        paddingTop: 20,
    },
    modalButton: {
        borderRadius: 8,
        padding: 14,
    },
    containerWidthSm: {
        alignItems: 'flex-end',
    },
    paper: {
        height: 'unset',
        borderRadius: '8px 8px 0 0',
    },
    paperRootWidthSm: {
        boxShadow: 'unset',
    },
}));

export default useStyles;
