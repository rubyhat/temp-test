import React, { FC } from 'react';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { List } from '../ui/List/List';
import { Divider } from '@material-ui/core';
import { useRouter } from 'next/router';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            backgroundColor: '#FFF',
            borderRadius: 8,
            boxShadow:
                '0px 0px 2px rgba(8, 78, 104, 0.18), 0px 2px 4px rgba(8, 78, 104, 0.12)',
        },
        listItemText: {
            fontWeight: 500,
        },
        /* Styles applied to the `ListItemIcon` component. */
        listItemIcon: {
            minWidth: 'unset',
        },
        listDivider: {
            width: '90%',
            margin: '0 auto',
            backgroundColor: theme.atlas.palette.background.grey100,
        },
    }),
    { name: 'HelpMenuList' }
);

type HelpMenuItem = {
    pathname: string;
    label: string;
};

type Props = {
    items: HelpMenuItem[];
    className?: string;
};

export const HelpMenuList: FC<Props> = props => {
    const { items, className } = props;
    const classes = useStyles();
    const router = useRouter();

    const handleClick = (pathname: string) => () => {
        router.replace(pathname);
    };

    return (
        <List className={clsx(classes.root, className)}>
            {items.map((item, i) => (
                <React.Fragment key={i}>
                    <ListItem button onClick={handleClick(item.pathname)}>
                        <ListItemText
                            primaryTypographyProps={{
                                className: classes.listItemText,
                            }}
                            primary={item.label}
                        />

                        <ListItemIcon className={classes.listItemIcon}>
                            <KeyboardArrowRightIcon />
                        </ListItemIcon>
                    </ListItem>
                    {i !== items.length - 1 && (
                        <Divider className={classes.listDivider} />
                    )}
                </React.Fragment>
            ))}
        </List>
    );
};
