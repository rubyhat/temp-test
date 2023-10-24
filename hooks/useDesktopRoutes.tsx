import React, { ReactElement } from 'react';
import ConfirmationNumberIcon from '@material-ui/icons/ConfirmationNumber';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HelpIcon from '@material-ui/icons/Help';
import PersonIcon from '@material-ui/icons/Person';
import SearchIcon from '@material-ui/icons/Search';
import InfoIcon from '@material-ui/icons/Info';
import Location from 'components/icons/Location';
import OnlineChat from 'components/icons/OnlineChat';
import { useSelector } from 'react-redux';

import { RootState } from 'store';
import { useTranslation } from 'i18n';
import { useSAAS } from './useSAAS';
import { CountryState } from '../store/country/types';
import { WidgetState } from '../store/feedbackWidget/types';

type Route = {
    pathname: string;
    label: string;
    iconComponent: ReactElement;
    className?: string;
};

type Routes = {
    menu1: Route[];
    menu2: Route[];
};

export function useDesktopRoutes(isLoggedIn: boolean): Routes {
    const { t } = useTranslation();
    const { isAtlas, isCompasBus } = useSAAS();
    const { zammadChatIsLoad } = useSelector<RootState, WidgetState>(
        rootState => rootState.widget
    );
    const { country } = useSelector<RootState, CountryState>(
        rootState => rootState.country
    );
    let menu1: Route[];
    const menu2: Route[] = [
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
    if (isCompasBus && zammadChatIsLoad) {
        menu2.unshift({
            pathname: '/onlineChat',
            label: t('onlineChat'),
            iconComponent: <OnlineChat />,
            className: 'open-zammad-chat',
        });
    }
    if (isAtlas && (country === 'BY' || country === 'RU' || country === 'PL')) {
        if (country === 'PL') {
            menu1 = [
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
                //     iconComponent: <Location />,
                // },
            ];
        } else {
            const helpCenterPathLink =
                country === 'BY'
                    ? 'https://help.atlasbus.by/'
                    : 'https://help.atlasbus.ru/';
            menu1 = [
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
                {
                    pathname: '/help',
                    label: t('contacts'),
                    iconComponent: <InfoIcon />,
                },
                {
                    pathname: '/routes-map',
                    label: t('seoDirectionsPathRU'),
                    iconComponent: <Location />,
                },
            ];
        }
    } else {
        menu1 = [
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
        ];
    }
    return { menu1, menu2 };
}
