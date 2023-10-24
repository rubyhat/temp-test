import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import { useStyles } from 'components/FeedbackForm/styles';
import { FormTemplate } from 'components/FeedbackForm/FormTemplate';
import { useTranslation } from 'i18n';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import { WidgetState } from 'store/feedbackWidget/types';
import { isOpenFormModal } from 'store/feedbackWidget/actions';
import { Typo } from 'components/Typo/Typo';
import { Button } from 'components/ui/Button';
import { usePlatform } from 'hooks/usePlatform';
import { isCordova } from 'utils/platform';
import { BrandState } from 'store/brand/types';

export const FeedbackForm = () => {
    const { t } = useTranslation();
    const classes = useStyles();
    const { isMobile } = usePlatform();
    const dispatch = useDispatch();
    const { brandName } = useSelector<RootState, BrandState>(
        rootState => rootState.brand
    );
    const { isOpen, feedbackStatus } = useSelector<RootState, WidgetState>(
        rootState => rootState.widget
    );
    const [step, setStep] = React.useState(1);

    const handleClose = () => {
        dispatch(isOpenFormModal(false));
        setTimeout(() => setStep(1), 333);
        document.body.style.overflow = 'auto';
    };

    return (
        <Dialog
            disableScrollLock
            open={isOpen}
            onClose={handleClose}
            PaperProps={{ className: classes.dialog }}
            fullScreen={isMobile || isCordova}
        >
            <DialogContent className={classes.content}>
                <Box className={classes.header}>
                    <IconButton className={classes.close} onClick={handleClose}>
                        <CloseIcon fontSize="small" color="primary" />
                    </IconButton>
                    <DialogTitle className={classes.title}>
                        {t('zammadMessageTitle', { context: brandName })}
                    </DialogTitle>
                </Box>
                {step === 1 && <FormTemplate setStep={setStep} />}
                {step === 2 && (
                    <Box>
                        {feedbackStatus === 'FEEDBACK_FORM_SUCCESS' && (
                            <Typo className={classes.subtitle}>
                                {t('zammadMessageThankYou')}
                            </Typo>
                        )}

                        {feedbackStatus === 'FEEDBACK_FORM_ERROR' && (
                            <Typo className={classes.subtitle}>
                                {t('zammadMessageThankYouError')}
                            </Typo>
                        )}

                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={handleClose}
                        >
                            {t('zammadMessageBackButton')}
                        </Button>
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
};
