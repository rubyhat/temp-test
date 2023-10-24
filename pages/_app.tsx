import Cookies from 'universal-cookie';
import { AppContext, AppProps as NextAppProps } from 'next/app';
import React, { useEffect, useMemo, useState } from 'react';
import { NextRouter, useRouter } from 'next/router';
import * as Sentry from '@sentry/browser';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@material-ui/core/styles';
import TagManager from 'react-gtm-module';
import Head from 'next/head';
import './global.css';
import { getReleaseVersion, getReleaseVersionCompass } from 'utils/version';
import { getInitialLanguage } from 'utils/getInitialLanguage';
import { WidgetZammad } from 'components/WidgetZammad';
import { Store } from 'store';
import { CssBaseline } from 'components/CssBaseline';
import { withReduxSaga } from 'utils/redux/with-store';
import { appWithTranslation } from 'i18n';
import { createTheme } from 'themes/default';
import { persistUser, userFetching } from 'store/user/actions';
import { UserState } from 'store/user/types';
import {
    detectCountry,
    detectCountryBrowser,
    detectCountryByPhone,
} from 'utils/country';
import { countrySetCode } from 'store/country/actions';
import { onDeviceReady } from 'utils/cordova';
import { DeviceType } from 'utils/ssrMatchMedia';
import { deviceTypeReset, deviceTypeSet } from 'store/device/actions';
import { isCordova, isServer } from 'utils/platform';
import { parseBrand, detectWebView } from 'utils/brand';
import { brandSetPartner, setInWebView } from 'store/brand/actions';
import { partnerHeader } from 'lib/interceptors/partnerHeader';
import api, { apiClient } from 'lib/apiClient';
import { SaaSConfigDto } from 'swagger/client';
import {
    registerServiceWorker,
    unregisterServiceWorker,
} from 'utils/pwa/registerServiceWorker';
import i18next from 'i18n';
import { locales, Locale } from 'i18n/utils';
import { recaptchaKeysFetch } from 'store/auth-recaptcha/actions';
import { pwaInit } from 'store/pwa-install';
import { PolicyModalWrapper } from 'components/Policy/PolicyModalWrapper';
import { UpdateAppWrapper } from 'components/UpdateApp/UpdateAppWrapper';
import CookieModalWrapper from 'components/Cookie/CookieModalWrapper/CookieModalWrapper';
import { policyLoaded, policyLoadError } from 'store/saasPolicyInfo/actions';

if (process.env.NODE_ENV !== 'production' && process.browser) {
    const whyDidYouRender = require('@welldone-software/why-did-you-render/dist/no-classes-transpile/umd/whyDidYouRender.min.js');
    whyDidYouRender(React);
}

const isSentryEnable = false;

if (process.browser && isSentryEnable) {
    const isCompasBus = window.location.hostname.includes('compasbus');
    Sentry.init({
        // dsn: process.env.SENTRY_DSN,
        dsn: isCompasBus
            ? 'https://ed03db8c16a94d63aa68347a6e901f20@sentry.compasbus.pl/3'
            : 'https://9e974e3ac4cb4ffc9211647f6ae1fe4b@sentry.atlasteam.me/5',
        environment: process.env.APP_STAGE,
        release: getReleaseVersion(),
    });
}

if (process.browser) {
    const isAtlas = window.location.hostname.includes('atlasbus');
    const isCompass = window.location.hostname.includes('compasbus');

    if (!isCordova && isAtlas) {
        const tagManagerArgs = {
            gtmId: 'GTM-KX89DTR',
            auth: process.env.GTM_ATLAS_AUTH as string,
            preview: process.env.GTM_ATLAS_PREVIEW as string,

            dataLayer: {
                appVersion: getReleaseVersion(),
            },
        };
        TagManager.initialize(tagManagerArgs);
    } else if (!isCordova && isCompass) {
        const tagManagerArgs = {
            gtmId: 'GTM-K37QDGW',
            auth: process.env.GTM_COMPASS_AUTH as string,
            preview: process.env.GTM_COMPASS_PREVIEW as string,

            dataLayer: {
                appVersion: getReleaseVersionCompass(),
            },
        };
        TagManager.initialize(tagManagerArgs);
    }
}

type AppProps = NextAppProps & {
    store: Store;
    deviceType: DeviceType | null;
};

