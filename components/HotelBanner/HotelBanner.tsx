import React from 'react';
import { useTranslation } from 'i18n';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import { CountryState } from 'store/country/types';
import { CountryCode } from 'utils/country';
import { hotelBannerClick } from 'store/affiliates/actions';

import { useStyles } from './styles';
import { Button } from 'components/ui/Button';
import { usePlatform } from 'hooks/usePlatform';

type Links = {
    [key in CountryCode]: string;
};

export const HotelBanner = () => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const { t } = useTranslation();
    const { isMobile, isDesktop, isTablet } = usePlatform();

    const { country: countryCode } = useSelector<RootState, CountryState>(
        rootState => rootState.country
    );

    const links: Links = {
        RU:
            'https://ostrovok.ru/?cur=RUB&lang=ru&partner_extra=atlasbus.ru-hotel-RU&partner_slug=106517.affiliate.ed36&utm_campaign=ru-ru%2C+deeplink%2C+affiliate&utm_medium=api2&utm_source=106517.affiliate.ed36&utm_term=None',
        BY:
            'https://ostrovok.ru/?cur=BYN&lang=ru&partner_extra=atlasbus.by-hotel-BYN&partner_slug=106517.affiliate.ed36&utm_campaign=ru-ru%2C+deeplink%2C+affiliate&utm_medium=api2&utm_source=106517.affiliate.ed36&utm_term=None',
        PL: '',
        UA: '',
        LT: '',
        LV: '',
        DE: '',
    };

    const link = links[countryCode];

    const handleHotelBannerClick = () => dispatch(hotelBannerClick());

    return (
        <a
            className={classes.root}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleHotelBannerClick}
        >
            <div className={classes.content}>
                <div className={classes.textWrap}>
                    <h6 className={classes.title}>
                        {t('order:hotelBannerTitle')}
                    </h6>
                    <p className={classes.text}>{t('order:hotelBannerDesc')}</p>
                </div>
                <Button
                    className={classes.button}
                    variant="contained"
                    color="primary"
                >
                    {t('order:toBook')}
                </Button>
            </div>
            {isDesktop && !isTablet && (
                <img
                    className={classes.bannerImage}
                    src="/static/img/hotel/img-banner-hotel-desktop-1x.webp"
                    srcSet="/static/img/hotel/img-banner-hotel-desktop-2x.webp 2x"
                    alt="hotel"
                />
            )}
            {isMobile && !isTablet && (
                <img
                    className={classes.bannerImage}
                    src="/static/img/hotel/img-banner-hotel-mobile-1x.webp"
                    srcSet="/static/img/hotel/img-banner-hotel-mobile-2x.webp 2x"
                    alt="hotel"
                />
            )}
            {isTablet && (
                <img
                    className={classes.bannerImage}
                    src="/static/img/hotel/img-banner-hotel-tablet-1x.webp"
                    srcSet="/static/img/hotel/img-banner-hotel-tablet-2x.webp 2x"
                    alt="hotel"
                />
            )}
        </a>
    );
};
