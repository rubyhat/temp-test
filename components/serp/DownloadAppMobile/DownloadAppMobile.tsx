import React, { FC } from 'react';
import NoSsr from '@material-ui/core/NoSsr';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

import { BrandState } from 'store/brand/types';
import { Button } from 'components/ui/Button';
import { RootState } from 'store';
import { Typo } from 'components/Typo/Typo';
import { appMetrikaDownloadAppMobileUniversalURL } from 'utils/appStore';
import { useTranslation } from 'i18n';
import { useCountry } from 'hooks/useCountry';

const useStyles = makeStyles(
    theme => ({
        /* Styles applied to the root element. */
        root: {},
        title: {},
        subtitle: {
            marginTop: theme.spacing(3),
        },
        downloadButton: {
            marginTop: theme.spacing(4),
        },
        appScreenshotContainer: {
            marginTop: theme.spacing(4),
            textAlign: 'center', // align image to center

            // @todo
            // Компенсация паддингов в SVG.
            // Не хочет по хорошему экспортироваться из Фигмы.
            marginLeft: -16,
            marginRight: -16,
            marginBottom: -64,

            '& img': {
                width: '100%',
                maxWidth: '573px',
                height: 'auto',
            },
        },
    }),
    { name: 'DownloadAppMobile' }
);

type DownloadAppMobileProps = {
    className?: string;
};

export const DownloadAppMobile: FC<DownloadAppMobileProps> = props => {
    const { className } = props;
    const classes = useStyles();
    const { country } = useCountry();
    const { t } = useTranslation();
    const { brandName } = useSelector<RootState, BrandState>(
        rootState => rootState.brand
    );

    const onClickDownloadApp = () => {
        window.open(appMetrikaDownloadAppMobileUniversalURL, '_blank');
    };

    return (
        <div className={clsx(classes.root, className)}>
            <Typo
                className={classes.title}
                variant="header"
                weight="bold"
                align="center"
            >
                {t('brand:downloadAppPaperTitle', {
                    context: brandName,
                })}
            </Typo>

            <Typo
                className={classes.subtitle}
                variant="subtitle"
                color="textSecondary"
                align="center"
            >
                {t('brand:downloadAppPaperSubtitle', {
                    context: brandName,
                })}
            </Typo>

            <NoSsr>
                <Button
                    onClick={onClickDownloadApp}
                    className={classes.downloadButton}
                    color="primary"
                    variant="contained"
                    fullWidth
                >
                    {t('downloadApp')}
                </Button>
            </NoSsr>

            <div className={classes.appScreenshotContainer}>
                <img
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
            </div>
        </div>
    );
};
