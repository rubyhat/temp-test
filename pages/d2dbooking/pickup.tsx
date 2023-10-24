import React, { useRef, useState } from 'react';
import * as Sentry from '@sentry/browser';
import parseISO from 'date-fns/parseISO';
import { NextPage } from 'next';
import { Severity } from '@sentry/browser';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import {
    D2DStopsBottomSheet,
    peekHeight,
} from 'components/d2d/D2DStopsBottomSheet';
import { AppBar } from 'components/AppBar';
import { BookingState } from 'store/booking/types';
import { BookingStep, useD2dBookingGuard } from 'hooks/useD2dBookingGuard';
import { D2DStopsMap } from 'components/d2d/D2DStopsMap';
import { DenyBookingDialog } from 'components/DenyBookingDialog';
import { PersistentBottomSheetState } from 'components/ui/PersistentBottomSheet';
import { RIDE_SUCCESS, RideState } from 'store/ride/types';
import { RootState } from 'store';
import { StopsDto } from 'swagger/client';
import { ValidBeforeDialog } from 'components/ValidBeforeDialog';
import { bookingUpdatePickup } from 'store/booking/actions';
import { format } from 'utils/date';
import { nearestStop } from 'utils/map';
import { useTranslation } from 'i18n';

const useStyles = makeStyles(
    () => ({
        root: {
            marginBottom: 164,
        },
        mapContainer: {
            width: '100%',
            height: `calc(100vh - 56px - ${peekHeight}px)`, // - appBarHeight
        },
    }),
    { name: 'D2DBookingPickup' }
);

const D2DBookingPickup: NextPage = () => {
    const classes = useStyles();
    const router = useRouter();
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const { pickupValue } = useSelector<RootState, BookingState>(
        rootState => rootState.booking
    );

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

    // Map
    const mapContainerRef = useRef(null);

    const handleDragEnd = (lat: number, lng: number) => {
        if (!ride) {
            const errMessage =
                '[/d2dbooking/pickup] handleDragEnd: ride is undefined';
            console.warn(errMessage);
            Sentry.captureMessage(errMessage, Severity.Error);
            return;
        }

        const stop = nearestStop({ lat, lng }, ride.pickupStops as StopsDto[]);

        // if (stop) {
        //     updatePickup('pickupValue')(stop.id);
        // }
    };
    const handleMagnetizeEnd = (stop?: StopsDto) => {
        if (stop) {
            updatePickup('pickupValue')(stop.id);
            setBottomSheetStopNotAlowed(false);
        } else {
            setBottomSheetStopNotAlowed(true);
        }
        setBottomSheetState('expanded');
    };

    // Bottom sheet
    const [bottomSheetState, setBottomSheetState] = useState<
        PersistentBottomSheetState
    >('expanded');
    const [bottomSheetStopNotAlowed, setBottomSheetStopNotAlowed] = useState<
        Boolean
    >(false);
    const [open, setOpen] = useState(true);
    const handleClose = () => {
        setOpen(false);
    };

    const { passengers } = useSelector<RootState, BookingState>(
        rootState => rootState.booking
    );
    const { rideInfo: ride, bookParams, status } = useSelector<
        RootState,
        RideState
    >(rootState => rootState.ride);
    const currentStop = ride
        ? (ride.pickupStops || []).find(stop => stop.id === pickupValue)
        : null;

    const numberOfPassengers = Object.keys(passengers || {}).length;

    const dialogTitle = ride ? `${ride.from.desc} – ${ride.to.desc}` : '';
    const formattedDate = ride
        ? format(parseISO(ride.departure), 'd MMM, EEEEEE')
        : '';
    const dialogSubtitle = `${formattedDate} · ${numberOfPassengers} ${t(
        'people',
        {
            count: numberOfPassengers,
        }
    )}`;

    const handleAppBarCancel = () => {
        router.back();
    };

    const handleNextStep = () => {
        router.push({
            pathname: BookingStep.Dropoff,
            query: router.query,
        });
    };

    useD2dBookingGuard();

    if (status === RIDE_SUCCESS && ride && bookParams) {
        return (
            <div className={classes.root}>
                <AppBar
                    title={dialogTitle}
                    subtitle={dialogSubtitle}
                    titleOverflowHidden
                    shadow="none"
                    startIcon="back"
                    backAutoHide={false}
                    onBack={handleAppBarCancel}
                />

                <div className={classes.mapContainer} ref={mapContainerRef}>
                    <D2DStopsMap
                        value={pickupValue}
                        stops={ride.pickupStops as StopsDto[]}
                        defaultLatLng={ride.pickupStops && ride.pickupStops[0]}
                        onChange={updatePickup('pickupValue')}
                        containerEl={mapContainerRef}
                        onDragEnd={handleDragEnd}
                        onMagnetizeEnd={handleMagnetizeEnd}
                        onMouseDown={() => setBottomSheetState('collapsed')}
                    />

                    <D2DStopsBottomSheet
                        direction="departure"
                        onNext={handleNextStep}
                        PersistentBottomSheetProps={{
                            open,
                            onClose: handleClose,
                            state: bottomSheetState,
                            onStateChange: setBottomSheetState,
                        }}
                        stop={currentStop}
                        stopNotAlowed={bottomSheetStopNotAlowed}
                        destination={ride.from}
                        ride={ride}
                        bookParams={bookParams}
                    />
                </div>

                <DenyBookingDialog
                    availability={ride.bookingAvailable}
                    ride={ride}
                />

                <ValidBeforeDialog
                    departureDate={ride.departure}
                    departureTimezone={ride.from.timezone}
                    validBefore={ride.valid_before}
                />
            </div>
        );
    }

    return null;
};

D2DBookingPickup.getInitialProps = async () => {
    return {
        namespacesRequired: [
            'booking',
            'auth',
            'profile',
            'formErrors',
            'brand',
            'search',
        ],
    };
};

export default D2DBookingPickup;
