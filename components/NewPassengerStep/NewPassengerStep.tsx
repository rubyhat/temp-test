import React, { FC, ReactNode, useEffect, useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import { useDispatch, useSelector } from 'react-redux';

import { BookField, NewPassenger, PassengerFormData } from '../NewPassenger';
import { List } from '../ui/List/List';
import { Typo } from '../Typo/Typo';
import {
    DocTypesDto,
    GenderTypesDto,
    PersonalDataDto,
    TicketTypeDto,
} from 'swagger/client';
import { BookingState } from 'store/booking/types';
import { RootState } from 'store';
import { bookingEditPassenger } from 'store/booking/actions';
import { PhoneInput } from '../PhoneInput';
import { UserState } from 'store/user/types';
import { useTranslation } from 'i18n';
import { CurrencySymbol } from 'utils/currency';
import { LoginSuggestDialog } from 'components/LoginSuggestDialog';
import { useLoginSuggest } from 'hooks/useLoginSuggest';
import { BookingSubjectInput } from '../BookingSubjectInput';
import { rideMinPrice } from 'utils/ride';
import { useSAAS } from 'hooks/useSAAS';
import { checkValidPhone } from 'utils/phone';
import { SelectSeatField } from 'components/SelectSeatField';
import { RideState } from 'store/ride/types';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            padding: '0 16px',
        },
        /* Styles applied to the phone `List` component. */
        phone: {
            marginTop: theme.spacing(2),
            backgroundColor: '#FFF',
            '&.Mui-error': {},
        },
        /* Styles applied to the `NewPassenger` component. */
        passenger: {
            marginTop: theme.spacing(2),
            backgroundColor: '#FFF',
            '& ~ &': {
                marginTop: theme.spacing(2),
            },
        },
        /* Styles applied to the subject `div` element. */
        subject: {
            marginTop: theme.spacing(2),
            padding: theme.spacing(2),
            backgroundColor: '#FFF',
            boxShadow: theme.atlas.shadows.bottom,
            borderRadius: theme.spacing(1),
        },
        dividerError: {
            background: '#E62E4F',
        },
    }),
    { name: 'NewPassengerStep' }
);

export type Props = {
    onSubmit?: () => void;
    ticketTypes: TicketTypeDto[][];
    docTypes: DocTypesDto[];
    genderTypes: GenderTypesDto[];
    bookFields?: BookField[];
    passengersNumber: number;
    action?: ReactNode;
    currency: CurrencySymbol;
    documents?: PersonalDataDto[];
    onTicketsPriceChange?: (price: number) => void;
    paymentTypes?: string[];
};

export const NewPassengerStep: FC<Props> = props => {
    const {
        ticketTypes,
        docTypes,
        genderTypes,
        bookFields = [],
        passengersNumber,
        onSubmit = () => {},
        action = null,
        currency,
        documents = [],
        onTicketsPriceChange,
        paymentTypes,
    } = props;
    const classes = useStyles();
    const { t } = useTranslation();

    const { rideInfo: ride } = useSelector<RootState, RideState>(
        rootState => rootState.ride
    );
    const { passengers, documentsAutocompleted, seatingRequired } = useSelector<
        RootState,
        BookingState
    >(rootState => rootState.booking);

    const user = useSelector<RootState, UserState>(rootState => rootState.user);
    const dispatch = useDispatch();
    const { isMioTaxi } = useSAAS();
    const handleSubmit = (index: number) => (
        passenger: PassengerFormData | null
    ) => {
        dispatch(bookingEditPassenger({ index, passenger }));
        onSubmit();
    };

    const isSeatingSchemeEnable =
        ride && ride.seatingScheme && ride.seatingScheme.length > 0;
    const showSelectSeatField = !seatingRequired && isSeatingSchemeEnable;
    const isLoggedIn = !!user.phoneNumber;

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

    const {
        phone,
        phoneLoading,
        phoneSuggestDialog,
        onPhoneChange,
        handlePhoneSuggestClose,
    } = useLoginSuggest();

    const { firePhoneValidate } = useSelector<RootState, BookingState>(
        rootState => rootState.booking
    );

    const [hasPhoneError, setHasPhoneError] = React.useState(false);
    React.useEffect(() => {
        if (firePhoneValidate) {
            checkValidPhone(phone)
                ? setHasPhoneError(false)
                : setHasPhoneError(true);
        }
    }, [firePhoneValidate, phone]);

    return (
        <div className={classes.root}>
            {!isLoggedIn ? (
                <List className={classes.phone}>
                    <ListItem>
                        <PhoneInput
                            placeholder={t('booking:contactNumber')}
                            fullWidth
                            value={phone}
                            onPhoneChange={onPhoneChange}
                            InputProps={{
                                disableUnderline: true,
                                endAdornment: phoneLoading ? (
                                    <CircularProgress
                                        color="inherit"
                                        size={18}
                                    />
                                ) : null,
                            }}
                            inputProps={{
                                inputMode: 'numeric',
                            }}
                            error={hasPhoneError}
                        />
                    </ListItem>

                    <Divider
                        className={hasPhoneError ? classes.dividerError : ''}
                        component="li"
                        variant="middle"
                    />

                    <ListItem>
                        <Typo variant="caption" color="textSecondary">
                            {isMioTaxi
                                ? t('booking:contactNumberDescTaxi')
                                : t('booking:contactNumberDesc')}
                        </Typo>
                    </ListItem>
                </List>
            ) : null}

            <div key={`${documentsAutocompleted}`}>
                {Array(passengersNumber)
                    .fill('')
                    .map((passenger, i) => (
                        <NewPassenger
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

            <LoginSuggestDialog
                phone={phone}
                open={phoneSuggestDialog}
                onClose={handlePhoneSuggestClose}
            />

            {action}
        </div>
    );
};
