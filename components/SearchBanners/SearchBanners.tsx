import React, { FC } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

import {
    Banner,
    BannerText,
    BannerTitle,
    BannerIcon,
} from '../Morda/Banner/Banner';
import { useTranslation } from 'i18n';
import { RootState } from 'store';
import { BrandState } from 'store/brand/types';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing(4, 0),
    },
    container: {
        maxWidth: 1000,
    },
}));

export const SearchBanners: FC = () => {
    const { t } = useTranslation();
    const classes = useStyles();
    const { brandName } = useSelector<RootState, BrandState>(
        rootState => rootState.brand
    );

    return (
        <div className={classes.root}>
            <Grid className={classes.container} container spacing={2}>
                <Grid item xs={12} md={4}>
                    <Banner>
                        <BannerIcon src={require('./Wallet.svg')} />
                        <BannerTitle>
                            {t('brand:banner1Title', { context: brandName })}
                        </BannerTitle>
                        <BannerText>
                            {t('brand:banner1Desc', { context: brandName })}
                        </BannerText>
                    </Banner>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Banner>
                        <BannerIcon src={require('./SpeedMeter.svg')} />
                        <BannerTitle>
                            {t('brand:banner2Title', { context: brandName })}
                        </BannerTitle>
                        <BannerText>
                            {t('brand:banner2Desc', { context: brandName })}
                        </BannerText>
                    </Banner>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Banner>
                        <BannerIcon src={require('./FeatureTicket.svg')} />
                        <BannerTitle>
                            {t('brand:banner3Title', { context: brandName })}
                        </BannerTitle>
                        <BannerText>
                            {t('brand:banner3Desc', { context: brandName })}
                        </BannerText>
                    </Banner>
                </Grid>
            </Grid>
        </div>
    );
};
