import React, { FC, useEffect, useState } from 'react';
import CancelIcon from '@material-ui/icons/Cancel';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { D2DShuttleButton } from './D2DShuttleButton';
import { LogoSign } from 'components/LogoSign';
import { Typo } from 'components/Typo/Typo';
import { usePlatform } from 'hooks/usePlatform';
import { useTranslation } from 'i18n';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            borderRadius: theme.shape.borderRadius,
            background: theme.atlas.gradients.blue,
            color: theme.palette.common.white,
            padding: theme.spacing(2, 4),

            textAlign: 'center',
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
        /* Styles applied to the more `Button` component. */
        moreButton: {
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
    }),
    { name: 'D2DShuttleBanner' }
);

type D2DShuttleBannerProps = {
    className?: string;
    onClose?: () => void;
    /**
     * Клик на "Узнать подробнее"
     */
    onClick?: () => void;
};

const localStorageKey = 'd2dShuttleBanner';

function setBannerLocalStorage() {
    if (!process.browser) return;

    localStorage.setItem(localStorageKey, 'true');
}

function getBannerLocalStorage(): boolean {
    if (!process.browser) return true; // do not render banner when SSR

    return !!localStorage.getItem(localStorageKey);
}

export const D2DShuttleBanner: FC<D2DShuttleBannerProps> = props => {
    const { className, onClose, onClick } = props;
    const classes = useStyles();
    const { t } = useTranslation();
    const { isMobile } = usePlatform();

    const [bannerVisible, setBannerVisible] = useState(
        !getBannerLocalStorage()
    );
    useEffect(() => {
        // banner closed
        if (!bannerVisible) {
            setBannerLocalStorage();
        }
    }, [bannerVisible]);

    const handleClick = () => {
        setBannerVisible(false);
        if (onClick) onClick();
    };

    const handleClose = () => {
        setBannerVisible(false);
        if (onClose) onClose();
    };

    if (!bannerVisible) return null;

    return (
        <div className={clsx(classes.root, className)}>
            <LogoSign dark className={classes.LogoSign} />

            <Typo className={classes.title} variant="header" weight="bold">
                {t('search:d2dShuttleBannerTitle')}
            </Typo>

            <Typo className={classes.description}>
                {t('search:d2dShuttleBannerDescription')}
            </Typo>

            <D2DShuttleButton
                className={classes.moreButton}
                size="large"
                fullWidth={isMobile}
                onClick={handleClick}
            >
                {t('search:d2dShuttleBannerButtonText')}
            </D2DShuttleButton>

            <CancelIcon className={classes.closeIcon} onClick={handleClose} />
        </div>
    );
};
