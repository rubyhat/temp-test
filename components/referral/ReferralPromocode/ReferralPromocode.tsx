import React, { FC } from 'react';
import Grid from '@material-ui/core/Grid';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';

import {
    userReferralCopyPromocode,
    userReferralSharePromocode,
    UserReferralState,
} from 'store/user-referral';
import useSnackBar from 'components/ui/Snackbar/useSnackbar';
import { Button } from 'components/ui/Button';
import { ReferralPromocodeCopier } from 'components/referral/ReferralPromocodeCopier';
import { RootState } from 'store';
import { ShareBottomSheet } from 'components/social/ShareBottomSheet';
import { Typo } from 'components/Typo/Typo';
import { useSharePromocode } from 'hooks/useSharePromocode';
import { useTranslation } from 'i18n';
import { AtlasTheme } from 'typings/atlas-theme';

const copyTextToClipboard = process.browser
    ? require('copy-text-to-clipboard').default
    : null;

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            backgroundColor: theme.palette.common.white,
            padding: theme.spacing(1, 2),
        },
        /* Styles applied to the `ReferralPromocodeCopier` component. */
        promocodeCopier: {},
        /* Styles applied to the error `Typo` component. */
        promocodeError: {
            backgroundColor: theme.atlas.palette.text.alert,
            color: theme.atlas.palette.background.white,
        },
        promocodeDesc: {
            marginTop: theme.spacing(2),
        },
        actions: {
            marginTop: theme.spacing(2),
        },
    }),
    { name: 'ReferralPromocode' }
);

type ReferralPromocodeProps = {
    className?: string;
};

export const ReferralPromocode: FC<ReferralPromocodeProps> = props => {
    const { className } = props;
    const classes = useStyles();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [, snackbar] = useSnackBar();

    const { code } = useSelector<RootState, UserReferralState>(
        rootState => rootState.userReferral
    );

    const copy = () => {
        copyTextToClipboard(code);

        snackbar({
            type: 'show',
            payload: {
                message: t('referralPromocodeCopied'),
                variant: 'success',
            },
        });

        dispatch(userReferralCopyPromocode(code)); // для аналитики
    };

    const sharePromocode = useSharePromocode(
        code,
        true,
        (promocode, isWebShareApiSupported) => {
            // Аналитика
            dispatch(
                userReferralSharePromocode(promocode, isWebShareApiSupported)
            );
        }
    );

    return (
        <div className={clsx(classes.root, className)}>
            <ReferralPromocodeCopier
                className={classes.promocodeCopier}
                promocode={code}
                onCopy={copy}
            />

            <Typo
                className={classes.promocodeDesc}
                variant="caption"
                color="textSecondary"
            >
                {t('referralPromocodeDesc')}
            </Typo>

            <Grid container spacing={2} className={classes.actions}>
                <Grid item xs={12} sm={6}>
                    <Button
                        color="primary"
                        variant="contained"
                        fullWidth
                        onClick={sharePromocode.handleShare}
                    >
                        {t('referralSharePromocode')}
                    </Button>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Button
                        color="primary"
                        variant="outlined"
                        fullWidth
                        onClick={copy}
                    >
                        {t('referralCopyPromocode')}
                    </Button>
                </Grid>
            </Grid>

            <ShareBottomSheet
                title={t('referralSharePromocodeDialogTitle')}
                open={sharePromocode.dialogOpen}
                onClose={sharePromocode.handleClose}
                shareData={sharePromocode.shareData}
            />
        </div>
    );
};
