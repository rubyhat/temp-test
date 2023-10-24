import React, { FC } from 'react';
import BaseList, { ListProps } from '@material-ui/core/List';

import { useStyles } from './styles';

export type Props = ListProps;

export const List: FC<Props> = props => {
    const classes = useStyles();

    return <BaseList className={classes.list} {...props} />;
};
