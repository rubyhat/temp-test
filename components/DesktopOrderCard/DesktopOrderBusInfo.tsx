import React, { FC } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { BusDto, TicketDto } from 'swagger/client';
import { RootState } from 'store';
import { RideState } from 'store/ride/types';
import { useSelector } from 'react-redux';
import { Typo } from '../Typo/Typo';
import { formatBusColor, formatBusName } from 'utils/ride';
import { useTranslation } from 'i18n';

const useStyles = makeStyles(
    (theme: Theme) => ({
        /* Styles applied to the root element. */
        root: {},
        /* Styles applied to the item `div` element. */
        item: {
            marginBottom: theme.spacing(1),
        },
    }),
    { name: 'DesktopOrderBusInfo' }
);

type Props = {
    bus: BusDto;
    tickets: TicketDto[];
};

export const DesktopOrderBusInfo: FC<Props> = props => {
    const { bus, tickets } = props;
    const classes = useStyles();
    const { t } = useTranslation();
    const renderSeats = () => {
        const seats: string[] = [];
        tickets.forEach(ticket => {
            if (ticket.passenger.seat) seats.push(`№ ${ticket.passenger.seat}`);
        });
        return seats.join(', ');
    };
    const { rideInfo: ride } = useSelector<RootState, RideState>(
        rootState => rootState.ride
    );
    const isSeatingSchemeEnable =
        ride && ride.seatingScheme && ride.seatingScheme.length > 0;

    return (
        <div className={classes.root}>
            <Typo className={classes.item}>
                {t('order:transport')}: {formatBusName(bus)}
            </Typo>

            {bus.color ? (
                <Typo className={classes.item}>
                    {t('order:color')}: {formatBusColor(bus.color)}
                </Typo>
            ) : null}

            {bus.reg ? (
                <Typo className={classes.item}>
                    {t('order:busReg')}: {bus.reg}
                </Typo>
            ) : null}

            {isSeatingSchemeEnable && renderSeats().length > 0 && (
                <Typo className={classes.item}>
                    {t('selectSeatTitle')}: {renderSeats()}
                </Typo>
            )}
        </div>
    );
};
