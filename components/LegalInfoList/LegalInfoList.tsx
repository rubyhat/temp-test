import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import { CurrencySymbol } from 'utils/currency';
import { LegalSchemaDto } from 'swagger/client';
import { Typo } from 'components/Typo/Typo';
import { formatPhone, tel } from 'utils/phone';
import { useTranslation } from 'i18n';

const useStyles = makeStyles(
    theme => ({
        /* Styles applied to the root element. */
        root: {},
        item: {
            '& ~ &': {
                marginTop: theme.spacing(1),
            },
        },
        primaryText: {
            fontWeight: 700,
        },
        secondaryText: {},
    }),
    { name: 'LegalInfoList' }
);

type LegalInfoListProps = {
    legal: LegalSchemaDto;
    currency: CurrencySymbol;
    className?: string;
};

export const LegalInfoList: FC<LegalInfoListProps> = props => {
    const { legal, currency, className } = props;
    const classes = useStyles();
    const { t } = useTranslation();

    return (
        <div className={clsx(classes.root, className)}>
            {legal.name && (
                <div className={classes.item}>
                    <Typo className={classes.primaryText}>
                        {t('legalBrandName')}:{' '}
                    </Typo>

                    <Typo className={classes.secondaryText}>{legal.name}</Typo>
                </div>
            )}

            {legal.tin && (
                <div className={classes.item}>
                    <Typo className={classes.primaryText} component="span">
                        {currency === 'BYN' ? t('legalTinRB') : t('legalTin')}:{' '}
                    </Typo>

                    <Typo className={classes.secondaryText} component="span">
                        {legal.tin}
                    </Typo>
                </div>
            )}

            {legal.address && (
                <div className={classes.item}>
                    <Typo className={classes.primaryText} component="span">
                        {t('legalAddress')}:{' '}
                    </Typo>

                    <Typo className={classes.secondaryText} component="span">
                        {legal.address}
                    </Typo>
                </div>
            )}

            {legal.phone ? (
                <div className={classes.item}>
                    <Typo className={classes.primaryText} component="span">
                        {t('legalPhone')}:{' '}
                    </Typo>

                    <Typo component="span">
                        <a href={`tel:${tel(formatPhone(legal.phone))}`}>
                            {formatPhone(legal.phone)}
                        </a>
                    </Typo>
                </div>
            ) : null}
        </div>
    );
};
