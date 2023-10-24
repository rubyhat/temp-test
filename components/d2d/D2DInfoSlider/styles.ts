import { makeStyles, Theme } from '@material-ui/core/styles';
import { AtlasTheme } from 'typings/atlas-theme';

export const useStyles = makeStyles((theme: Theme & AtlasTheme) => ({
    dialog: {
        backgroundColor: '#1154c7',
        height: '100%',
        color: theme.atlas.palette.background.white,
        padding: '16px 16px 0 16px',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
    },
    step: {
        display: 'block',
        width: '100%',
        height: '2px',
        backgroundColor: theme.atlas.palette.background.white,
        opacity: 0.3,
        marginRight: '4px',
    },
    stepActive: { opacity: 1 },
    closeBar: {
        position: 'relative',
        display: 'flex',
        justifyContent: 'flex-end',
        zIndex: 3,
    },
    chip: {
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
        borderRadius: '4px',
    },
    slider: {
        poistion: 'relative',
        display: 'flex',
        height: 'calc(100% - 50px)',
        '& > div:first-of-type': { overflowY: 'hidden' },
    },
    pagination: {
        width: '15%',
        height: '100%',
        position: 'absolute',
        top: 0,

        zIndex: 2,
    },
    toLeft: { left: 0 },
    toRight: { right: 0 },
    text: {
        marginBottom: '8px',
    },
}));
