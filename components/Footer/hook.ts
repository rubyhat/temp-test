import React from 'react';

import { useTranslation } from 'react-i18next';
import {
    appMetrikaDownloadAppDesktopAndroidURL,
    appMetrikaDownloadAppDesktopIOSURL,
} from '../../utils/appStore';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { CountryState } from '../../store/country/types';
import { usePlatform } from '../../hooks/usePlatform';
import { useSAAS } from '../../hooks/useSAAS';

interface Link {
    label: string;
    href: string;
    target?: string | undefined;
}

export interface FooterMenuItem {
    title: string;
    links: Array<Link>;
}

export const useLinks = () => {
    const { t } = useTranslation();
    const { country } = useSelector<RootState, CountryState>(
        rootState => rootState.country
    );
    const { isMobile } = usePlatform();
    const { meta } = useSAAS();
    const includeByDomain = country === 'BY';
    const domainSuffix = includeByDomain ? 'by' : 'ru';
    const isResidentHTP = false;

    const vkIcon = '/static/social/vk.svg';
    const tgIcon = '/static/social/tg.svg';
    const instIcon = '/static/social/inst.svg';
    const appleIcon = '/static/store/apple.svg';
    const playIcon = '/static/store/play.svg';
    const huaweiIcon = '/static/store/huawei.svg';

    const mobileAdditionalLinks = [
        {
            label: t('common:contacts'),
            href: `https://atlasbus.${domainSuffix}/contacts`,
        },
        {
            label: t('common:help'),
            href: `https://help.atlasbus.${domainSuffix}`,
            target: '_blank',
        },
        {
            label: t('common:termsOfPrivacy'),
            href: `https://atlasbus.${domainSuffix}/privacy`,
        },
    ];

    const atlasLinks = [
        {
            label: t('common:aboutUs'),
            href: 'https://portal.atlasbus.ru/',
            target: '_blank',
        },
        ...mobileAdditionalLinks,
        {
            label: t('common:termsOfUse'),
            href: `https://atlasbus.${domainSuffix}/terms`,
        },
    ];

    const collaborationLinks = [
        {
            label: t('common:becomeAPartner'),
            href: 'https://b2b.atlasbus.ru/',
            target: '_blank',
        },
    ];

    const otherLinks = [
        {
            label: t('common:vacancy'),
            href: 'https://portal.atlasbus.ru/vacancies',
            target: '_blank',
        },
        {
            label: t('common:forDrivers'),
            href: isMobile
                ? meta.driversURL
                : `https://atlasbus.${domainSuffix}/drivers`,
        },
    ];

    const menu = [
        { title: t('brand:brandName'), links: atlasLinks },
        { title: t('common:collaboration'), links: collaborationLinks },
        { title: t('common:other'), links: otherLinks },
    ];

    const socialLinks = [
        {
            icon: vkIcon,
            href: includeByDomain
                ? 'https://vk.com/atlas_by'
                : 'https://vk.com/atlasbus_ru',
        },
        {
            icon: tgIcon,
            href: includeByDomain
                ? 'https://t.me/atlasbus_by'
                : 'https://t.me/atlasbusru',
        },
    ];

    if (includeByDomain) {
        socialLinks.push({
            icon: instIcon,
            href: 'https://www.instagram.com/atlasbus.by/',
        });
    }

    const appLinks = [
        { icon: appleIcon, href: appMetrikaDownloadAppDesktopIOSURL },
        { icon: playIcon, href: appMetrikaDownloadAppDesktopAndroidURL },
        {
            icon: huaweiIcon,
            href: 'https://appgallery.huawei.com/app/C102892141',
        },
    ];

    return {
        includeByDomain,
        menu,
        mobileAdditionalLinks,
        socialLinks,
        appLinks,
        isResidentHTP,
    };
};
