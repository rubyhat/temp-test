import React, { FC } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { ToggleButtonGroup, ToggleButtonGroupProps } from '@material-ui/lab';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            background: theme.atlas.gradients.inactive,
            borderRadius: theme.atlas.borderRadius.medium,
            border: `1px solid ${theme.atlas.palette.divider.default}`,
            display: 'flex',
        },
        grouped: {
            flexGrow: 1,

            '&:first-child': {
                borderRadius: theme.atlas.borderRadius.medium,
            },
            '&:not(:first-child)': {
                borderRadius: theme.atlas.borderRadius.medium,
            },
        },
    }),
    { name: 'SwitchingTabs' }
);

type SwitchingTabsProps = ToggleButtonGroupProps;

export const SwitchingTabs: FC<SwitchingTabsProps> = props => {
    const classes = useStyles();

    return (
        <ToggleButtonGroup
            {...props}
            classes={{
                root: classes.root,
                grouped: classes.grouped,
            }}
        />
    );
};
