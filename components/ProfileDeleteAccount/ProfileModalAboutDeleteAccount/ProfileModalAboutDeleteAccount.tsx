import React from 'react';
import clsx from 'clsx';
import { Box, Dialog, IconButton, Paper, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import { Button } from 'components/ui/Button';
import useStyles from 'components/ProfileDeleteAccount/ProfileModalAboutDeleteAccount/styles';
import { IProfileModalAboutDeleteAccount } from 'components/ProfileDeleteAccount/ProfileModalAboutDeleteAccount/interface';
import { useTranslation } from 'i18n';
import { usePlatform } from 'hooks/usePlatform';

export const ProfileModalAboutDeleteAccount = (
    props: IProfileModalAboutDeleteAccount
) => {
    const classes = useStyles();
    const { isMobile } = usePlatform();
    const { isOpen, setIsOpen, openNextModal } = props;
    const { t } = useTranslation();

    const handleCloseModal = () => {
        setIsOpen(false);
    };

    const handleDeleteAccount = () => {
        setIsOpen(false);
        openNextModal(true);
    };

    return (
        <Dialog
            aria-labelledby="delete-info-modal-title"
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
                    id="delete-info-modal-title"
                    component="h3"
                >
                    {t('profile:deleteAccTitle')}
                </Typography>
                <Typography className={classes.modalSubTitle} component="p">
                    {t('profile:deleteAccInfoText')}
                </Typography>
                <Box className={classes.modalButtonGroup}>
                    {!isMobile && (
                        <Button
                            className={clsx(
                                classes.modalButton,
                                classes.modalButtonMargin
                            )}
                            color="primary"
                            variant="outlined"
                            onClick={handleCloseModal}
                            fullWidth={isMobile}
                        >
                            {t('profile:deleteAccCancelButtonText')}
                        </Button>
                    )}
                    <Button
                        className={classes.modalButton}
                        color="primary"
                        variant="contained"
                        onClick={handleDeleteAccount}
                        fullWidth={isMobile}
                    >
                        {t('profile:deleteAccNextButtonText')}
                    </Button>
                    {isMobile && (
                        <Button
                            className={clsx(classes.modalButton)}
                            color="primary"
                            variant="text"
                            onClick={handleCloseModal}
                            fullWidth={isMobile}
                        >
                            {t('profile:deleteAccCancelButtonText')}
                        </Button>
                    )}
                </Box>
            </Paper>
        </Dialog>
    );
};
