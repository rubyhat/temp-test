import React from 'react';
import clsx from 'clsx';
import { useTranslation } from 'i18n';
import { Box, Dialog, IconButton, Paper, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import { Button } from 'components/ui/Button';
import useStyles from 'components/ProfileDeleteAccount/ProfileModalDeleteAccountSuccess/styles';
import { IProfileModalDeleteAccountSuccess } from 'components/ProfileDeleteAccount/ProfileModalDeleteAccountSuccess/interface';
import { usePlatform } from 'hooks/usePlatform';
import { useRouter } from 'next/router';

export const ProfileModalDeleteAccountSuccess = (
    props: IProfileModalDeleteAccountSuccess
) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const router = useRouter();
    const { isMobile } = usePlatform();
    const { isOpen, setIsOpen } = props;

    const handleCloseModal = () => {
        setIsOpen(false);
        router.push('/');
    };

    return (
        <Dialog
            aria-labelledby="success-info-modal-title"
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
                    className={classes.modalSubTitle}
                    id="success-info-modal-title"
                    component="p"
                >
                    {t('profile:deleteAccSuccessTitle')}
                </Typography>

                <Box className={classes.modalButtonGroup}>
                    <Button
                        className={classes.modalButton}
                        color="primary"
                        variant="contained"
                        onClick={handleCloseModal}
                        fullWidth
                    >
                        {t('profile:close')}
                    </Button>
                </Box>
            </Paper>
        </Dialog>
    );
};
