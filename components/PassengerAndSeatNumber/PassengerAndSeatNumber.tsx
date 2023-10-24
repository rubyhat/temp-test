import { useStyles } from 'components/PassengerAndSeatNumber/styles';
import { Typo } from 'components/Typo/Typo';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { BookingState } from 'store/booking/types';

interface PassengerAndSeatNumber {
    numberOfPassengers: number;
}

export const PassengerAndSeatNumber = (props: PassengerAndSeatNumber) => {
    const { numberOfPassengers } = props;
    const numbers = Array.from(
        { length: numberOfPassengers },
        (_, index) => `№${index + 1}`
    );
    const classes = useStyles();
    const { t } = useTranslation();
    const { selectedSeats } = useSelector<RootState, BookingState>(
        rootState => rootState.booking
    );
    const renderPassengerAndSeatNumber = () => {
        return (
            <div className={classes.root}>
                <div>
                    <Typo className={classes.title} component="h6">
                        {t('selectSeatPassengerNumber')}
                        {numbers.join(', ')}
                    </Typo>
                    <Typo className={classes.subtitle}>
                        {t('selectSeatSeatNumber', {
                            seats: selectedSeats.join(', '),
                        })}
                    </Typo>
                </div>
            </div>
        );
    };
    return renderPassengerAndSeatNumber();
};
