import React, { FC, useEffect, useRef } from 'react';
import Grid from '@material-ui/core/Grid';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';

import useSnackBar from 'components/ui/Snackbar/useSnackbar';
import { Button } from 'components/ui/Button';
import { ReferralPromocodeCopier } from 'components/referral/ReferralPromocodeCopier';
import { ResponsiveDialog } from 'components/ui/ResponsiveDialog';
import { RootState } from 'store';
import { ShareBottomSheet } from 'components/social/ShareBottomSheet';
import { Snackbar } from 'components/ui/Snackbar/Snackbar';
import { Typo } from 'components/Typo/Typo';
import { useSharePromocode } from 'hooks/useSharePromocode';
import { useTranslation } from 'i18n';
import {
    resetUserReferralDialogState,
    userReferralDialogCopyPromocode,
    userReferralDialogSharePromocode,
} from 'store/user-referral-dialog';
import { userReferralFetch, UserReferralState } from 'store/user-referral';

const copyTextToClipboard = process.browser
    ? require('copy-text-to-clipboard').default
    : null;

const useStyles = makeStyles(
    theme => ({
        /* Styles applied to the root element. */
        root: {},
        container: {
            padding: theme.spacing(3, 2),
        },
        dialogTitle: {},
        /* Styles applied to the `ReferralPromocodeCopier` component. */
        promocodeCopier: {
            marginTop: theme.spacing(2),
        },
        promocodeDesc: {
            marginTop: theme.spacing(2),
        },
        actions: {
            marginTop: theme.spacing(2),
        },
    }),
    { name: 'ReferralPromocodeDialog' }
);

type ReferralPromocodeDialogProps = {
    className?: string;
    onClose?: () => void;
    onDismiss?: () => void;
    open: boolean;
};

export const ReferralPromocodeDialog: FC<
    ReferralPromocodeDialogProps
> = props => {
    const { className, onClose, onDismiss, open } = props;
    const classes = useStyles();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [, snackbar] = useSnackBar();

    const containerRef = useRef<HTMLDivElement | null>(null);

    const { code } = useSelector<RootState, UserReferralState>(
        rootState => rootState.userReferral
    );

    const copy = () => {
        // Specify a DOM element where the temporary, behind-the-scenes textarea
        // should be appended, in cases where you need to stay within a focus trap,
        // like in a modal.
        copyTextToClipboard(code, { target: containerRef.current });

        snackbar({
            type: 'show',
            payload: {
                message: t('referralPromocodeCopied'),
                variant: 'success',
            },
        });

        dispatch(userReferralDialogCopyPromocode(code)); // для аналитики
    };

    const handleDismiss = () => {
        if (onDismiss) {
            onDismiss();
        }
    };

    const sharePromocode = useSharePromocode(
        code,
        true,
        (promocode, isWebShareApiSupported) => {
            // Аналитика
            dispatch(
                userReferralDialogSharePromocode(code, isWebShareApiSupported)
            );
        }
    );

    useEffect(() => {
        dispatch(userReferralFetch());
    }, []);

    useEffect(() => {
        return () => {
            dispatch(resetUserReferralDialogState());
        };
    }, []);

    return (
        <ResponsiveDialog
            className={clsx(classes.root, className)}
            open={open}
            onClose={onClose}
            position="center"
            fullScreen={false}
            fullWidth={true}
        >
            <div className={classes.container} ref={containerRef}>
                <Typo
                    className={classes.dialogTitle}
                    variant="body2"
                    weight="bold"
                >
                    {t('referralPromocodeDialogTitle')}
                </Typo>

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
                            onClick={handleDismiss}
                        >
                            {t('referralShareDismiss')}
                        </Button>
                    </Grid>
                </Grid>
            </div>

            <ShareBottomSheet
                title={t('referralSharePromocodeDialogTitle')}
                open={sharePromocode.dialogOpen}
                onClose={sharePromocode.handleClose}
                shareData={sharePromocode.shareData}
            />

            <Snackbar />
        </ResponsiveDialog>
    );
};
