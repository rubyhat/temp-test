import React, { FC } from 'react';
import BugReportIcon from '@material-ui/icons/BugReport';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { List } from 'components/ui/List/List';
import { useTranslation } from 'i18n';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            backgroundColor: theme.palette.background.paper,
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
    { name: 'DebuggingMenu' }
);

type DebuggingMenuProps = {
    className?: string;
    onClick: (pathname: string) => void;
};

export const DebuggingMenu: FC<DebuggingMenuProps> = props => {
    const { className, onClick } = props;
    const classes = useStyles();
    const { t } = useTranslation();

    const handleClick = (pathname: string) => () => onClick(pathname);

    return (
        <div className={clsx(classes.root, className)}>
            <List>
                <ListItem
                    button
                    key="/debugging"
                    onClick={handleClick('/debugging')}
                >
                    <ListItemText primary={t('debugging')} />
                    <ListItemIcon className={classes.listItemIcon}>
                        <BugReportIcon />
                    </ListItemIcon>
                </ListItem>
            </List>
        </div>
    );
};
