import React, { FC, useRef } from 'react';
import Grid from '@material-ui/core/Grid';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

import useSnackBar from 'components/ui/Snackbar/useSnackbar';
import { CopyIconButton } from './CopyIconButton';
import { ShareData } from 'components/social/types';
import { SocialIconButton } from './SocialIconButton';
import { SocialNetwork } from 'components/social/icons';
import { useTranslation } from 'i18n';

const copyTextToClipboard = process.browser
    ? require('copy-text-to-clipboard').default
    : null;

const useStyles = makeStyles(
    theme => ({
        /* Styles applied to the root element. */
        root: {},
        /* Styles applied to the `SocialIconButton` component. */
        socialIconButton: {},
    }),
    { name: 'SocialIconButtons' }
);

type SocialIconButtonsProps = {
    className?: string;
    networks: SocialNetwork[];
    shareData: ShareData;
    showCopyIcon?: boolean;
};

export const SocialIconButtons: FC<SocialIconButtonsProps> = props => {
    const { className, networks, shareData, showCopyIcon } = props;
    const classes = useStyles();
    const [, snackbar] = useSnackBar();
    const { t } = useTranslation();
    const containerRef = useRef<HTMLDivElement | null>(null);

    const handleCopyIconClick = () => {
        copyTextToClipboard(`${shareData.text || ''} ${shareData.url}`, {
            target: containerRef.current,
        });

        snackbar({
            type: 'show',
            payload: {
                message: t('referralPromocodeCopied'),
                variant: 'success',
            },
        });
    };

    return (
        <div className={clsx(classes.root, className)} ref={containerRef}>
            <Grid container spacing={2}>
                {networks.map(network => (
                    <Grid item xs={3} key={network}>
                        <SocialIconButton
                            className={classes.socialIconButton}
                            network={network}
                            shareData={shareData}
                        />
                    </Grid>
                ))}

                {showCopyIcon ? (
                    <Grid item xs={3}>
                        <CopyIconButton
                            onClick={handleCopyIconClick}
                            className={classes.socialIconButton}
                            shareData={shareData}
                        />
                    </Grid>
                ) : null}
            </Grid>
        </div>
    );
};
