import { Theme, makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(
    (theme: Theme) => ({
        /* Styles applied to the badge `span` element if `variant="square"`. */
        square: {
            borderRadius: theme.shape.borderRadius,
        },
    }),
    { name: 'Badge' }
);
