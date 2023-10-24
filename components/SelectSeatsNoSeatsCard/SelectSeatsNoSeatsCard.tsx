import React from 'react';
import { Typo } from 'components/Typo/Typo';
import { useStyles } from 'components/SelectSeatsNoSeatsCard/styles';
import { useTranslation } from 'i18n';

export const SelectSeatsNoSeatsCard = () => {
    const classes = useStyles();
    const { t } = useTranslation();
    return (
        <div className={classes.noSeatsInfoCard}>
            <Typo variant="body1" weight="bold">
                {t('selectSeatNotEnoughSeatsTitle')}
            </Typo>
            <Typo className={classes.noSeatsInfoText}>
                {t('selectSeatNotEnoughSeatsText')}
            </Typo>
        </div>
    );
};
