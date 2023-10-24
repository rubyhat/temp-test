import React, { FC } from 'react';
import Box from '@material-ui/core/Box';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

import { BusDto } from 'swagger/client';
import { Typo } from 'components/Typo/Typo';

const useStyles = makeStyles(
    theme => ({
        /* Styles applied to the root element. */
        root: {},
        busName: {
            textAlign: 'right',
            marginRight: theme.spacing(1),
        },
    }),
    { name: 'OrderCardBusType' }
);

type OrderCardBusTypeProps = {
    className?: string;
    bus: BusDto;
};

export const OrderCardBusType: FC<OrderCardBusTypeProps> = props => {
    const { className, bus } = props;
    const classes = useStyles();

    const busName = [bus.color && bus.color.name, bus.reg]
        .filter(Boolean)
        .join(', ');

    return (
        <div className={clsx(classes.root, className)}>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
            >
                <Typo color="textSecondary" component="div">
                    {bus.mark}
                </Typo>

                <Typo
                    className={classes.busName}
                    color="textPrimary"
                    component="div"
                >
                    {busName}
                </Typo>
            </Box>
        </div>
    );
};
