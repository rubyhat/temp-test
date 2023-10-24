import React from 'react';
import { useTranslation } from 'i18n';
import { useSelector, batch, useDispatch } from 'react-redux';
import { Box, Dialog, IconButton, Paper, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import { RootState } from 'store';
import { authReset } from 'store/auth/actions';
import { userLogout } from 'store/user/actions';
import { CountryState } from 'store/country/types';
import { countryCodes } from 'utils/country';
import { UserState } from 'store/user/types';

import { Button } from 'components/ui/Button';
import useStyles from 'components/ProfileDeleteAccount/ProfileModalVerifyDeleteAccount/styles';
import { IProfileModalVerifyDeleteAccount } from 'components/ProfileDeleteAccount/ProfileModalVerifyDeleteAccount/interface';
import { PhoneInput } from 'components/PhoneInput';
import { TextField } from 'components/ui/TextField/TextField';
import { usePlatform } from 'hooks/usePlatform';
import clsx from 'clsx';
import apiClient from 'lib/apiClient';

export const ProfileModalVerifyDeleteAccount = (
    props: IProfileModalVerifyDeleteAccount
) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const { isMobile } = usePlatform();
    const { country } = useSelector<RootState, CountryState>(
        rootState => rootState.country
    );
    const { phoneNumber } = useSelector<RootState, UserState>(
        rootState => rootState.user
    );

    const {
        isOpen,
        setIsOpen,
        setOpenSuccessModal,
        setOpenFailedModal,
        setInputPhone,
        orders,
        setFailedByOrders,
    } = props;
    const [phone, setPhone] = React.useState(countryCodes[country]);
    const [text, setText] = React.useState('');

    const dispatch = useDispatch();

    const handleCloseModal = () => {
        setPhone(countryCodes[country]);
        setText('');
        setIsOpen(false);
    };

    const failedByOrders = () => {
        setOpenFailedModal(true);
        setFailedByOrders(true);
    };

    const handleDeleteAccount = () => {
        setIsOpen(false);
        setInputPhone(phone.slice(1));
        phone.slice(1) === phoneNumber
            ? orders.length
                ? failedByOrders()
                : sendDeleteAccountRequest(phoneNumber, text)
            : setOpenFailedModal(true);
    };

    const sendDeleteAccountRequest = (phone: string, cause: string) => {
        apiClient
            .userAccountDelete(phone, cause)
            .then(res => {
                batch(() => {
                    dispatch(authReset());
                    dispatch(userLogout());
                });
                setOpenSuccessModal(true);
            })
            .catch(err => {
                alert(`Что-то пошло не так, пожалуйста, попробуйте позже.`);
            });
    };

    const handlePhoneChange = (phone: string) => {
        setPhone(phone);
    };

    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value);
    };

    return (
        <Dialog
            aria-labelledby="verify-info-modal-title"
            open={isOpen}
            onClose={handleCloseModal}
            maxWidth="sm"
            fullWidth
            disableScrollLock
            fullScreen={isMobile}
            classes={{
                container: clsx({
                    [classes.containerWidthSm]: isMobile,
                }),
                paper: clsx(isMobile && classes.paper),
            }}
        >
            <Paper
                id="modal-content"
                className={classes.modalContent}
                elevation={1}
            >
                <Box className={classes.modalHeader}>
                    <IconButton
                        onClick={handleCloseModal}
                        className={classes.modalCloseIcon}
                    >
                        <CloseIcon color="primary" />
                    </IconButton>
                </Box>
                <Typography
                    className={classes.modalTitle}
                    id="verify-info-modal-title"
                    component="h3"
                >
                    {t('profile:deleteAccTitle')}
                </Typography>
                <PhoneInput
                    className={classes.modalPhoneInput}
                    defaultCountry={country}
                    autoFocus={false}
                    value={phone}
                    label={t('profile:phone')}
                    fullWidth
                    onPhoneChange={handlePhoneChange}
                />
                <TextField
                    name="reason"
                    value={text}
                    onChange={handleTextChange}
                    placeholder={t('profile:deleteAccInputLabelReason')}
                    label={t('profile:deleteAccInputPlaceholderReason')}
                    variant="standard"
                    fullWidth
                    inputProps={{ minLength: 3, maxLength: 256 }}
                    error={text.length >= 256}
                    helperText={
                        text.length >= 256
                            ? t('profile:textInputErrHint')
                            : t('profile:textInputHint')
                    }
                />

                <Box className={classes.modalButtonGroup}>
                    <Button
                        className={classes.modalButton}
                        color="primary"
                        variant="contained"
                        onClick={handleDeleteAccount}
                        fullWidth
                        disabled={
                            phone.length - 1 !== phoneNumber.length ||
                            (text.length < 3 || text.length > 256)
                        }
                    >
                        {t('profile:deleteAccCardButtonText')}
                    </Button>
                </Box>
            </Paper>
        </Dialog>
    );
};
