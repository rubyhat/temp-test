import React, { FC } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Divider from '@material-ui/core/Divider';
import clsx from 'clsx';

import { List } from '../ui/List/List';

import { AtlasTheme } from 'typings/atlas-theme';
const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            backgroundColor: '#FFF',
            [theme.breakpoints.down('sm')]: {
                borderRadius: theme.spacing(1),
                boxShadow: theme.atlas.shadows.bottom,
            },
        },
        /* Styles applied to the `ListItemIcon` component. */
        listItemIcon: {
            minWidth: 'unset',
        },
    }),
    { name: 'ProfileMenuList' }
);

type ProfileMenuListItem = {
    pathname: string;
    label: string;
};

type Props = {
    items: ProfileMenuListItem[];
    onClick: (pathname: string) => void;
    className?: string;
};

export const ProfileMenuList: FC<Props> = props => {
    const { items, onClick, className } = props;
    const classes = useStyles();

    const handleClick = (pathname: string) => () => onClick(pathname);

    return (
        <div className={clsx(classes.root, className)}>
            <List>
                {items.map((item, i) => (
                    <React.Fragment key={item.pathname}>
                        <ListItem button onClick={handleClick(item.pathname)}>
                            <ListItemText primary={item.label} />
                            <ListItemIcon className={classes.listItemIcon}>
                                <KeyboardArrowRightIcon />
                            </ListItemIcon>
                        </ListItem>
                        {i !== items.length - 1 && (
                            <Divider component="li" variant="middle" />
                        )}
                    </React.Fragment>
                ))}
            </List>
        </div>
    );
};
