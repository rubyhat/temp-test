import React, { FC } from 'react';
import BaseBadge, { BadgeProps } from '@material-ui/core/Badge';
import clsx from 'clsx';

import { useStyles } from './styles';

type Props = Omit<BadgeProps, 'variant'> & {
    variant?: 'standard' | 'dot' | 'square';
};

export const Badge: FC<Props> = props => {
    const { children, variant, ...rest } = props;
    const classes = useStyles();

    return (
        <BaseBadge
            classes={{
                badge: clsx({
                    [classes.square]: variant === 'square',
                }),
            }}
            variant={variant !== 'square' ? variant : undefined}
            {...rest}
        >
            {children}
        </BaseBadge>
    );
};
