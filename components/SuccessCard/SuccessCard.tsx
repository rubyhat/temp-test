import React from 'react';
import { useTranslation } from 'i18n';

import { Typo } from 'components/Typo/Typo';
import { useCountry } from 'hooks/useCountry';

import { useStyles } from './styles';

export const SuccessCard = () => {
    const { t } = useTranslation();
    const classes = useStyles();
    const { country } = useCountry();
    return (
        <div className={classes.successCard}>
            <Typo variant="header" weight="bold">
                {t('order:orderSuccessTitle', {
                    context: country,
                })}
            </Typo>
            <Typo className={classes.successCardDesc}>
                {t('order:orderSuccessDesc', {
                    context: country,
                })}
            </Typo>
        </div>
    );
};
