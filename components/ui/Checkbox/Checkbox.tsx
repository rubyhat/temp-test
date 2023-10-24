import React, { FC } from 'react';
import BaseCheckbox, { CheckboxProps } from '@material-ui/core/Checkbox';

import { useStyles } from './styles';

export type Props = CheckboxProps;

export const Checkbox: FC<Props> = props => {
    const classes = useStyles(props);

    return <BaseCheckbox classes={classes} {...props} />;
};
