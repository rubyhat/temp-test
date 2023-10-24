import React, { FC } from 'react';
import BaseFab, { FabProps } from '@material-ui/core/Fab';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            textTransform: 'unset',
            backgroundColor: '#FFF',
            color: theme.atlas.palette.text.base,
            fontSize: theme.atlas.typography.body1.fontSize,
            boxShadow: theme.atlas.shadows.fly,
            '&:active': {
                boxShadow: theme.atlas.shadows.fly,
            },
            '&:hover': {
                backgroundColor: '#FFF',
                boxShadow: theme.atlas.shadows.fly,
            },
            '&.Mui-disabled': {
                boxShadow: theme.atlas.shadows.fly,
            },
            '&.Mui-focusVisible': {
                boxShadow: theme.atlas.shadows.fly,
            },
        },
        /* Styles applied to the root element if `variant="extended"`. */
        extended: {
            height: 56,
            borderRadius: 100,
            padding: '0 20px',
        },
    }),
    { name: 'Fab' }
);

type Props = FabProps;

export const Fab: FC<Props> = props => {
    const { children, ...rest } = props;
    const classes = useStyles(props);

    return (
        <BaseFab classes={classes} {...rest}>
            {children}
        </BaseFab>
    );
};
