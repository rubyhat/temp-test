import React from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
// import { widgetLoaded } from 'store/feedbackWidget/actions';
import { WidgetState } from 'store/feedbackWidget/types';
import { CountryCode, countryCodes } from 'utils/country';
import { UserState } from 'store/user/types';
import { CustomWindow } from 'typings/window';
import { CountryState } from 'store/country/types';

type IWidgets = {
    [key in CountryCode]: string;
};

interface IExtendedWidgets extends IWidgets {
    default: string;
}

declare let window: CustomWindow;

// Виджет для тех. поддержки https://t.carbus.io/youtrack/issue/ADev-355/Na-testovyi-stend-dobavit-vidzhet-Usdesk
export const WidgetUsedesk = () => {
    // const router = useRouter();
    // const dispatch = useDispatch();
    // const { isLoad } = useSelector<RootState, WidgetState>(
    //     rootState => rootState.widget
    // );
    // const { phoneNumber } = useSelector<RootState, UserState>(
    //     rootState => rootState.user
    // );

    // const { country: countryCode } = useSelector<RootState, CountryState>(
    //     rootState => rootState.country
    // );

    // React.useEffect(() => {
    //     const defaultWidgetByCountry: IExtendedWidgets = {
    //         RU:
    //             'https://lib.usedesk.ru/secure.usedesk.ru/widget_163350_40654.js',
    //         BY:
    //             'https://lib.usedesk.ru/secure.usedesk.ru/widget_163350_41991.js',
    //         PL: '',
    //         UA: '',
    //         LT: '',
    //         LV: '',
    //         DE: '',
    //         default:
    //             'https://lib.usedesk.ru/secure.usedesk.ru/widget_163350_40654.js',
    //     };

    //     const widgets: IExtendedWidgets = {
    //         RU:
    //             'https://lib.usedesk.ru/secure.usedesk.ru/widget_163350_40432.js',
    //         BY:
    //             'https://lib.usedesk.ru/secure.usedesk.ru/widget_163350_40540.js',
    //         PL: '',
    //         UA: '',
    //         LT: '',
    //         LV: '',
    //         DE: '',
    //         default:
    //             defaultWidgetByCountry[countryCode as keyof IExtendedWidgets],
    //     };

    //     let country: keyof IExtendedWidgets = 'default';

    //     if (phoneNumber) {
    //         const formatPhoneNumber = '+' + phoneNumber;
    //         Object.entries(countryCodes).forEach(([key, value]) => {
    //             if (formatPhoneNumber.includes(value)) {
    //                 country = key as keyof IExtendedWidgets;
    //             }
    //         });
    //     }

    //     // При LogOut или неавторизованном юзере, очищаем везде виджет юздеска, перед тем как подключить новый
    //     if (!phoneNumber) {
    //         const usedeskScriptLink = document.getElementById(
    //             'usedesk-script-link'
    //         );
    //         const widget = document.getElementById('usedesk-messenger');
    //         const windowObj = window.usedeskMessenger;

    //         if (usedeskScriptLink) usedeskScriptLink.remove();
    //         if (widget) widget.remove();
    //         if (windowObj) delete window.usedeskMessenger;

    //         const usedeskCookiesArray = [
    //             'usedesk_messenger_token',
    //             'usedesk_messenger_callback_chat_id',
    //         ];
    //         const cookieSplit = document.cookie.split(';');
    //         const usedeskCookies = cookieSplit.filter(
    //             cookie =>
    //                 cookie.trim().startsWith(usedeskCookiesArray[0]) ||
    //                 cookie.trim().startsWith(usedeskCookiesArray[1])
    //         );

    //         usedeskCookies.forEach(cookie => {
    //             document.cookie = cookie + '; max-age=-1';
    //         });
    //     }

    //     // Подключаем виджет юздеска в зависимости от страны, либо дефолтный для неавторизованных пользователей
    //     const selectedScript = widgets[country]
    //         ? widgets[country]
    //         : widgets['default'];
    //     const script = document.createElement('script');
    //     script.async = true;
    //     script.src = selectedScript;
    //     script.setAttribute('id', 'usedesk-script-link');

    //     document.body.append(script);

    //     script.onload = () => dispatch(widgetLoaded(true));
    //     script.onerror = () => dispatch(widgetLoaded(false));
    // }, [phoneNumber, countryCode]);

    // React.useEffect(() => {
    //     const widget = document.getElementById('usedesk-messenger');

    //     if (widget && isLoad) {
    //         const pagesWhiteList = ['/help'];
    //         const isShowWidget = pagesWhiteList.includes(router.pathname);

    //         isShowWidget
    //             ? (widget.style.display = 'block')
    //             : (widget.style.display = 'none');
    //     }
    // }, [isLoad, router]);

    return <></>;
};
