import { makeStyles, Theme } from '@material-ui/core/styles';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles((theme: Theme & AtlasTheme) => ({
    modalContent: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
        height: '100%',
        padding: 16,
    },
    modalTitle: {
        fontSize: '24px',
        fontWeight: 700,
        color: theme.atlas.palette.text.trinity,
    },
    modalSubTitle: {
        fontSize: '14px',
        color: theme.atlas.palette.text.base,
        marginTop: 16,
        marginBottom: 24,
        maxWidth: 300,
        alignSelf: 'center',
        fontWeight: 500,
    },
    modalButton: {},
    modalTextLate: {
        fontSize: 16,
        padding: 16,
        color: theme.atlas.palette.text.base,
        opacity: 0.5,
        fontWeight: 500,
        cursor: 'pointer',
    },
}));

export default useStyles;
