import { useEffect, useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useDispatch, useSelector } from 'react-redux';

import apiClient from 'lib/apiClient';
import { RootState } from 'store';
import { checkValidPhone } from 'utils/phone';
import { updateAuthData } from 'store/auth/actions';
import { BookingState } from 'store/booking/types';
import { bookingEditPhone } from 'store/booking/actions';
import { CountryState } from 'store/country/types';
import { countryCodes } from 'utils/country';

export function useLoginSuggest() {
    const [phoneLoading, setPhoneLoading] = useState(false);
    const [phoneSuggestDialog, setPhoneSuggestDialog] = useState(false);
    const dispatch = useDispatch();
    const { executeRecaptcha } = useGoogleReCaptcha();

    const phoneNumber = useSelector<RootState, string>(
        rootState => rootState.user.phoneNumber
    );
    const { phone } = useSelector<RootState, BookingState>(
        rootState => rootState.booking
    );
    const isLoggedIn = !!phoneNumber;

    const onPhoneChange = (phone: string) => {
        dispatch(bookingEditPhone(phone));
    };
    const handlePhoneSuggestClose = () => {
        setPhoneSuggestDialog(false);
    };

    useEffect(() => {
        async function verifyPhoneNumber() {
            if (!isLoggedIn && checkValidPhone(phone) && executeRecaptcha) {
                setPhoneLoading(true);

                dispatch(
                    updateAuthData({
                        phoneNumber: phone,
                        remember: true,
                    })
                );

                try {
                    const captchaToken = await executeRecaptcha(
                        'booking_phone_check'
                    );

                    await apiClient.verifyPhoneNumber(
                        phone,
                        captchaToken,
                        false
                    );

                    setPhoneSuggestDialog(true);
                } catch (err) {}

                setPhoneLoading(false);
            }
        }

        verifyPhoneNumber();
    }, [phone, isLoggedIn]);

    // Autocomplete phone number country code
    const { country } = useSelector<RootState, CountryState>(
        rootState => rootState.country
    );
    useEffect(() => {
        const countryCode = countryCodes[country];
        dispatch(bookingEditPhone(countryCode));
    }, [country]);

    return {
        phone,
        phoneLoading,
        phoneSuggestDialog,
        onPhoneChange,
        handlePhoneSuggestClose,
    };
}
