import React, { FC, ReactNode } from 'react';
import clsx from 'clsx';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';

import { List } from '../ui/List/List';
import { RideDetailsListItem } from './RideDetailsListItem';

const useStyles = makeStyles(
    {
        /* Styles applied to the root element. */
        root: {
            backgroundColor: '#FFF',
        },
    },
    { name: 'RideDetailsList' }
);

export type RideDetail = {
    name: string;
    value: ReactNode | null;
    collapsed?: boolean;
    html?: boolean;
};

type Props = {
    className?: string;
    items?: RideDetail[];
    disableGutters?: boolean;
};

export const RideDetailsList: FC<Props> = props => {
    const { className, items = [], disableGutters } = props;
    const classes = useStyles();

    const filteredItems = items.filter(item => !!item.value);

    return (
        <List className={clsx(classes.root, className)}>
            {filteredItems.map((item, i) => {
                return (
                    <React.Fragment key={i}>
                        <RideDetailsListItem
                            item={item}
                            disableGutters={disableGutters}
                        />
                        {i < filteredItems.length - 1 ? (
                            <Divider component="li" variant="middle" />
                        ) : null}
                    </React.Fragment>
                );
            })}
        </List>
    );
};
