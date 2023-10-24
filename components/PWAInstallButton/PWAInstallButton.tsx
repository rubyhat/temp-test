import React, { FC } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import GetAppIcon from '@material-ui/icons/GetApp';
import clsx from 'clsx';
import { ButtonProps } from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';

import { Button } from 'components/ui/Button';
import { PWAInstallState, pwaWaitingForInstall } from 'store/pwa-install';
import { RootState } from 'store';
import { useTranslation } from 'i18n';

const useStyles = makeStyles(
    () => ({
        /* Styles applied to the root element. */
        root: {
            borderRadius: 16,
        },
    }),
    { name: 'PwaInstallButton' }
);

type PwaInstallButtonProps = {
    className?: string;
    ButtonProps?: ButtonProps;
};

export const PwaInstallButton: FC<PwaInstallButtonProps> = props => {
    const { className, ButtonProps } = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const { status, pwaPromptWasDeferred } = useSelector<
        RootState,
        PWAInstallState
    >(rootState => rootState.pwaInstall);

    const handleInstall = () => {
        dispatch(pwaWaitingForInstall());
    };

    if (!pwaPromptWasDeferred) return null;

    return (
        <Button
            className={clsx(classes.root, className)}
            onClick={handleInstall}
            variant="contained"
            color="primary"
            fullWidth
            disabled={status === 'waitingForInstall'}
            startIcon={status !== 'waitingForInstall' ? <GetAppIcon /> : null}
            {...ButtonProps}
        >
            {status === 'waitingForInstall' ? (
                <CircularProgress size={18} />
            ) : (
                t('pwaInstallButtonTitle')
            )}
        </Button>
    );
};
