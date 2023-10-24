import React, { FC } from 'react';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { AtlasPartnerContactsDto } from 'swagger/client';
import { Typo } from '../Typo/Typo';
import { useTranslation } from 'i18n';

const useStyles = makeStyles(
    (theme: Theme) => ({
        /* Styles applied to the root element. */
        root: {
            backgroundColor: '#FFF',
            padding: theme.spacing(2),
        },
        /* Styles applied to the spacer `div` element. */
        spacer: {
            height: theme.spacing(1),
        },
    }),
    { name: 'MobilePartnerItem' }
);

type Props = {
    partner: AtlasPartnerContactsDto;
    className?: string;
};

export const MobilePartnerItem: FC<Props> = props => {
    const { partner, className } = props;
    const classes = useStyles();
    const { t } = useTranslation();

    return (
        <div className={clsx(classes.root, className)}>
            <Typo
                dangerouslySetInnerHTML={{ __html: partner.name }}
                weight="bold"
            />
            <Typo
                dangerouslySetInnerHTML={{ __html: partner.by }}
                color="textSecondary"
            />
            <Typo variant="caption">{partner.when}</Typo>

            {partner.address ? (
                <>
                    <div className={classes.spacer} />
                    <Typo variant="caption" color="textSecondary">
                        {t('partnersLegalAddress')}
                    </Typo>
                    <Typo
                        dangerouslySetInnerHTML={{ __html: partner.address }}
                        variant="caption"
                    />
                </>
            ) : null}

            <div className={classes.spacer} />

            <Typo variant="caption" color="textSecondary">
                {t('partnersUNP')}
            </Typo>
            <Typo>{partner.unp}</Typo>

            <div className={classes.spacer} />

            <Typo variant="caption" color="textSecondary">
                {t('partnersWorkingHours')}
            </Typo>
            <Typo>{partner.working}</Typo>
        </div>
    );
};
