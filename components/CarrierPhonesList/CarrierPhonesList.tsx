import React, { FC } from 'react';
import Divider from '@material-ui/core/Divider';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { CarrierPhonesListItem } from './CarrierPhonesListItem';
import { List } from '../ui/List/List';

const useStyles = makeStyles(
    (theme: Theme) => ({
        /* Styles applied to the root element. */
        root: {
            backgroundColor: '#FFF',
            borderRadius: 'inherit',
        },
    }),
    { name: 'CarrierPhonesList' }
);

export type CarrierPhonesProps = {
    className?: string;
    phones: string[];
};

export const CarrierPhonesList: FC<CarrierPhonesProps> = props => {
    const { phones, className } = props;
    const classes = useStyles();

    return (
        <List className={clsx(classes.root, className)}>
            {phones.map((phone, i) => (
                <React.Fragment key={i}>
                    <CarrierPhonesListItem phone={phone} />

                    {i < phones.length - 1 ? (
                        <Divider component="li" variant="middle" />
                    ) : null}
                </React.Fragment>
            ))}
        </List>
    );
};
