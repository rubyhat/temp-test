import React, { FC } from 'react';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import camelCase from 'lodash/camelCase';
import clsx from 'clsx';
import upperFirst from 'lodash/upperFirst';
import { ListProps } from '@material-ui/core/List';
import { TFunction } from 'next-i18next';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { List } from '../ui/List/List';
import { SearchDto } from 'swagger/client';
import { benefitsIconsMap, RideBenefit } from 'utils/benefits';
import { useTranslation } from 'i18n';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            borderRadius: theme.atlas.borderRadius.medium,
            boxShadow: theme.atlas.shadows.bottom,
            backgroundColor: theme.palette.common.white,
        },
        /* Styles applied to the `Divider` component. */
        divider: {
            backgroundColor: theme.atlas.palette.divider.separator,
            marginLeft: theme.spacing(9),
        },
    }),
    { name: 'RideBenefitsCard' }
);

type RideBenefitsCardProps = {
    className?: string;
    ListProps?: ListProps;
    ride: SearchDto;
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

export const RideBenefitsCard: FC<RideBenefitsCardProps> = props => {
    const { className, ride, ListProps } = props;
    const { benefits = [] } = ride;
    const classes = useStyles();
    const { t } = useTranslation();

    if (benefits.length <= 0) {
        return null;
    }

    return (
        <List {...ListProps} className={clsx(classes.root, className)}>
            {benefits.map((item, i) => {
                return (
                    <React.Fragment key={item}>
                        {renderListItem(item, t)}
                        {i < benefits.length - 1 ? (
                            <Divider
                                className={classes.divider}
                                component="li"
                                variant="middle"
                            />
                        ) : null}
                    </React.Fragment>
                );
            })}
        </List>
    );
};