/**
 * SaaS: Добавит заголовок партнера в axios (только клиент)
 *
 * Важно: инициализация в _app useEffect не сработает
 * по причине того что useEffect'ы дочерних компонентов
 * выполнятся раньше. Запросы в бекенд начнут поступать раньше чем
 * interceptor будет установлен, и в них будет отсутствовать
 * заголовок X-SaaS-Partner-Id.
 */
if (process.browser) {
    apiClient.interceptors.request.use(partnerHeader);
}

function MyApp(props: AppProps) {
    const { Component, pageProps, store } = props;
    const rootState = store.getState();
    const { inWebView, brandName, partners, partner } = rootState.brand;
    const { device } = rootState.device;
    const { country } = rootState.country;

    const androidAppId =
        partner && partner.cordova && partner.cordova.androidAppId;
    // Тут намеренно используется ID приложения после загрузки в iTunes.
    // `cordova.iosAppId` не подходит.
    const iosAppId = partner && partner.cordova && partner.cordova.appRateIosId;

    const pwaDesktopEnabled =
        partner && partner.meta.pwaDesktopEnabled && device !== 'mobile';
    const pwaMobileEnabled =
        partner && partner.meta.pwaMobileEnabled && device === 'mobile';

    const router = useRouter();

    const isZammadWidgetEnable = false;

    useEffect(() => {
        // Загружаем данные пользователя из localStorage, если это статический HTML
        const localStorageUser = localStorage.getItem('user');
        const user: UserState | null = localStorageUser
            ? JSON.parse(localStorageUser)
            : null;
        if (user !== null) {
            store.dispatch(persistUser(user));
        }

        if (process.browser && isCordova) {
            detectCountryBrowser()
                .then(country => {
                    store.dispatch(countrySetCode(country));
                })
                .catch(err => {
                    Sentry.captureException(err);
                });
        }

        // Сбрасываем девайс после успешного монтирования всех компонетов,
        // чтобы при последующих рендерах useMediaQuery полагался на
        // window.matchMedia (например при изменении размера окна).
        store.dispatch(deviceTypeReset()); // стоит ли игнорировать Cordova?
    }, [store]);

    // Запрашиваем свежие данные профиля при инициализации приложения/веба
    useEffect(() => {
        store.dispatch(userFetching());
    }, [store]);

    // Запрашиваем ключи reCAPTCHA при инициализации приложения
    useEffect(() => {
        store.dispatch(recaptchaKeysFetch());
    }, [store]);

    useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles && jssStyles.parentElement) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    }, []);

    // Для Cordova нужно загружать SaaS конфиг на клиенте.
    // Ждем загрузки конфига. Рендерим _app.tsx. Скрываем сплешскрин.
    const [loadingSaaSConfig, setLoadingSaaSConfig] = useState(
        isCordova && !!process.env.CORDOVA_PARTNER_ID
    );
    useEffect(() => {
        if (isCordova && process.env.CORDOVA_PARTNER_ID) {
            api.getSaaSPartner(process.env.CORDOVA_PARTNER_ID as string)
                .then(res => {
                    const { data: partner } = res;
                    const brandName = partner.partner;

                    console.log('[SaaS Cordova] Set partner config', partner);
                    store.dispatch(
                        brandSetPartner(brandName, partner, [partner])
                    );

                    locales.forEach(locale => {
                        const resources = (partner.i18n as Record<
                            Locale,
                            object
                        >)[locale];
                        console.log(
                            `[SaaS Cordova] Add locale ${locale}`,
                            resources
                        );
                        i18next.i18n.addResourceBundle(
                            locale,
                            'brand',
                            resources,
                            false,
                            true
                        );
                    });

                    return partner;
                })
                .catch(err => {
                    console.log(
                        '[SaaS Cordova] Partner config does not exists'
                    );
                    Sentry.captureException(err);

                    return undefined;
                })
                .then(partner => {
                    setLoadingSaaSConfig(false);

                    console.log('[Cordova] Add listener "deviceready"');
                    document.addEventListener(
                        'deviceready',
                        () => onDeviceReady(partner),
                        false
                    );
                });
        }
    }, [store]);

    useEffect(() => {
        if (inWebView) {
            console.log('[inWebView] Add listener "deviceready"');
            document.addEventListener(
                'deviceready',
                e => onDeviceReady(partner),
                false
            );
        }
    }, [inWebView, partner]);

    useEffect(() => {
        registerServiceWorker();

        return () => {
            unregisterServiceWorker();
        };
    }, []);

    // PWA
    useEffect(() => {
        store.dispatch(pwaInit());
    }, [store]);

    // Scroll fix
    useEffect(() => {
        const handler = (url: string) => {
            document.body.style.overflow = 'auto';
            document.body.classList.remove('ptr--top');
        };

        router.events.on('routeChangeComplete', handler);

        router.beforePopState(({ url, as, options }) => {
            document.body.style.overflow = 'auto';
            document.body.classList.remove('ptr--top');

            return true;
        });

        return () => router.events.off('routeChangeComplete', handler);
    }, [router]);

    // preloading policy info
    const countryByPhone = detectCountryByPhone(rootState.user.phoneNumber);

    useEffect(() => {
        const getPrivacy = () => {
            api.getSaasPolicyInfo(
                partner ? partner.partner : 'atlas',
                countryByPhone || rootState.country.country
            )
                .then(response => {
                    store.dispatch(policyLoaded(response.data));
                })
                .catch(err => {
                    policyLoadError();
                });
        };
        getPrivacy();
    }, [countryByPhone, partner, rootState.country.country, store]);

    const theme = useMemo(() => {
        console.log('[Theme] Create memoized theme');
        return createTheme(brandName, partners);
    }, [brandName, partners]);

    return (
        <>
            {/* https://github.com/zeit/next.js/issues/6919 */}
            <Head>
                <meta
                    name="viewport"
                    content="minimum-scale=1, maximum-scale=1, initial-scale=1, user-scalable=no, width=device-width, shrink-to-fit=no, viewport-fit=cover"
                />

                {/* Android and iOS App Banners */}
                {iosAppId && (
                    <meta
                        name="apple-itunes-app"
                        content={`app-id=${iosAppId}`}
                    />
                )}
                {androidAppId && (
                    <meta
                        name="google-play-app"
                        content={`app-id=${androidAppId}`}
                    />
                )}

                {pwaDesktopEnabled || pwaMobileEnabled ? (
                    <link rel="manifest" href="/manifest.json" />
                ) : null}
            </Head>

            <Provider store={store}>
                {loadingSaaSConfig ? null : (
                    <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <PolicyModalWrapper />
                        <CookieModalWrapper />
                        <UpdateAppWrapper />
                        {isZammadWidgetEnable && <WidgetZammad />}
                        <Component {...pageProps} />
                    </ThemeProvider>
                )}
            </Provider>
        </>
    );
}

