import React, { FC, useEffect, useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';
import CancelIcon from '@material-ui/icons/Cancel';
import Grid from '@material-ui/core/Grid';

import { AppStoreButton } from 'components/appStore/AppStoreButton';
import { PlayGoogleButton } from 'components/appStore/PlayGoogleButton';
import { Typo } from 'components/Typo/Typo';
import { appStoreURL, googlePlayURL } from 'utils/appStore';
import { useTranslation } from 'i18n';
import { AtlasTheme } from 'typings/atlas-theme';
import { useCountry } from 'hooks/useCountry';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            borderRadius: theme.shape.borderRadius,
            background: theme.atlas.gradients.blue,
            color: theme.palette.common.white,
            padding: theme.spacing(2, 4),

            position: 'relative',
        },
        /* Styles applied to the `LogoSign` component. */
        LogoSign: {},
        /* Styles applied to the title `Typo` component. */
        title: {
            marginTop: theme.spacing(2),
        },
        /* Styles applied to the description `Typo` component. */
        description: {
            marginTop: theme.spacing(1),
        },
        /* Styles applied to the action buttons `Grid` component. */
        actionButtons: {
            marginTop: theme.spacing(2),
        },
        /* Styles applied to the close icon. */
        closeIcon: {
            // fontSize: 28,
            position: 'absolute',
            top: theme.spacing(1),
            right: theme.spacing(1),
            cursor: 'pointer',
        },
        imgBanner: {
            width: '100%',
        },
    }),
    { name: 'D2DAppBanner' }
);

type D2DAppBannerProps = {
    className?: string;
    onClose?: () => void;
    /**
     * Клик на "Установить приложение"
     */
    onClick?: () => void;
};

const localStorageKey = 'd2dAppBanner';

function setBannerLocalStorage() {
    if (!process.browser) return;

    localStorage.setItem(localStorageKey, 'true');
}

function getBannerLocalStorage(): boolean {
    if (!process.browser) return true; // do not render banner when SSR

    return !!localStorage.getItem(localStorageKey);
}

export const D2DAppBanner: FC<D2DAppBannerProps> = props => {
    const { className, onClose } = props;
    const classes = useStyles();
    const { country } = useCountry();
    const { t } = useTranslation();

    const [bannerVisible, setBannerVisible] = useState(
        !getBannerLocalStorage()
    );
    useEffect(() => {
        // banner closed
        if (!bannerVisible) {
            setBannerLocalStorage();
        }
    }, [bannerVisible]);

    const handleClose = () => {
        setBannerVisible(false);
        if (onClose) onClose();
    };

    if (!bannerVisible) return null;

    return (
        <div className={clsx(classes.root, className)}>
            <Grid
                container
                spacing={2}
                alignItems="center"
                justify="space-around"
            >
                <Grid item xs={12} md={6}>
                    <Typo
                        className={classes.title}
                        variant="header"
                        weight="bold"
                    >
                        {t('search:d2dAppBannerTitle')}
                    </Typo>

                    <Typo className={classes.description}>
                        {t('search:d2dAppBannerDescription')}
                    </Typo>

                    <Grid
                        className={classes.actionButtons}
                        container
                        item
                        spacing={2}
                    >
                        <Grid item>
                            <PlayGoogleButton
                                href={googlePlayURL}
                                target="_blank"
                            />
                        </Grid>
                        <Grid item>
                            <AppStoreButton
                                href={appStoreURL}
                                target="_blank"
                            />
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12} md={5}>
                    <img
                        className={classes.imgBanner}
                        src={
                            country === 'BY'
                                ? '/static/img/download-app-banner-by-x1.webp'
                                : '/static/img/download-app-banner-x1.webp'
                        }
                        srcSet={
                            country === 'BY'
                                ? '/static/img/download-app-banner-by-x2.webp 2x'
                                : '/static/img/download-app-banner-x2.webp 2x'
                        }
                        alt="download-app"
                    />
                </Grid>
            </Grid>

            <CancelIcon className={classes.closeIcon} onClick={handleClose} />
        </div>
    );
};
