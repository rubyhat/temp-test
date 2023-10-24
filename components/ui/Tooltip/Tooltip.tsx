import React, { FC, useMemo } from 'react';
import BaseTooltip, { TooltipProps } from '@material-ui/core/Tooltip';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        tooltip: {
            padding: '11px 16px',
            fontSize: 12,
        },
        variantPrimary: {
            backgroundColor: theme.palette.primary.main,
        },
        variantWhite: {
            backgroundColor: '#FFF',
            color: theme.palette.text.primary,
            boxShadow: theme.atlas.shadows.bottom,
        },
    }),
    { name: 'Tooltip' }
);

type Props = TooltipProps & {
    variant?: 'primary' | 'white';
};

export const Tooltip: FC<Props> = props => {
    const { children, variant = 'primary', ...rest } = props;
    const classes = useStyles();

    const tooltipClasses = useMemo(
        () => ({
            tooltip: clsx(classes.tooltip, {
                [classes.variantPrimary]: variant === 'primary',
                [classes.variantWhite]: variant === 'white',
            }),
        }),
        [variant]
    );

    return (
        <BaseTooltip classes={tooltipClasses} {...rest}>
            {children}
        </BaseTooltip>
    );
};
