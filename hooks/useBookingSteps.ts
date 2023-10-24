import { useState } from 'react';
import { useSelector } from 'react-redux';

import { BookingState } from 'store/booking/types';
import { RootState } from 'store';
import { useTranslation } from 'i18n';
import { RideState } from 'store/ride/types';

export function useBookingSteps() {
    const { t } = useTranslation();
    const {
        pickupValue,
        dropoffValue,
        passengers,
        seatingRequired,
    } = useSelector<RootState, BookingState>(rootState => rootState.booking);
    const { rideInfo: ride } = useSelector<RootState, RideState>(
        rootState => rootState.ride
    );
    const isSeatingSchemeEnable = () => {
        if (ride && ride.seatingScheme) {
            return ride.seatingScheme;
        }
        return [];
    };
    const [activeStep, setActiveStep] = useState(0);

    // @todo: нужен рефакторинг этого ужаса...
    const steps =
        seatingRequired && isSeatingSchemeEnable().length > 0
            ? [
                  t('booking:pickupDropoffPoints'),
                  t('booking:passengers'),
                  'Выбор мест',
                  t('booking:confirmation'),
              ]
            : [
                  t('booking:pickupDropoffPoints'),
                  t('booking:passengers'),
                  t('booking:confirmation'),
              ];

    const isPassengerStepCompleted = !Object.values(passengers).some(
        passenger => passenger === null
    );
    const isStopsStepCompleted = !!(pickupValue && dropoffValue);
    // @todo: нужен рефакторинг этого ужаса...
    const completed: Record<number, boolean> =
        seatingRequired && isSeatingSchemeEnable().length > 0
            ? {
                  0: isStopsStepCompleted,
                  1: isPassengerStepCompleted && isStopsStepCompleted,
                  2: isPassengerStepCompleted && isStopsStepCompleted,
                  3: false,
              }
            : {
                  0: isStopsStepCompleted,
                  1: isPassengerStepCompleted && isStopsStepCompleted,
                  2: false,
              };

    // @todo: нужен рефакторинг этого ужаса...
    const disabled: Record<number, boolean> =
        seatingRequired && isSeatingSchemeEnable().length > 0
            ? {
                  0: false,
                  1: !isStopsStepCompleted,
                  2: !isPassengerStepCompleted,
                  3: true,
              }
            : {
                  0: false,
                  1: !isStopsStepCompleted,
                  2: true,
              };

    const handleStep = (step: number) => {
        setActiveStep(step);
    };

    return {
        steps,
        completed,
        isPassengerStepCompleted,
        disabled,
        activeStep,
        handleStep,
        isStopsStep: activeStep === 0,
        isPassengersStep: activeStep === 1,
        isSeatsStep: activeStep === 2,
    };
}
