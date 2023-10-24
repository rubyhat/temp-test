import React from 'react';
import clsx from 'clsx';
import { Box, Dialog, IconButton, Paper, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import { Button } from 'components/ui/Button';
import useStyles from 'components/ProfileDeleteAccount/ProfileModalDeleteAccountFailed/styles';
import { IProfileModalDeleteAccountFailed } from 'components/ProfileDeleteAccount/ProfileModalDeleteAccountFailed/interface';
import { useTranslation } from 'i18n';
import { usePlatform } from 'hooks/usePlatform';
import { useRouter } from 'next/router';

export const ProfileModalDeleteAccountFailed = (
    props: IProfileModalDeleteAccountFailed
) => {
    const classes = useStyles();
    const { isMobile } = usePlatform();
    const router = useRouter();
    const {
        isOpen,
        setIsOpen,
        openNextModal,
        inputPhone,
        failedByOrders,
        setFailedByOrders,
    } = props;
    const { t } = useTranslation();

    const handleCloseModal = () => {
        setIsOpen(false);
        setFailedByOrders(false);
    };

    const handleDeleteAccount = () => {
        setIsOpen(false);
        setFailedByOrders(false);
        failedByOrders ? router.replace('/orders') : openNextModal(true);
    };

    return (
        <Dialog
            aria-labelledby="failed-info-modal-title"
            open={isOpen}
            onClose={handleCloseModal}
            closeAfterTransition={true}
            maxWidth="sm"
            disableScrollLock
            fullScreen={isMobile}
            classes={{
                container: clsx({
                    [classes.containerWidthSm]: isMobile,
                }),
                paper: clsx(isMobile && classes.paper),
            }}
        >
            <Paper className={classes.modalContent} elevation={1}>
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
                    id="failed-info-modal-title"
                    component="h3"
                >
                    {t('profile:error')}
                </Typography>
                <Typography className={classes.modalSubTitle} component="p">
                    {failedByOrders
                        ? t('profile:deleteAccFailedByOrdersText')
                        : t('profile:deleteAccFailedText', {
                              phone: inputPhone,
                          })}
                </Typography>
                <Box className={classes.modalButtonGroup}>
                    <Button
                        className={classes.modalButton}
                        color="primary"
                        variant="contained"
                        onClick={handleDeleteAccount}
                        fullWidth
                    >
                        {failedByOrders
                            ? t('profile:deleteAccFailedByOrdersButtonText')
                            : t('profile:deleteAccFailedButtonText')}
                    </Button>
                </Box>
            </Paper>
        </Dialog>
    );
};