MyApp.getInitialProps = async (context: AppContext) => {
    const { Component, ctx } = context;
    const { req = null, store } = ctx;

    const reqWithI18n = req as any;

    if (reqWithI18n && reqWithI18n.i18n) {
        const cookies = new Cookies(reqWithI18n.headers.cookie);
        const i18nCookie = cookies.get('next-i18next');

        if (!i18nCookie) {
            const language = getInitialLanguage(reqWithI18n);

            reqWithI18n.i18n.changeLanguage(language || 'ru');
        }
    }

    const deviceType: DeviceType | null = isCordova
        ? 'mobile' // Cordova всегда mobile
        : req
        ? (req as any).deviceType
        : null;

    // Определение страны по геобазе
    if (!process.browser && req !== null) {
        const countryCode = detectCountry(req);
        store.dispatch(countrySetCode(countryCode));
    }

    // Server или Cordova (Automatic Static Optimization).
    // Клиент должен повторно отрендерить с тем же deviceType
    // который был определен на сервере. Иначе поедет верстка.
    if (!process.browser && req !== null) {
        store.dispatch(deviceTypeSet(deviceType));
    }

    // SAAS
    if (isServer) {
        try {
            const partners: SaaSConfigDto[] = (req as any).saasConfig;
            const brandName = parseBrand(req, partners);
            const currPartner = partners.find(
                partner => partner.partner === brandName
            );

            store.dispatch(
                brandSetPartner(brandName, currPartner || null, partners)
            );
            store.dispatch(setInWebView(detectWebView(req, partners)));
        } catch {
            // @todo logger
        }
    }

    const pageProps = Component.getInitialProps
        ? await Component.getInitialProps(ctx)
        : {};

    return { pageProps };
};

export default withReduxSaga(appWithTranslation(MyApp));
