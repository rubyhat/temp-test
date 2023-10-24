import React, { FC } from 'react';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';

import { BookingState } from 'store/booking/types';
import { EndpointPickupTime } from '../EndpointPickupTime';
import { MapEndpointAutocomplete } from '../MapEndpointAutocomplete';
import { RootState } from 'store';
import { RideDto, StopsDto } from 'swagger/client';
import {
    bookingUpdateDropoff,
    bookingUpdatePickup,
} from 'store/booking/actions';
import { useTranslation } from 'i18n';
import { usePlatform } from 'hooks/usePlatform';
import { AtlasTheme } from 'typings/atlas-theme';
import { useSAAS } from 'hooks/useSAAS';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            padding: '0 16px',
            [theme.breakpoints.up('sm')]: {
                padding: 0,
            },
        },
        /* Styles applied to the step `List` component. */
        step: {
            marginTop: theme.spacing(2),
            padding: theme.spacing(2),
            paddingBottom: 0,
            backgroundColor: '#FFF',
            boxShadow: theme.atlas.shadows.bottom,
            borderRadius: theme.spacing(1),
            '& ~ &': {
                marginTop: theme.spacing(2),
            },
            '&:first-child': {
                marginTop: 0,
                padding: 0,
            },
            [theme.breakpoints.up('md')]: {
                boxShadow: theme.atlas.shadows.bottom,
                borderRadius: theme.spacing(1),
            },
        },
    }),
    { name: 'BookingStopsStep' }
);

type Props = {
    ride: RideDto;
    className?: string;
};

export const BookingStopsStep: FC<Props> = props => {
    const { ride, className } = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { isDesktop } = usePlatform();
    const { isMioTaxi } = useSAAS();

    const {
        pickupInputValue,
        pickupValue,
        pickupMapValue,
        dropoffInputValue,
        dropoffValue,
        dropoffMapValue,
    } = useSelector<RootState, BookingState>(rootState => rootState.booking);

    const updatePickup = (
        key: keyof Pick<
            BookingState,
            'pickupInputValue' | 'pickupValue' | 'pickupMapValue'
        >
    ) => (value: BookingState[typeof key]) => {
        dispatch(
            bookingUpdatePickup({
                [key]: value,
            })
        );
    };
    const updateDropoff = (
        key: keyof Pick<
            BookingState,
            'dropoffInputValue' | 'dropoffValue' | 'dropoffMapValue'
        >
    ) => (value: BookingState[typeof key]) => {
        dispatch(
            bookingUpdateDropoff({
                [key]: value,
            })
        );
    };

    const updatePickupStop = (stopId: StopsDto['id'] | null) => {
        dispatch(
            bookingUpdatePickup({
                pickupValue: stopId,
                pickupMapValue: stopId,
            })
        );
    };
    const updateDropoffStop = (stopId: StopsDto['id'] | null) => {
        dispatch(
            bookingUpdateDropoff({
                dropoffValue: stopId,
                dropoffMapValue: stopId,
            })
        );
    };

    return (
        <div className={clsx(classes.root, className)}>
            <List className={classes.step}>
                <ListItem>
                    <MapEndpointAutocomplete
                        inputValue={pickupInputValue}
                        onInputChange={updatePickup('pickupInputValue')}
                        value={pickupValue}
                        onChange={updatePickupStop}
                        mapValue={pickupMapValue}
                        onMapValueChange={updatePickup('pickupMapValue')}
                        suggestions={ride.pickupStops as StopsDto[]} // @todo fix GDS type
                        dialogTitle={
                            isMioTaxi
                                ? t('booking:selectPickupPointTaxi')
                                : t('booking:selectPickupPoint')
                        }
                        placeholder={
                            isMioTaxi
                                ? t('booking:selectPickupPointTaxi')
                                : t('booking:selectPickupPoint')
                        }
                        showClearIcon
                        sortByDatetime
                        filterDynamicStops={isDesktop}
                    />
                </ListItem>

                {pickupValue && !isMioTaxi ? (
                    <>
                        <Divider component="li" variant="middle" />

                        <EndpointPickupTime
                            value={pickupValue}
                            stops={ride.pickupStops as StopsDto[]}
                        />
                    </>
                ) : null}
            </List>

            {!isMioTaxi && (
                <List className={classes.step}>
                    <ListItem>
                        <MapEndpointAutocomplete
                            inputValue={dropoffInputValue}
                            onInputChange={updateDropoff('dropoffInputValue')}
                            value={dropoffValue}
                            onChange={updateDropoffStop}
                            mapValue={dropoffMapValue}
                            onMapValueChange={updateDropoff('dropoffMapValue')}
                            suggestions={ride.dischargeStops as StopsDto[]} // @todo fix GDS type
                            dialogTitle={t('booking:selectDropoffPoint')}
                            placeholder={t('booking:selectDropoffPoint')}
                            showClearIcon
                            sortByDatetime
                            filterDynamicStops={isDesktop}
                        />
                    </ListItem>

                    {dropoffValue ? (
                        <>
                            <Divider component="li" variant="middle" />

                            <EndpointPickupTime
                                value={dropoffValue}
                                stops={ride.dischargeStops as StopsDto[]}
                                dropoff
                            />
                        </>
                    ) : null}
                </List>
            )}
        </div>
    );
};
