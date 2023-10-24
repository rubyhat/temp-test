import React from 'react';
import Lottie from 'react-lottie';

import { Box, Dialog, Paper, Typography } from '@material-ui/core';
import { Button } from 'components/ui/Button';
import { IUpdateAppModal } from 'components/UpdateApp/UpdateAppModal/interfaces';

import useStyles from './styles';
import animationData from './busAnimation.json';

export const UpdateAppModal = (props: IUpdateAppModal) => {
    const { setIsOpen, open, data } = props;
    const {
        title,
        subtitle,
        buttonTitle,
        required,
        link,
        isCordova,
        isMobile,
    } = data;
    const classes = useStyles();

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleSubmitButtonClick = () => {
        if (isCordova) {
            window.open(link, '_blank');
            setIsOpen(false);
        } else {
            window.location.reload();
            return false;
        }
    };

    const defaultOptions = {
        loop: false,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };

    return (
        <Dialog
            disableScrollLock
            onClose={handleClose}
            aria-labelledby="update-modal-title"
            open={open}
            maxWidth="md"
            disableEscapeKeyDown
            disableBackdropClick
            fullScreen={isCordova || isMobile}
        >
            <Paper elevation={0} className={classes.modalContent}>
                <Box>
                    <Lottie
                        options={defaultOptions}
                        height="100%"
                        width="100%"
                    />
                </Box>
                <Typography
                    component="h2"
                    className={classes.modalTitle}
                    id="update-modal-title"
                >
                    {title}
                </Typography>
                <Typography component="h3" className={classes.modalSubTitle}>
                    {subtitle}
                </Typography>
                <Button
                    onClick={handleSubmitButtonClick}
                    className={classes.modalButton}
                    variant="contained"
                    color="primary"
                >
                    {buttonTitle}
                </Button>
                {!required && (
                    <Typography
                        component="p"
                        className={classes.modalTextLate}
                        onClick={handleClose}
                    >
                        Напомнить позже
                    </Typography>
                )}
            </Paper>
        </Dialog>
    );
};
