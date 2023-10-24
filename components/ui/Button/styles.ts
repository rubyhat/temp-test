import { Theme, fade, makeStyles } from '@material-ui/core/styles';
import { AtlasTheme } from 'typings/atlas-theme';

export const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            ...theme.atlas.typography.body1,
            boxShadow: 'unset',
            minHeight: 56,
            textTransform: 'unset',
            '&:hover': {
                boxShadow: 'unset',
            },
            [theme.breakpoints.up('sm')]: {
                minHeight: 48,
            },
        },
        /* Styles applied to the root element if `variant="contained"`. */
        contained: {
            fontWeight: 700,
            '&.Mui-focusVisible': {
                boxShadow: 'unset',
            },
        },
        /* Styles applied to the root element if `variant="contained"` and `color="primary"`. */
        containedPrimary: {
            '&:hover': {
                backgroundColor: fade(theme.palette.primary.main, 0.88),
            },
            '&:active': {
                backgroundColor: fade(theme.palette.primary.main, 0.72),
            },
        },
        /* Styles applied to the root element if `variant="contained"` and `color="secondary"`. */
        containedSecondary: {
            '&:hover': {
                backgroundColor: fade(theme.palette.secondary.main, 0.88),
            },
            '&:active': {
                backgroundColor: fade(theme.palette.secondary.main, 0.72),
            },
        },
        /* Styles applied to the root element if `variant="outlined"` and `color="primary"`. */
        outlinedPrimary: {
            border: `1px solid ${theme.palette.primary.main}`,
            '&:active': {
                backgroundColor: fade(theme.palette.primary.main, 0.16),
            },
        },
        /* Styles applied to the root element if `variant="outlined"` and `color="secondary"`. */
        outlinedSecondary: {
            border: `1px solid ${theme.palette.secondary.main}`,
            '&:active': {
                backgroundColor: fade(theme.palette.secondary.main, 0.16),
            },
        },
        /* Styles applied to the root element if `variant="text"`. */
        text: {
            padding: '6px 16px',
        },
        /* Styles applied to the root element if `variant="text"` and `color="primary"`. */
        textPrimary: {
            '&:active': {
                backgroundColor: fade(theme.palette.primary.main, 0.16),
            },
        },
        /* Styles applied to the root element if `variant="text"` and `color="secondary"`. */
        textSecondary: {
            '&:active': {
                backgroundColor: fade(theme.palette.secondary.main, 0.16),
            },
        },
        /* Pseudo-class applied to the root element if `disabled={true}`. */
        disabled: {
            backgroundColor: theme.palette.action.disabledBackground,
        },
        /* Pseudo-class applied to the root element if `multiline={true}`. */
        multiline: {
            height: 64,
        },
        /* Styles applied to the `subtitle` element if `title` and `subtitle` are passed. */
        subtitle: {
            fontSize: theme.atlas.typography.caption.fontSize,
            fontWeight: 400,
            color: theme.atlas.palette.textInv.minor,
        },
    }),
    { name: 'Button' }
);
