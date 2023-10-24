import React, { FC } from 'react';
import clsx from 'clsx';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import { TFunction } from 'next-i18next';
import camelCase from 'lodash/camelCase';
import upperFirst from 'lodash/upperFirst';

import { List } from '../ui/List/List';
import { ListSubheader } from '../ui/ListSubheader';
import { useTranslation } from 'i18n';
import { benefitsIconsMap, RideBenefit } from 'utils/benefits';

const useStyles = makeStyles(
    {
        /* Styles applied to the root element. */
        root: {
            backgroundColor: '#FFF',
        },
    },
    { name: 'RideBenefitsList' }
);

type Props = {
    /* Subheader title */
    title: string;
    items?: RideBenefit[];
    className?: string;
};

const renderListItem = (item: RideBenefit, t: TFunction) => {
    const IconComponent = benefitsIconsMap[item];

    return (
        <ListItem>
            <ListItemIcon>
                {IconComponent ? <IconComponent /> : null}
            </ListItemIcon>

            <ListItemText
                primary={t(`benefit${upperFirst(camelCase(item))}`, {
                    defaultValue: '',
                })}
            />
        </ListItem>
    );
};

export const RideBenefitsList: FC<Props> = props => {
    const { title, items = [], className } = props;
    const classes = useStyles();
    const { t } = useTranslation();

    return (
        <List
            subheader={<ListSubheader>{title}</ListSubheader>}
            className={clsx(classes.root, className)}
        >
            {items.map((item, i) => {
                return (
                    <React.Fragment key={item}>
                        {renderListItem(item, t)}
                        {i < items.length - 1 ? (
                            <Divider component="li" variant="inset" />
                        ) : null}
                    </React.Fragment>
                );
            })}
        </List>
    );
};
