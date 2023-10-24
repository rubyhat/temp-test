import React, { FC } from 'react';
import ListItem, { ListItemProps } from '@material-ui/core/ListItem';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
    theme => ({
        /* Styles applied to the root element. */
        root: {},
    }),
    { name: 'TwoLineListItem' }
);

type TwoLineListItemProps = Omit<ListItemProps, 'button'> & {
    // Typescript limitations
    // @see: https://github.com/mui-org/material-ui/issues/14971
    button?: any;
};

export const TwoLineListItem: FC<TwoLineListItemProps> = props => {
    const { className, ...other } = props;
    const classes = useStyles();

    return <ListItem className={clsx(classes.root, className)} {...other} />;
};
