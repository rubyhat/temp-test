import React, { FC, useEffect, useState } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import Grid from '@material-ui/core/Grid';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import GetAppIcon from '@material-ui/icons/GetApp';

import { Button } from 'components/ui/Button';
import { RootState } from 'store';
import { useSAAS } from 'hooks/useSAAS';
import { useTranslation } from 'i18n';
import {
    pwaDialogClosed,
    PWAInstallState,
    pwaWaitingForInstall,
} from 'store/pwa-install';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {},
        dialogPaper: {
            borderRadius: 16,

            paddingTop: theme.spacing(3),
            paddingBottom: theme.spacing(3),
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),

            margin: theme.spacing(2),
        },
        scrollPaper: {
            alignItems: 'flex-end',
        },
        content: {
            textAlign: 'center',
        },
        /* Styles applied to the title `div` element. */
        title: {
            ...theme.atlas.typography.subtitle,
            fontWeight: 700,
        },
        /* Styles applied to the subtitle `div` element. */
        subtitle: {
            ...theme.atlas.typography.body1,
            color: theme.atlas.palette.text.minor,
            marginTop: theme.spacing(1),
        },
        /* Styles applied to the actions `div` element. */
        actions: {
            marginTop: theme.spacing(3),
        },
        installButton: {
            borderRadius: 8,
        },
    }),
    { name: 'PwaDialog' }
);

type PwaDialogProps = {};

export const PwaDialog: FC<PwaDialogProps> = () => {
    const classes = useStyles();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { partnerName } = useSAAS();

    const [open, setOpen] = useState(false);
    useEffect(() => {
        const timeout = setTimeout(() => {
            setOpen(true);
        }, 1000);

        return () => {
            clearTimeout(timeout);
        };
    }, []);

    const onClose = () => {
        document.body.style.overflow = 'auto';
        setOpen(false);
    };

    const { status, pwaPromptWasDeferred } = useSelector<
        RootState,
        PWAInstallState
    >(rootState => rootState.pwaInstall);

    const handleClose = () => {
        dispatch(pwaDialogClosed());
        onClose();
    };

    const handleInstall = () => {
        dispatch(pwaWaitingForInstall());
    };

    useEffect(() => {
        if (status === 'installed' || status === 'dismissed') {
            handleClose();
        }
    }, [status]);

    if (!process.browser) return null;
    if (!pwaPromptWasDeferred) return null;

    return (
        <Dialog
            disableScrollLock
            className={classes.root}
            classes={{
                paper: classes.dialogPaper,
                scrollPaper: classes.scrollPaper,
            }}
            open={open}
            onClose={handleClose}
        >
            <div className={classes.content}>
                <div className={classes.title}>
                    {t('pwaInstallDialogTitle', {
                        brandName: t('brand:brandName_nominative', {
                            context: partnerName,
                        }),
                    })}
                </div>

                <div className={classes.subtitle}>
                    {t('pwaInstallDialogSubtitle')}
                </div>
            </div>

            <div className={classes.actions}>
                <Grid container spacing={2} justify="space-around">
                    <Grid item xs={12} md={12}>
                        <Button
                            className={classes.installButton}
                            onClick={handleInstall}
                            variant="contained"
                            color="primary"
                            fullWidth
                            disabled={status === 'waitingForInstall'}
                            startIcon={
                                status !== 'waitingForInstall' ? (
                                    <GetAppIcon />
                                ) : null
                            }
                        >
                            {status === 'waitingForInstall' ? (
                                <CircularProgress size={18} />
                            ) : (
                                t('pwaInstallDialogButtonInstall')
                            )}
                        </Button>
                    </Grid>
                </Grid>
            </div>
        </Dialog>
    );
};
