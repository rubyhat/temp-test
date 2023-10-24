import React, { FC } from 'react';
import parseISO from 'date-fns/parseISO';
import clsx from 'clsx';
import ListItem from '@material-ui/core/ListItem';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { List } from '../ui/List/List';
import { MobileDialog } from '../ui/MobileDialog';
import { RideBenefitsList } from '../RideBenefitsList';
import { RideDetailsList } from '../RideDetailsList';
import { Route } from '../Route';
import { RideDto, RideDtoBenefitsEnum } from 'swagger/client';
import { useTranslation } from 'i18n';
import { formatBusColor, formatBusName } from 'utils/ride';
import { format } from 'utils/date';

const useStyles = makeStyles(
    (theme: Theme) => ({
        /* Styles applied to the root element. */
        route: {
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2),
        },
        /* Styles applied to the List component. */
        list: {
            backgroundColor: '#FFF',
        },
        /* Styles applied to the container `div` element. */
        container: {
            paddingBottom: 88 + theme.spacing(2), // 88 == ActionBar height
        },
    }),
    { name: 'BookingRideDetailsDialog' }
);

type Props = {
    open: boolean;
    onClose: () => void;
    ride: RideDto;
};

/**
 * Диалог с деталями рейса на странице букинга.
 * Аналогичен <RideDetailsDialog /> в серпе.
 *
 * @param props
 * @constructor
 */
export const BookingRideDetailsDialog: FC<Props> = props => {
    const { open, onClose, ride } = props;
    const classes = useStyles();
    const { t } = useTranslation();
    const title = `${ride.from.desc} – ${ride.to.desc}`;
    const departureDate = format(parseISO(ride.departure), 'd MMM, EEEEEE');

    const { bus } = ride;
    const busName = bus ? formatBusName(bus) : '';
    // todo: use bus type from api
    const isMeteor =
        ride.benefits && ride.benefits.includes(RideDtoBenefitsEnum.Meteor);
    const isBigBus =
        ride.benefits && ride.benefits.includes(RideDtoBenefitsEnum.BigBus);
    const busType =
        ride.rideType === 'shuttle'
            ? t('shuttle')
            : isBigBus
            ? t('bus')
            : isMeteor
            ? t('benefitMeteor')
            : t('minibus');

    const rideDetailsItems = [
        {
            name: t('busName'),
            value: busName,
        },
        {
            name: t('busType'),
            value: busType,
        },
        {
            name: t('busColor'),
            value: bus && bus.color ? formatBusColor(bus.color) : '',
        },
        {
            name: t('partnerName'),
            value: ride.freighter ? ride.freighter.name : ride.carrier,
        },
        {
            name: t('refundConditions'),
            value: ride.refundConditions,
            collapsed: true,
            html: true,
        },
        {
            name: t('shuttleRules'),
            value: ride.rideType === 'shuttle' && t('shuttleRulesDesc'),
            collapsed: true,
            html: true,
        },
        {
            name: t('luggageRules'),
            value:
                ride.luggage &&
                ride.luggage.available &&
                ride.luggage.description,
            collapsed: true,
            html: true,
        },
        {
            name: t('petsRules'),
            value:
                ride.animals &&
                ride.animals.available &&
                ride.animals.description,
            collapsed: true,
            html: true,
        },
    ];

    return (
        <MobileDialog
            open={open}
            onClose={onClose}
            title={title}
            subtitle={departureDate}
            titleOverflowHidden
            startIcon="close"
        >
            <div className={classes.container}>
                <List className={clsx(classes.route, classes.list)}>
                    <ListItem>
                        <Route
                            departureDate={ride.departure}
                            arrivalDate={ride.arrival as string} // @todo fix GDS types
                            departureTimezone={ride.from.timezone}
                            arrivalTimezone={ride.to.timezone}
                            fullWidth
                        />
                    </ListItem>
                </List>

                <List className={classes.list}>
                    <RideDetailsList items={rideDetailsItems} />
                    {ride.benefits && (ride.benefits as string[]).length > 0 ? ( // @todo GDS types
                        <RideBenefitsList
                            title={t('search:benefits')}
                            items={ride.benefits as any}
                        />
                    ) : null}
                </List>
            </div>
        </MobileDialog>
    );
};
