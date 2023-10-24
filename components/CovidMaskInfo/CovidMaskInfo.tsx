import React, { FC } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import clsx from 'clsx';

import { List } from 'components/ui/List/List';
import MaskIcon from './mask.svg';
import { useTranslation } from 'i18n';

const useStyles = makeStyles(
    (theme: Theme) => ({
        /* Styles applied to the root element. */
        root: {
            backgroundColor: theme.palette.common.white,
            borderRadius: 'inherit',
        },
    }),
    { name: 'CovidMaskInfo' }
);

type Props = {
    className?: string;
};

export const CovidMaskInfo: FC<Props> = props => {
    const { className } = props;
    const classes = useStyles();
    const { t } = useTranslation();

    return (
        <List className={clsx(classes.root, className)} disablePadding>
            <ListItem>
                <ListItemIcon>
                    <MaskIcon />
                </ListItemIcon>
                <ListItemText primary={t('dontForgetMask')} />
            </ListItem>
        </List>
    );
};
