import React, { FC } from 'react';
import Divider from '@material-ui/core/Divider';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { BookingButton } from './BookingButton';
import { SearchDto } from 'swagger/client';
import { TripFeature } from './TripFeature';
import { useRideWithFilters } from 'hooks/useRideWithFilters';
import { useSAAS } from 'hooks/useSAAS';
import { useTranslation } from 'i18n';
import { AtlasTheme } from 'typings/atlas-theme';
import parseISO from 'date-fns/parseISO';
import { format } from 'utils/date';
import { calculateTimeBeforeDeparture } from 'utils/time';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {},
        card: {
            display: 'flex',
            flexDirection: 'column',
            background: '#fff',
            borderRadius: theme.atlas.borderRadius.medium,
            overflow: 'hidden',
            boxShadow: theme.atlas.shadows.bottom,
            position: 'relative',
        },
        body: {
            display: 'flex',
            flexDirection: 'column',
            marginTop: theme.spacing(1),
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
        },
        /* Styles applied to the `Divider` component. */
        divider: {
            marginTop: theme.spacing(1),
            backgroundColor: theme.atlas.palette.divider.separator,
        },
        footer: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
        },
        bookingButton: {
            flexGrow: 1,
        },
        time: {
            fontSize: '20px',
        },
        timeInfo: {
            fontSize: '16px',
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2),
        },
        freeSeatstNull: {
            width: '100%',
            padding: theme.spacing(2),
            textAlign: 'center',
        },
    }),
    { name: 'Trip' }
);

type TripProps = {
    ride: SearchDto;
    className?: string;
    onClickDetails?: (rideId: string) => void;
    onClickBooking?: (rideId: string) => void;
    onClick?: (rideId: string) => void;
};

export const TripMioTaxi: FC<TripProps> = props => {
    const { className, onClickBooking = () => {}, ride, onClick } = props;
    const { freeSeats, benefits, bus, rideType } = ride;
    const classes = useStyles();
    const { t } = useTranslation();
    const { isAtlas } = useSAAS();
    const {
        departureDate,
        showDepartureDate,
        arrivalDate,
        showArrivalDate,
        pickupStopName,
        dischargeStopName,
        passengers,
    } = useRideWithFilters(ride);

    const handleBookingClick = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.stopPropagation();
        onClickBooking(ride.id);
    };
    const handleClick = () => {
        if (onClick) {
            onClick(ride.id);
        }
    };

    const dateObj = parseISO(departureDate);
    const time = format(dateObj, 'HH:mm');

    const timeBeforeDeparture = calculateTimeBeforeDeparture(
        departureDate,
        ride.to.timezone,
        t
    );

    const tripNode = (
        <>
            <div className={classes.card}>
                <div className={classes.body}>
                    <strong className={classes.time}>{'~' + time}</strong>
                    <p className={classes.timeInfo}>
                        Машина приедет за вами через
                        <strong> ~{timeBeforeDeparture}</strong>
                    </p>
                </div>

                <Divider className={clsx(classes.divider)} />

                <div className={classes.footer}>
                    {freeSeats > 0 ? (
                        <div className={classes.bookingButton}>
                            <BookingButton
                                ride={ride}
                                onClick={handleBookingClick}
                                passengers={passengers}
                                fullWidth
                            />
                        </div>
                    ) : (
                        <div className={classes.freeSeatstNull}>
                            Свободные места закончились
                        </div>
                    )}
                </div>
            </div>
        </>
    );

    // У рейсов без свободных мест другой стиль карточки,
    // поэтому лучше их не фичить.
    if (freeSeats > 0) {
        return (
            <div
                className={clsx(classes.root, className)}
                onClick={handleClick}
            >
                <TripFeature
                    bus={bus}
                    benefits={benefits}
                    rideType={rideType}
                    ride={ride}
                >
                    {tripNode}
                </TripFeature>
            </div>
        );
    } else {
        // freeSeats === 0
        return (
            <div
                className={clsx(classes.root, className)}
                onClick={handleClick}
            >
                {tripNode}
            </div>
        );
    }
};
