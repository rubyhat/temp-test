import React, { ReactNode } from 'react';

import { makeStyles, Theme } from '@material-ui/core/styles';

import { Button } from 'components/ui/Button';
import useSnackBar from 'components/ui/Snackbar/useSnackbar';

import { useBookingSteps } from 'hooks/useBookingSteps';
import { useLoginSuggest } from 'hooks/useLoginSuggest';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import {
    bookingFireFormValidate,
    bookingFirePhoneValidate,
} from 'store/booking/actions';
import { UserState } from 'store/user/types';

import { checkValidPhone } from 'utils/phone';
import { useTranslation } from 'i18n';
import clsx from 'clsx';

const useStyles = makeStyles(
    (theme: Theme) => ({
        root: {
            borderRadius: theme.spacing(1),
        },
        marginTop: {
            [theme.breakpoints.up('sm')]: {
                marginTop: theme.spacing(2),
            },
        },
    }),
    { name: 'BookingNotValidButton' }
);

interface props {
    children: React.ReactNode;
}

export const BookingNotValidButton = (props: props) => {
    const user = useSelector<RootState, UserState>(rootState => rootState.user);
    const classes = useStyles();
    const { t } = useTranslation();
    const [, snackbar] = useSnackBar();
    const { phone } = useLoginSuggest();
    const { isPassengerStepCompleted } = useBookingSteps();
    const dispatch = useDispatch();

    const isPhoneExsist = checkValidPhone(phone) || !!user.phoneNumber;

    const renderMessage = () => {
        if (!isPhoneExsist && !isPassengerStepCompleted) {
            return t('booking:errorFormAndPhoneBooking');
        } else if (!isPhoneExsist) {
            return t('booking:errorPhoneBooking');
        } else {
            return t('booking:errorFormBooking');
        }
    };

    const handleStepNotValid = () => {
        dispatch(bookingFireFormValidate(true));
        dispatch(bookingFirePhoneValidate(true));

        snackbar({
            type: 'show',
            payload: {
                message: renderMessage(),
                variant: 'alert',
                hideAction: true,
            },
        });
    };
    return (
        <Button
            className={clsx(classes.root, classes.marginTop)}
            color="primary"
            fullWidth
            variant="contained"
            onClick={handleStepNotValid}
        >
            {props.children}
        </Button>
    );
};
