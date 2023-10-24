import React, { FC, ReactNode } from 'react';
import Divider from '@material-ui/core/Divider';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { List } from '../ui/List/List';
import { RideConditionItem } from './RideConditionItem';
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
        },
    }),
    { name: 'RideConditionsCard' }
);

export type RideCondition = {
    name: string;
    value: ReactNode | null;
    collapsed?: boolean;
    html?: boolean;
};

type RideConditionsCardProps = {
    className?: string;
    items?: RideCondition[];
    disableGutters?: boolean;
};

export const RideConditionsCard: FC<RideConditionsCardProps> = props => {
    const { className, items = [], disableGutters } = props;
    const classes = useStyles();

    const filteredItems = items.filter(item => !!item.value);

    return (
        <List className={clsx(classes.root, className)}>
            {filteredItems.map((item, i) => {
                return (
                    <React.Fragment key={i}>
                        <RideConditionItem
                            item={item}
                            disableGutters={disableGutters}
                        />
                        {i < filteredItems.length - 1 ? (
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
