import React, { FC } from 'react';
import Grid from '@material-ui/core/Grid';

import { Button } from '../ui/Button';
import { NotifyDialog } from '../NotifyDialog';
import { useTranslation } from 'i18n';
import { useCountry } from 'hooks/useCountry';

type Props = {
    open: boolean;
    onContinue?: () => void;
    onCancel?: () => void;
};

export const CancelBookingDialog: FC<Props> = props => {
    const { open, onContinue, onCancel } = props;
    const { t } = useTranslation();
    const { country } = useCountry();

    const handleContinue = () => {
        onContinue && onContinue();
    };
    const handleCancel = () => {
        onCancel && onCancel();
    };

    return (
        <NotifyDialog
            open={open}
            title={t('booking:cancelBookingTitle', {
                context: country,
            })}
            subtitle={t('booking:cancelBookingDesc')}
            actions={
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Button
                            onClick={handleCancel}
                            variant="outlined"
                            color="default"
                            fullWidth
                        >
                            {t('booking:cancelBooking', {
                                context: country,
                            })}
                        </Button>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Button
                            onClick={handleContinue}
                            variant="outlined"
                            color="primary"
                            fullWidth
                        >
                            {t('booking:continueBooking')}
                        </Button>
                    </Grid>
                </Grid>
            }
        />
    );
};
