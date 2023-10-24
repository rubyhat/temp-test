import React from 'react';
import Box from '@material-ui/core/Box';
import { Button } from 'components/ui/Button';
import { useStyles } from 'components/SeatButton/styles';
import IconDriverSVG from './assets/icon-driver.svg';
import IconExitSVG from './assets/icon-exit.svg';
import IconLadderSVG from './assets/icon-stairs.svg';
import IconWCSVG from './assets/icon-wc.svg';
import IconInvalidSVG from './assets/icon-disabled.svg';
import IconBaggageSVG from './assets/icon-luggage.svg';
import { usePlatform } from 'hooks/usePlatform';
import { bookingUpdateState } from 'store/booking/actions';
import {
    rideBookingSeating,
    ridePolling,
    rideUpdating,
} from 'store/ride/actions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import { RideState, RIDE_SUCCESS } from 'store/ride/types';
import { SeatingCellDto } from 'swagger/client';

type SeatType =
    | 'driver'
    | 'empty'
    | 'place'
    | 'wc'
    | 'ladder'
    | 'invalid'
    | 'baggage'
    | 'exit';

interface SeatButtonProps {
    cell: SeatingCellDto;
    selectedSeats: number[];
    numberOfPassengers: number;
}

export const SeatButton = (props: SeatButtonProps) => {
    const { isDesktop } = usePlatform();
    const { cell, selectedSeats, numberOfPassengers } = props;
    const classes = useStyles({ isDesktop });
    const dispatch = useDispatch();
    const { bookingStatus } = useSelector<RootState, RideState>(
        rootState => rootState.ride
    );
    const handleButtonClick = () => {
        if (cell.number !== undefined) {
            if (selectedSeats.includes(cell.number)) {
                const newArr = selectedSeats.filter(
                    x => ![cell.number].includes(x)
                );
                dispatch(bookingUpdateState({ selectedSeats: newArr }));
                dispatch(
                    rideBookingSeating({
                        bookingSeatNumber: cell.number,
                        bookingAction: 'unselected',
                    })
                );
            } else if (selectedSeats.length < numberOfPassengers) {
                const newArr = [...selectedSeats];
                newArr.push(cell.number);
                dispatch(bookingUpdateState({ selectedSeats: newArr }));
                dispatch(
                    rideBookingSeating({
                        bookingSeatNumber: cell.number,
                        bookingAction: 'selected',
                    })
                );
            }
        }
        // Обновлять схему рассадки при клике на место
        dispatch(rideUpdating());
    };
    const busIcons: Record<string, JSX.Element | string> = {
        driver: <IconDriverSVG />,
        empty: '',
        wc: <IconWCSVG />,
        ladder: <IconLadderSVG />,
        invalid: <IconInvalidSVG />,
        baggage: <IconBaggageSVG />,
        exit: <IconExitSVG />,
    };
    const renderSeatButton = () => {
        if (cell.type === 'place') {
            return (
                <Button
                    className={classes.button}
                    onClick={handleButtonClick}
                    variant={
                        selectedSeats.includes(cell.number as number)
                            ? 'contained'
                            : 'outlined'
                    }
                    color="primary"
                    disabled={
                        (!selectedSeats.includes(cell.number as number) &&
                            selectedSeats.length === numberOfPassengers) ||
                        cell.status !== 'free'
                    }
                >
                    {cell.number}
                </Button>
            );
        } else if (busIcons[cell.type]) {
            return busIcons[cell.type];
        } else {
            return null;
        }
    };
    return (
        <Box
            className={classes.buttonWrap}
            style={{
                gridRow: `span ${cell.along}`,
                gridColumn: `span ${cell.across}`,
            }}
        >
            {renderSeatButton()}
        </Box>
    );
};
