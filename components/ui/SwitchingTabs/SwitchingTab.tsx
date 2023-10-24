import React, { FC } from 'react';
import { ToggleButton, ToggleButtonProps } from '@material-ui/lab';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            textTransform: 'unset',
            padding: theme.spacing(1, 2),
            fontSize: theme.atlas.typography.caption.fontSize,
            lineHeight: 1,
            borderRadius: theme.atlas.borderRadius.medium,
            border: 'none',

            color: theme.atlas.palette.text.trinity,
            fontWeight: 600,

            '&.Mui-selected': {
                color: theme.atlas.palette.text.base,
                backgroundColor: theme.palette.common.white,
                boxShadow: theme.atlas.shadows.superAbove,

                '&:hover': {
                    color: theme.atlas.palette.text.base,
                    backgroundColor: theme.palette.common.white,
                },
            },
        },
    }),
    { name: 'SwitchingTab' }
);

type SwitchingTabProps = ToggleButtonProps;

export const SwitchingTab: FC<SwitchingTabProps> = props => {
    const classes = useStyles();

    return (
        <ToggleButton
            {...props}
            classes={{
                root: classes.root,
            }}
            disableRipple
        />
    );
};
