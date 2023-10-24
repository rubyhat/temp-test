import React, { FC } from 'react';
import Divider from '@material-ui/core/Divider';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { Typo } from '../Typo/Typo';
import { useTranslation } from 'i18n';
import { formatPhone } from 'utils/phone';
import { useSAAS } from 'hooks/useSAAS';

import { AtlasTheme } from 'typings/atlas-theme';
const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            padding: theme.spacing(2, 2),
            backgroundColor: '#FFF',
            boxShadow: theme.atlas.shadows.bottom,
            [theme.breakpoints.down('sm')]: {
                borderRadius: theme.spacing(1),
            },
        },
        /* Styles applied to the hint `div` element. */
        hint: {
            marginTop: theme.spacing(2),
        },
        /* Styles applied to the `Divider` component. */
        divider: {
            marginTop: theme.spacing(2),
        },
    }),
    { name: 'ProfileCard' }
);

type Props = {
    phone: string;
    className?: string;
};

export const ProfileCard: FC<Props> = props => {
    const { phone, className } = props;
    const classes = useStyles();
    const { t } = useTranslation();
    const { isMioTaxi } = useSAAS();

    return (
        <div className={clsx(classes.root, className)}>
            <Typo variant="caption" color="textSecondary">
                {t('profile:phone')}
            </Typo>

            <Typo weight="bold">{formatPhone(phone)}</Typo>

            <Divider className={classes.divider} />

            <Typo
                variant="caption"
                color="textSecondary"
                className={classes.hint}
            >
                {isMioTaxi
                    ? t('profile:phoneHintTaxi')
                    : t('profile:phoneHint')}
            </Typo>
        </div>
    );
};
