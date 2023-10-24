import React, { FC } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

import { BrandState } from 'store/brand/types';
import { Button } from 'components/ui/Button';
import { NativeAppIcon } from './NativeAppIcon';
import { RootState } from 'store';
import { Typo } from 'components/Typo/Typo';
import { appMetrikaNativeAppTopperUniversalURL } from 'utils/appStore';
import { iOS } from 'utils/platform';
import { useTranslation } from 'i18n';
import { AtlasTheme } from 'typings/atlas-theme';

export const nativeAppTopperHeight = 68;

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            height: nativeAppTopperHeight,
            backgroundColor: theme.atlas.palette.background.deepCold,
            boxShadow: theme.atlas.shadows.inset,
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1),
            zIndex: theme.zIndex.drawer,
        },
        /* Pseudo-class applied to the root element if `position="fixed"`. */
        positionFixed: {
            top: 0,
            right: 0,
            left: 0,
            position: 'fixed',
        },

        container: {
            height: '100%',
            display: 'flex',
        },
        spacer: {
            flexGrow: 1,
        },

        closeIconButton: {
            padding: 7,

            '&:hover': {
                backgroundColor: 'unset',
            },
        },
        nativeAppIcon: {},

        contentBlock: {
            marginTop: 2,
            marginLeft: theme.spacing(1),
            flexGrow: 1,
            overflow: 'hidden',
        },
        title: {
            lineHeight: '18px',
        },
        subtitle: {
            lineHeight: '14px',
        },

        downloadButton: {
            marginLeft: theme.spacing(1),

            padding: 0,
            marginRight: 12,

            minWidth: 'unset',

            '&:hover': {
                backgroundColor: 'unset',
            },
        },
    }),
    { name: 'NativeAppTopper' }
);

type NativeAppTopperProps = {
    open: boolean;
    onClose: () => void;
    className?: string;
    position?: 'fixed';
};

export const NativeAppTopper: FC<NativeAppTopperProps> = props => {
    const { className, position, open, onClose } = props;
    const classes = useStyles();
    const { t } = useTranslation();
    const { brandName } = useSelector<RootState, BrandState>(
        rootState => rootState.brand
    );

    const title = iOS()
        ? t('nativeAppTopperTitleIOS', {
              appName: t('brand:brandName_nominative', {
                  context: brandName,
              }),
          })
        : t('nativeAppTopperTitleAndroid', {
              appName: t('brand:brandName_nominative', {
                  context: brandName,
              }),
          });

    const onClickDownloadApp = () => {
        window.open(appMetrikaNativeAppTopperUniversalURL, '_blank');
        onClose();
    };

    const onClickClose = () => {
        onClose();
    };

    if (!open) {
        return null;
    }

    return (
        <div
            className={clsx(classes.root, className, {
                [classes.positionFixed]: position === 'fixed',
            })}
        >
            <div className={classes.container}>
                <IconButton
                    onClick={onClickClose}
                    className={classes.closeIconButton}
                    color="primary"
                    disableRipple
                >
                    <CloseIcon />
                </IconButton>

                <NativeAppIcon />

                <div className={classes.contentBlock}>
                    <Typo
                        className={classes.title}
                        color="textSecondary"
                        variant="caption"
                        weight="bold"
                        component="div"
                    >
                        {title}
                    </Typo>
                    <Typo
                        className={classes.subtitle}
                        color="textSecondary"
                        variant="caption"
                        component="div"
                    >
                        {t('nativeAppTopperSubtitle')}
                    </Typo>
                </div>

                <Button
                    className={classes.downloadButton}
                    onClick={onClickDownloadApp}
                    color="primary"
                    variant="text"
                    size="small"
                    disableRipple
                >
                    {t('nativeAppTopperDownloadButton')}
                </Button>
            </div>
        </div>
    );
};
