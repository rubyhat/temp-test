import React, { FC } from 'react';
import BaseChip, { ChipProps } from '@material-ui/core/Chip';
import clsx from 'clsx';

import { useStyles } from './styles';

export type Props = Omit<ChipProps, 'color'> & {
    color?: 'default' | 'primary' | 'secondary' | 'danger';
};

export const Chip: FC<Props> = props => {
    const { className, color, ...other } = props;
    const classes = useStyles();

    return (
        <BaseChip
            className={clsx(className, {
                [classes.colorDanger]: color === 'danger',
            })}
            classes={classes}
            color={color !== 'danger' ? color : 'default'}
            {...other}
        />
    );
};
