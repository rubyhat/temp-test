import { fade, makeStyles, Theme } from '@material-ui/core/styles';
import { AtlasTheme } from 'typings/atlas-theme';

export const useStyles = makeStyles((theme: Theme & AtlasTheme) => ({
    appBar: {
        backgroundColor: '#FFF',
        boxShadow: theme.atlas.shadows.bottom,
        ...theme.atlas.appBar.paddingTop(0),
    },
    toolbar: {
        '&.MuiToolbar-gutters': {
            [theme.breakpoints.up('sm')]: {
                paddingLeft: 16,
                paddingRight: 16,
            },
        },
    },
    cancelButton: {
        fontSize: 16,
        marginLeft: theme.spacing(2),
        textTransform: 'unset',
        '&:hover': {
            backgroundColor: 'unset',
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.atlas.palette.background.deepCold,
        width: '100%',
    },
    inputRoot: {
        width: '100%',
        color: theme.atlas.palette.text.base,
    },
    inputInput: {
        padding: theme.spacing(1, 4, 1, 1),
    },
    clearIcon: {
        width: theme.spacing(5),
        height: '100%',
        position: 'absolute',
        top: 0,
        right: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: theme.atlas.palette.text.disabled,
    },
    list: {
        ...theme.atlas.appBar.marginTop(0),
        [theme.breakpoints.up('sm')]: {
            marginTop: theme.spacing(8),
        },
    },
    /**
     * Стили только для MobileSuggest.
     * В будущем разделить файл стилей для CityAutocomplete
     * и MobileSuggest.
     **/
    /* Styles applied to the `listbox` component. */
    listbox: {
        overflow: 'auto',

        // 56px = AppBar height
        maxHeight:
            'calc(100vh - 56px - env(safe-area-inset-top) ' +
            '- env(safe-area-inset-bottom))',
        fallbacks: [
            {
                maxHeight:
                    'calc(100vh - 56px - constant(safe-area-inset-top) ' +
                    '- constant(safe-area-inset-bottom))',
            },
            {
                maxHeight: 'calc(100vh - 56px)',
            },
        ],
    },
    /* Styles applied to the option elements. */
    option: {
        '&[aria-selected="true"]': {
            backgroundColor: fade(theme.palette.primary.main, 0.16),
        },
        '&[data-focus="true"]': {
            backgroundColor: fade(theme.palette.primary.main, 0.08),
        },
        '&:active': {
            backgroundColor: fade(theme.palette.primary.main, 0.16),
        },
        '&[aria-disabled="true"]': {
            opacity: theme.palette.action.disabledOpacity,
            pointerEvents: 'none',
        },
    },
}));
