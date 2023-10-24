import React, { FC } from 'react';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import IconButton from '@material-ui/core/IconButton';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

import { Typo } from 'components/Typo/Typo';
import { useTranslation } from 'i18n';

const useStyles = makeStyles(
    theme => ({
        /* Styles applied to the root element. */
        root: {},
        title: {},
        promocodeContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        /* Styles applied to the promocode text `div` element. */
        promocode: {},
    }),
    { name: 'ReferralPromocodeCopier' }
);

type ReferralPromocodeCopierProps = {
    promocode: string;
    onCopy: () => void;
    className?: string;
};

export const ReferralPromocodeCopier: FC<
    ReferralPromocodeCopierProps
> = props => {
    const { className, promocode, onCopy } = props;
    const classes = useStyles();
    const { t } = useTranslation();

    return (
        <div className={clsx(classes.root, className)}>
            <Typo
                className={classes.title}
                variant="caption"
                color="textSecondary"
            >
                {t('referralPromocodeTitle')}
            </Typo>

            <div className={classes.promocodeContainer}>
                <Typo
                    className={classes.promocode}
                    variant="promo2"
                    component="p"
                >
                    {promocode}
                </Typo>

                <IconButton onClick={onCopy}>
                    <FileCopyOutlinedIcon />
                </IconButton>
            </div>
        </div>
    );
};
