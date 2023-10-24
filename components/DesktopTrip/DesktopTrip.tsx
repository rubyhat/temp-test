import React, { FC } from 'react';
import Grid from '@material-ui/core/Grid';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { CurrencySymbol } from 'utils/currency';
import { DesktopTripDetails } from 'components/DesktopTripDetails';
import { DesktopTripPriceColumn } from './DesktopTripPriceColumn';
import { DesktopTripStopColumn } from './DesktopTripStopColumn';
import { PriceButton } from '../PriceButton';
import { SearchDto } from 'swagger/client';
import { TripFeature } from '../Trip/TripFeature';
import { getMilesReward } from 'utils/miles';
import { rideMinPrice } from 'utils/ride';
import {
    betweenSmAndMdQueryDown,
    useBetweenSmAndMdMediaQuery,
} from 'hooks/useBetweenSmAndMdMediaQuery';
import { useRideWithFilters } from 'hooks/useRideWithFilters';
import { useSAAS } from 'hooks/useSAAS';
import { useTranslation } from 'i18n';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {},
        /* Styles applied to the card `div` element. */
        card: {
            background: '#fff',
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: theme.atlas.shadows.bottom,
            position: 'relative',
        },
        /* Styles applied to the container `div` element. */
        container: {
            display: 'flex',
            padding: theme.spacing(2, 2),
        },
        departureTripStopColumn: {},
        arrivalTripStopColumn: {
            marginLeft: theme.spacing(1),
        },

        priceColumn: {
            marginRight: theme.spacing(2),

            [theme.breakpoints.only('lg')]: {
                marginRight: theme.spacing(4),
            },
        },

        bookingButton: {
            [`@media ${betweenSmAndMdQueryDown}`]: {
                width: 100,
            },
            width: 175,
        },
    }),
    { name: 'DesktopTrip' }
);

type Props = {
    onClickBooking: (rideId: string) => void;
    ride: SearchDto;
    className?: string;
};

export const DesktopTrip: FC<Props> = props => {
    const { onClickBooking, ride, className } = props;
    const classes = useStyles();
    const { t } = useTranslation();
    const { isAtlas, isMioTaxi } = useSAAS();
    const isBetweenSmAndMd = useBetweenSmAndMdMediaQuery();

    const {
        departureDate,
        showDepartureDate,
        arrivalDate,
        showArrivalDate,
        pickupStopName,
        dischargeStopName,
        passengers,
    } = useRideWithFilters(ride);

    const currency = ride.currency as CurrencySymbol;
    const price = rideMinPrice(ride.price, ride.onlinePrice, ride.paymentTypes);
    const milesReward = getMilesReward(ride);
    const priceButtonSubtitle =
        isAtlas && milesReward > 0
            ? t('milesRewardButtonText', {
                  miles:
                      milesReward +
                      ' ' +
                      t('miles', {
                          count: milesReward,
                          context: milesReward % 10 === 1 ? '1' : '2',
                      }),
              })
            : null;

    const handleClick = () => onClickBooking(ride.id);

    const tripNode = (
        <div className={classes.card}>
            <div className={classes.container}>
                <Grid container justify="flex-start">
                    <Grid item md={3}>
                        <DesktopTripStopColumn
                            className={classes.departureTripStopColumn}
                            datetime={departureDate}
                            city={ride.from.desc}
                            stop={pickupStopName}
                            showDate={showDepartureDate}
                        />
                    </Grid>

                    <Grid item md={3}>
                        <DesktopTripStopColumn
                            className={classes.arrivalTripStopColumn}
                            datetime={arrivalDate}
                            city={ride.to.desc}
                            stop={dischargeStopName}
                            showDate={showArrivalDate}
                            showArrivalTime={!isMioTaxi}
                        />
                    </Grid>

                    <Grid
                        item
                        md="auto"
                        style={{
                            marginLeft: 'auto',
                        }}
                    >
                        {ride.freeSeats > 0 ? (
                            <DesktopTripPriceColumn
                                className={classes.priceColumn}
                                ride={ride}
                            />
                        ) : null}
                    </Grid>

                    <Grid item md="auto">
                        <PriceButton
                            className={classes.bookingButton}
                            onClick={handleClick}
                            title={
                                isMioTaxi
                                    ? t('search:bookNowTaxi')
                                    : t('search:bookNow')
                            }
                            subtitle={
                                isBetweenSmAndMd ? null : priceButtonSubtitle // не отображать "До 10 миль на ваш счет" на маленьких десктоп экранах
                            }
                            price={price}
                            currency={currency}
                            freeSeats={isBetweenSmAndMd ? 0 : ride.freeSeats} // не отображать "Свободно n+ мест" на маленьких десктоп экранах
                            passengers={passengers}
                            variant={
                                ride.freeSeats === 0 ? 'no-seats' : 'active'
                            }
                            fullWidth
                        />
                    </Grid>
                </Grid>
            </div>

            <DesktopTripDetails ride={ride} />
        </div>
    );

    return (
        <div className={clsx(classes.root, className)}>
            <TripFeature
                bus={ride.bus}
                rideType={ride.rideType}
                benefits={ride.benefits}
                ride={ride}
            >
                {tripNode}
            </TripFeature>
        </div>
    );
};
