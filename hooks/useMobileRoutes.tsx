import React, { ReactElement } from 'react';
import ConfirmationNumberIcon from '@material-ui/icons/ConfirmationNumber';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HelpIcon from '@material-ui/icons/Help';
import PersonIcon from '@material-ui/icons/Person';
import SearchIcon from '@material-ui/icons/Search';
import InfoIcon from '@material-ui/icons/Info';
import Location from 'components/icons/Location';
import { useSelector } from 'react-redux';

import { RootState } from 'store';
import { useTranslation } from 'i18n';
import { useSAAS } from './useSAAS';
import { CountryState } from '../store/country/types';
import { usePlatform } from 'hooks/usePlatform';

type Route = {
    pathname: string;
    label: string;
    iconComponent: ReactElement;
};

export function useMobileRoutes(): Route[] {
    const { t } = useTranslation();
    const isLoggedIn = !!useSelector<RootState, string>(
        rootState => rootState.user.phoneNumber
    );
    const { isAtlas } = useSAAS();
    const { isCordova } = usePlatform();
    const { country } = useSelector<RootState, CountryState>(
        rootState => rootState.country
    );
    if (isAtlas && (country === 'BY' || country === 'RU' || country === 'PL')) {
        if (country === 'PL') {
            return [
                {
                    pathname: '/',
                    label: t('search'),
                    iconComponent: <SearchIcon />,
                },
                {
                    pathname: '/help',
                    label: t('help'),
                    iconComponent: <HelpIcon />,
                },
                // {
                //     pathname: '/routes-map',
                //     label: t('seoDirectionsPathRU'),
                //     iconComponent: <Location mobile />,
                // },
                {
                    pathname: '/orders',
                    label: t('trips'),
                    iconComponent: <ConfirmationNumberIcon />,
                },
                {
                    pathname: isLoggedIn ? '/profile' : '/login',
                    label: isLoggedIn ? t('profile') : t('login'),
                    iconComponent: isLoggedIn ? (
                        <PersonIcon />
                    ) : (
                        <ExitToAppIcon />
                    ),
                },
            ];
        } else {
            const helpCenterPathLink = isCordova
                ? '/help'
                : country === 'BY'
                ? 'https://help.atlasbus.by/'
                : 'https://help.atlasbus.ru/';
            return [
                {
                    pathname: '/',
                    label: t('search'),
                    iconComponent: <SearchIcon />,
                },
                {
                    pathname: helpCenterPathLink,
                    label: t('help'),
                    iconComponent: <HelpIcon />,
                },
                ...(isCordova
                    ? []
                    : [
                          {
                              pathname: '/contacts',
                              label: t('contacts'),
                              iconComponent: <InfoIcon />,
                          },
                          {
                              pathname: '/routes-map',
                              label: t('seoDirectionsPathRU'),
                              iconComponent: <Location mobile />,
                          },
                      ]),
                {
                    pathname: '/orders',
                    label: t('trips'),
                    iconComponent: <ConfirmationNumberIcon />,
                },
                {
                    pathname: isLoggedIn ? '/profile' : '/login',
                    label: isLoggedIn ? t('profile') : t('login'),
                    iconComponent: isLoggedIn ? (
                        <PersonIcon />
                    ) : (
                        <ExitToAppIcon />
                    ),
                },
            ];
        }
    } else {
        return [
            {
                pathname: '/',
                label: t('search'),
                iconComponent: <SearchIcon />,
            },
            {
                pathname: '/help',
                label: t('help'),
                iconComponent: <HelpIcon />,
            },
            {
                pathname: '/orders',
                label: t('trips'),
                iconComponent: <ConfirmationNumberIcon />,
            },
            {
                pathname: isLoggedIn ? '/profile' : '/login',
                label: isLoggedIn ? t('profile') : t('login'),
                iconComponent: isLoggedIn ? <PersonIcon /> : <ExitToAppIcon />,
            },
        ];
    }
}
