import React, { FC } from 'react';
import Grid from '@material-ui/core/Grid';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

import { AppStoreButton } from 'components/appStore/AppStoreButton';
import { BrandState } from 'store/brand/types';
import { DownloadAppPaperBanner } from './DownloadAppPaperBanner';
import { PlayGoogleButton } from 'components/appStore/PlayGoogleButton';
import { RootState } from 'store';
import { Typo } from 'components/Typo/Typo';
import {
    appMetrikaDownloadAppDesktopAndroidURL,
    appMetrikaDownloadAppDesktopIOSURL,
} from 'utils/appStore';
import { useTranslation } from 'i18n';
import { HuaweiStoreButton } from 'components/appStore/HuaweiStoreButton';
import { useSAAS } from 'hooks/useSAAS';
import { HowWorksShuttleBanner } from 'components/HowWorksShuttleBanner';
import Box from '@material-ui/core/Box';
import { useCountry } from 'hooks/useCountry';

const useStyles = makeStyles(
    theme => ({
        /* Styles applied to the root element. */
        root: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: theme.spacing(4, 0),
        },
        /* Styles applied to the container `Grid` component. */
        container: {
            maxWidth: 1000,
        },
        /* Styles applied to the title `Typo` component. */
        title: {},
        /* Styles applied to the subtitle `Typo` component. */
        subtitle: {
            marginTop: theme.spacing(1),
        },
        /* Styles applied to the benefits container `Grid` component. */
        benefitsContainer: {},
        /* Styles applied to the `DownloadAppPaperBanner` component. */
        banner: {
            '& ~ &': {
                marginTop: theme.spacing(3),
            },
        },
        /* Styles applied to the actionButtons `Grid` component. */
        actionButtons: {
            marginTop: theme.spacing(2),
        },
        /* Styles applied to the app screenshot container `Grid` component. */
        appScreenshotContainer: {
            textAlign: 'center', // align image to center
            '& img': {
                width: '100%',
                maxWidth: '573px',
            },
        },
    }),
    { name: 'SerpDownloadAppPaper' }
);

type SerpDownloadAppPaperProps = {
    className?: string;
};

export const DownloadAppPaper: FC<SerpDownloadAppPaperProps> = props => {
    const { className } = props;
    const classes = useStyles();
    const { country } = useCountry();
    const { t } = useTranslation();
    const { brandName } = useSelector<RootState, BrandState>(
        rootState => rootState.brand
    );
    const { isMioTaxi } = useSAAS();

    if (isMioTaxi) {
        return (
            <div className={clsx(classes.root, className)}>
                <Grid className={classes.container} container>
                    <Grid container item alignItems="center">
                        <Grid item lg={4} md={12}>
                            <Box style={{ marginRight: '2rem' }}>
                                <HowWorksShuttleBanner />
                            </Box>
                        </Grid>
                        <Grid item lg={6} md={12}>
                            <Grid className={classes.benefitsContainer}>
                                <DownloadAppPaperBanner
                                    className={classes.banner}
                                    title={t('brand:banner1Title', {
                                        context: brandName,
                                    })}
                                    text={t('brand:banner1Desc', {
                                        context: brandName,
                                    })}
                                />

                                <DownloadAppPaperBanner
                                    className={classes.banner}
                                    title={t('brand:banner2Title', {
                                        context: brandName,
                                    })}
                                    text={t('brand:banner2Desc', {
                                        context: brandName,
                                    })}
                                />

                                <DownloadAppPaperBanner
                                    className={classes.banner}
                                    title={t('brand:banner3Title', {
                                        context: brandName,
                                    })}
                                    text={t('brand:banner3Desc', {
                                        context: brandName,
                                    })}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        );
    }

    return (
        <div className={clsx(classes.root, className)}>
            <Grid className={classes.container} container>
                <Grid item xs={12}>
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
                </Grid>

                <Grid container item alignItems="center">
                    <Grid item lg={6} md={12}>
                        <Grid className={classes.benefitsContainer}>
                            <DownloadAppPaperBanner
                                className={classes.banner}
                                title={t('brand:banner1Title', {
                                    context: brandName,
                                })}
                                text={t('brand:banner1Desc', {
                                    context: brandName,
                                })}
                            />

                            <DownloadAppPaperBanner
                                className={classes.banner}
                                title={t('brand:banner2Title', {
                                    context: brandName,
                                })}
                                text={t('brand:banner2Desc', {
                                    context: brandName,
                                })}
                            />

                            <DownloadAppPaperBanner
                                className={classes.banner}
                                title={t('brand:banner3Title', {
                                    context: brandName,
                                })}
                                text={t('brand:banner3Desc', {
                                    context: brandName,
                                })}
                            />
                        </Grid>

                        <Grid
                            className={classes.actionButtons}
                            container
                            item
                            spacing={2}
                        >
                            <Grid item>
                                <PlayGoogleButton
                                    href={
                                        appMetrikaDownloadAppDesktopAndroidURL
                                    }
                                    target="_blank"
                                />
                            </Grid>
                            <Grid item>
                                <AppStoreButton
                                    href={appMetrikaDownloadAppDesktopIOSURL}
                                    target="_blank"
                                />
                            </Grid>
                            <Grid item>
                                <HuaweiStoreButton
                                    href={
                                        'https://appgallery.huawei.com/app/C102892141'
                                    }
                                    target="_blank"
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid
                        item
                        lg={6}
                        md={12}
                        className={classes.appScreenshotContainer}
                    >
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
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
};
