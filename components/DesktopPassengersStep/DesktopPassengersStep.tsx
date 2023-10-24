import React, { FC, useEffect, useState } from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';

import { BookingState } from 'store/booking/types';
import { DesktopLoginSuggestion } from '../DesktopLoginSuggestion';
import { DesktopNewPassenger } from '../DesktopNewPassenger';
import { PassengerFormData } from '../NewPassenger';
import { Props as NewPassengerStepProps } from '../NewPassengerStep';
import { RootState } from 'store';
import { TicketTypeDto } from 'swagger/client';
import { UserState } from 'store/user/types';
import { bookingEditPassenger } from 'store/booking/actions';
import { useTranslation } from 'i18n';
import { BookingSubjectInput } from 'components/BookingSubjectInput';
import { rideMinPrice } from 'utils/ride';
import { AtlasTheme } from 'typings/atlas-theme';
import { SelectSeatField } from 'components/SelectSeatField';
import { RideState } from 'store/ride/types';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {},
        /* Styles applied to the `DesktopNewPassenger` component. */
        passenger: {
            borderRadius: theme.spacing(1),
            '& ~ &': {
                marginTop: theme.spacing(2),
            },
        },
        /* Styles applied to the `DesktopLoginSuggestion` component. */
        loginSuggestion: {
            marginBottom: theme.spacing(2),
        },
        /* Styles applied to the subject `div` element. */
        subject: {
            marginTop: theme.spacing(2),
            padding: theme.spacing(2),
            backgroundColor: '#FFF',
            boxShadow: theme.atlas.shadows.bottom,
            borderRadius: theme.spacing(1),
        },
    }),
    { name: 'DesktopPassengersStep' }
);

type Props = Omit<NewPassengerStepProps, 'action'>;

export const DesktopPassengersStep: FC<Props> = props => {
    const {
        ticketTypes,
        docTypes,
        genderTypes,
        bookFields = [],
        passengersNumber,
        onSubmit = () => {},
        currency,
        documents = [],
        onTicketsPriceChange,
        paymentTypes,
    } = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const { rideInfo: ride } = useSelector<RootState, RideState>(
        rootState => rootState.ride
    );
    const { passengers, documentsAutocompleted, seatingRequired } = useSelector<
        RootState,
        BookingState
    >(rootState => rootState.booking);
    const user = useSelector<RootState, UserState>(rootState => rootState.user);
    const isLoggedIn = !!user.phoneNumber;
    const isSeatingSchemeEnable =
        ride && ride.seatingScheme && ride.seatingScheme.length > 0;
    const showSelectSeatField = !seatingRequired && isSeatingSchemeEnable;

    const [ticketsPrices, setTicketsPrices] = useState<Record<number, number>>(
        Array(passengersNumber)
            .fill('')
            .reduce((acc, curr, index) => {
                acc[index] = rideMinPrice(
                    ticketTypes[index][0].price,
                    ticketTypes[index][0].onlinePrice,
                    paymentTypes
                );
                return acc;
            }, {})
    );
    useEffect(() => {
        if (onTicketsPriceChange) {
            onTicketsPriceChange(
                Object.values(ticketsPrices).reduce(
                    (acc, curr) => acc + curr,
                    0
                )
            );
        }
    }, [ticketsPrices]);

    const handleSubmit = (index: number) => (
        passenger: PassengerFormData | null
    ) => {
        dispatch(bookingEditPassenger({ index, passenger }));
        onSubmit();
    };

    const handleTicketPriceChange = (index: number) => (
        ticket: TicketTypeDto
    ) => {
        setTicketsPrices({
            ...ticketsPrices,
            [index]: rideMinPrice(
                ticket.price,
                ticket.onlinePrice,
                paymentTypes
            ),
        });
    };

    return (
        <div className={classes.root}>
            <GoogleReCaptchaProvider
                reCaptchaKey={process.env.RECAPTCHA_V3_TOKEN}
            >
                {!isLoggedIn ? (
                    <DesktopLoginSuggestion
                        className={classes.loginSuggestion}
                    />
                ) : null}
            </GoogleReCaptchaProvider>

            <div key={`${documentsAutocompleted}`}>
                {Array(passengersNumber)
                    .fill('')
                    .map((passenger, i) => (
                        <DesktopNewPassenger
                            key={i}
                            title={t('booking:passengerNumber', {
                                count: i + 1,
                            })}
                            ticketTypes={ticketTypes[i]}
                            docTypes={docTypes}
                            genderTypes={genderTypes}
                            bookFields={bookFields}
                            onSubmit={handleSubmit(i)}
                            initialData={passengers[i]}
                            className={classes.passenger}
                            currency={currency}
                            documents={documents}
                            handleTicketPriceChange={handleTicketPriceChange(i)}
                            paymentTypes={paymentTypes}
                        />
                    ))}
            </div>

            {showSelectSeatField && (
                <div className={classes.subject}>
                    <SelectSeatField />
                </div>
            )}

            <div className={classes.subject}>
                <BookingSubjectInput />
            </div>
        </div>
    );
};
