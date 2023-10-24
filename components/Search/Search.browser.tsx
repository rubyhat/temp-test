import React, { useEffect, useLayoutEffect, useMemo } from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import VisibilitySensor from 'react-visibility-sensor';
import { iOS, isCordova, isIPad, isPWA, isServer } from 'utils/platform';
import { NextPage } from 'next';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import animateScrollTo from 'animated-scroll-to';
import SearchIcon from '@material-ui/icons/Search';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NoSsr from '@material-ui/core/NoSsr';
import Cookies from 'universal-cookie';

import {
    ERROR_RIDES,
    FETCHING_RIDES,
    POLLING_RIDES,
    SearchRidesState,
    SUCCESS_RIDES,
} from 'store/search-rides/types';
import { CountryState } from 'store/country/types';
import { DesktopAppBar } from '../DesktopAppBar';
import { DesktopFilters } from '../DesktopFilters';
import { DesktopFiltersShimmer } from '../DesktopFiltersShimmer';
import { DesktopHeader } from '../DesktopHeader';
import { DesktopTrip } from 'components/DesktopTrip';
import { DesktopTripShimmer } from '../DesktopTripShimmer';
import { Locale } from 'i18n/utils';
import { NotifyPaper } from '../NotifyPaper';
import { RideDetailsDialog } from '../RideDetailsDialog';
import { RootState } from 'store';
import { SearchBar } from '../SearchBar';
import { SearchForm } from '../SearchForm/SearchForm';
import { SearchFormState } from 'store/search-form/types';
import { Trip } from '../Trip';
import { TripShimmer } from '../TripShimmer';
import { initSearchForm, persistSearchForm } from 'store/search-form/actions';
import {
    fetchingRides,
    pollingRides,
    fetchingRidesBrowser,
} from 'store/search-rides/actions';
import { getInitialLanguage } from 'utils/getInitialLanguage';
import { useFilters } from 'hooks/useFilters';
import { usePlatform } from 'hooks/usePlatform';
import { useRideDetails } from 'hooks/useRideDetails';
import { useSearchBar } from 'hooks/useSearchBar';
import { useStyles } from './Search.styles';
import { useTranslation } from 'i18n';
import { SearchBanners } from '../SearchBanners/SearchBanners';
import { Footer } from '../Footer/Footer';
import { format, isISODate } from 'utils/date';
import Layout from 'layouts/navigation';
import apiClient from 'lib/apiClient';
import { LocalizedName, SeoDtoResponse } from 'swagger/client';
import { PriceCalendar } from '../PriceCalendar';
import { useSeo } from 'hooks/useSeo';
import SearchSeoTags from './SearchSeoTags';
import { getCurrentPageUrl } from 'utils/pageUrl';
import { Filters } from '../Filters';
import { seoReset, seoSuccess } from 'store/seo/actions';
import { LastSearchState } from 'store/last-search/types';
import { routerPushSeoPage } from 'utils/routerPushSeoPage';
import { RelatedDestinations } from 'components/RelatedDestinations';
import { isNumeric } from 'utils/isNumeric';
import { FeaturedDestinations } from 'components/FeaturedDestinations';
import { seoFeaturedFetching } from 'store/seo-featured/actions';
import { SeoFeaturedState } from 'store/seo-featured/types';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from 'next/link';
import { useSeoPrefix } from 'hooks/useSeoPrefix';
import { getRealIP } from 'utils/getRealIP';
import { SearchFormHints } from 'components/SearchFormHints';
import { getSafeArea } from 'utils/safeArea';
import { Header } from 'components/Header/Header';
import { SurgeCard } from 'components/Surge';
import { isSurged } from 'utils/isSurged';
import { useSAAS } from 'hooks/useSAAS';
import { BreadcrumbListJsonLd } from 'components/BreadcrumbListJsonLd';
import { getTodayDateOfCity } from 'utils/date/getTodayDateOfCity';
import { isDateBefore } from 'utils/date/isDateBefore';
import { SearchFormFastDates } from 'components/SearchFormFastDates';
import { CarbusPartnerCard } from 'components/CarbusPartnerCard';
import { PwaDialog } from 'components/PWADialog';
import { pwaPromptedCookie } from 'utils/pwa/webmanifest';
import { usePWA } from 'hooks/usePWA';
import { UserState } from 'store/user/types';
import { useReviewDialog } from 'hooks/useReviewDialog';
import { ReviewDialog } from 'components/reviews/ReviewDialog';
import SnackbarProvider from 'components/ui/Snackbar/SnackbarProvider';
import { ConnectingPage } from 'components/connecting/ConnectingPage';
import { D2DShuttleBanner } from 'components/serp/D2DShuttleBanner';
import { hasDynamicMode } from 'utils/hasDynamicMode';
import { DownloadAppPaper } from 'components/serp/DownloadAppPaper';
import { DownloadAppMobile } from 'components/serp/DownloadAppMobile';
import {
    NativeAppTopper,
    useNativeAppTopper,
    NATIVE_APP_TOPPER_COOKIE_KEY,
} from 'components/serp/NativeAppTopper';
import { RidesNotFoundSuggestionsCard } from 'components/RidesNotFoundSuggestionsCard';
import { excludeCurrentDate } from 'utils/calendar';
import { ReferralPromocodeDialog } from 'components/referral/ReferralPromocodeDialog';
import { useReferralDialog } from 'hooks/useReferralDialog';
import {
    attentionBannersSrc,
    attentionHrodnaEUBannersSrc,
    directionsForAttentionBanner,
    directionsForBanner,
    directionsForHrodnaEUAttentionBanner,
    directionsForKishinevMoscowInfoBanner,
    directionsForShuttleBanner,
    kishinevMoscowInfoBannerSrc,
} from './config/bannersConfig';
import { parseISO } from 'date-fns';
import { SaasUpdateVersionLoad } from 'store/saasUpdateVersion/actions';
import { HowWorksShuttleBanner } from 'components/HowWorksShuttleBanner';
import { TripMioTaxi } from 'components/Trip/TripMioTaxi';
import Box from '@material-ui/core/Box';
import { useState } from 'react';

type Props = {
    seoDirection?: SeoDtoResponse | null;
    hostname: string;
    nativeAppTopperCookie: boolean;
};

export const Search: NextPage<Props> = props => {
    const { seoDirection, hostname, nativeAppTopperCookie } = props;
    const router = useRouter();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const classes = useStyles();
    const { isBrowser, isMobile, inWebView } = usePlatform();
    const { isAtlas, isMioTaxi, isCompas, meta } = useSAAS();

    const { country } = useSelector<RootState, CountryState>(
        rootState => rootState.country
    );
    const { seoPrefix } = useSeoPrefix();

    // SearchBar
    const {
        containerRef,
        searchBarVisible,
        handleSearchClick,
        handleVisibilityChange,
    } = useSearchBar();

    // Rides
    const { lastSearch } = useSelector<RootState, LastSearchState>(
        rootState => rootState.lastSearch
    );

    const {
        rides,
        calendar,
        status,
        continuePollingOnClient,
        withScrolling,
    } = useSelector<RootState, SearchRidesState>(
        rootState => rootState.searchRides
    );
    const calendarWithoutCurrentDate = excludeCurrentDate(
        calendar,
        (lastSearch && lastSearch.date) || ''
    );

    const searchFormState = useSelector<RootState, SearchFormState>(
        rootState => rootState.searchForm
    );

    const {
        fromValue: from,
        toValue: to,
        fromInputValue: fromName,
        toInputValue: toName,
        date,
        passengers,
        time,
    } = searchFormState;

    // RideDetailsDialog
    const {
        currentRide,
        detailsOpen,
        handleDetailsClick,
        handleDetailsClose,
        gotoBooking,
    } = useRideDetails(rides);

    // Filters
    const {
        rides: filteredRides,
        count: filtersCount,
        allPickupStops,
        allDischargeStops,

        filtersOpen,
        handleFiltersOpen,
        handleFiltersClose,
        handleFiltersSubmit,
    } = useFilters();

    // Seo destinations
    const { searchHistory, nearbyRoutes } = useSelector<
        RootState,
        SeoFeaturedState
    >(rootState => rootState.seoFeatured);

    // Продолжаем полить рейсы
    // если сервер не смог получить статус 200.
    useEffect(() => {
        if (isBrowser && continuePollingOnClient) {
            dispatch(pollingRides());
        }
    }, [continuePollingOnClient]);

    useEffect(() => {
        if (isHome) {
            dispatch(persistSearchForm());
        }
    }, []);

    // Calendar
    const handleCalendarChange = (newDate: string) => {
        if (!lastSearch) {
            console.warn('Missing store.lastSearch');
            return;
        }
        const { from, to, passengers, time } = lastSearch;

        const queryObj: any = {
            from,
            to,
            date: newDate,
            passengers,
        };
        if (time) {
            queryObj['time'] = time;
        }
        routerPushSeoPage(router, queryObj, seoPrefix);
    };

    // Helpers
    const isLoading = status === FETCHING_RIDES || status === POLLING_RIDES;
    const isSuccess = status === SUCCESS_RIDES && rides.length > 0;
    const isNotFound = status === SUCCESS_RIDES && !filteredRides.length;
    const isSearch = router.pathname === '/search';
    const isSeoPage = router.pathname === '/seo'; // переход из поисковика
    const isHome = router.pathname === '/';
    const isConnectingPage =
        !!(seoDirection && seoDirection.stopOver) && isAtlas; // признак стыковочного серпа
    const isSearchWithStatus = isSearch && status !== null;
    const { headerTitle, headerSubTitle } = useSeo(
        hostname,
        searchFormState,
        seoDirection,
        date && format(parseISO(date), 'd MMM')
    );

    const isNeedToShowAnotherBanner =
        status === SUCCESS_RIDES &&
        filteredRides
            .map(
                ride =>
                    ride.carrierID && ['108', '109'].includes(ride.carrierID)
            )
            .filter(Boolean).length > 0;

    // Surge
    const surged =
        isSuccess &&
        (isSearch || isSeoPage) &&
        !meta.surgeDisabled &&
        isSurged(rides, meta.surgePercentage);

    // D2D
    const isDynamicMode =
        isSuccess && (isSearch || isSeoPage) && hasDynamicMode(rides);

    useLayoutEffect(() => {
        if (containerRef.current && isLoading && isSearch && withScrolling) {
            // У WebView партнера отсутствует верхний AppBar (как и в Cordova)
            // поэтому нужно вычесть из высоты скролла высоту AppBar (56px)
            if (inWebView) {
                animateScrollTo(containerRef.current.offsetHeight - 56);
            } else {
                // AppBar height + Search-container margin-top/2
                animateScrollTo(containerRef.current.offsetHeight);
            }
        }
    }, [isLoading, isSearch, withScrolling]);

    // при изменении условий поиска (город откуда, город куда, дата) срабатывает useEffect (ниже)
    // иногда зависимости этого useEffect перезаписываются, но не меняются их значения. Чтобы в этом случае не запускался useEffect, делается проверка на изменение значений через useState
    interface IChangeConditions {
        chFrom: string;
        chTo: string;
        chDate: string;
        chPassengers: string;
    }
    const [changeConditions, setChangeConditions] = useState<IChangeConditions>(
        {
            chFrom: '',
            chTo: '',
            chDate: '',
            chPassengers: '',
        }
    );

    useEffect(() => {
        if (!isSearch) return;
        const { chFrom, chTo, chDate, chPassengers } = changeConditions;

        const checkChange =
            from &&
            from.hasOwnProperty('id') &&
            from.id === chFrom &&
            to &&
            to.hasOwnProperty('id') &&
            to.id === chTo &&
            date === chDate &&
            passengers === chPassengers;
        if (!checkChange) {
            const _changeConditions: IChangeConditions = {
                chFrom:
                    from && from.hasOwnProperty('id') ? String(from.id) : '',
                chTo: to && to.hasOwnProperty('id') ? String(to.id) : '',
                chDate: date ? date : '',
                chPassengers: passengers,
            };
            setChangeConditions(_changeConditions);
            dispatch(fetchingRidesBrowser());
        }
    }, [from, to, date, time, isSearch]);

    useEffect(() => {
        if (isHome) {
            dispatch(seoFeaturedFetching());
        }
    }, [isHome]);

    // Scroll fix
    useEffect(() => {
        document.body.style.overflow = 'auto';
        // Запрашиваем актуальную версию приложения на главной странице
        dispatch(SaasUpdateVersionLoad());
    }, []);

    // SearchForm
    const handleSearchFormSubmit = async () => {
        const queryObj: any = { from, to, date, passengers };
        if (time) {
            queryObj['time'] = time;
        }
        await routerPushSeoPage(router, queryObj, seoPrefix, { shallow: true });

        dispatch(fetchingRides(true));
    };

    // PWA
    const user = useSelector<RootState, UserState>(rootState => rootState.user);
    const isLoggedIn = !!user.phoneNumber;
    const {
        pwaSaaSEnabled,
        pwaPromptWasDeferred,
        status: pwaInstallStatus,
    } = usePWA();
    const showPWAInstallButton =
        isLoggedIn &&
        pwaSaaSEnabled &&
        pwaPromptWasDeferred &&
        pwaInstallStatus !== 'dismissed' &&
        (!pwaPromptedCookie() &&
            !iOS() &&
            !isPWA() &&
            !isCordova &&
            !inWebView);

    // Trip review dialog
    const reviewDialog = useReviewDialog();

    // User referral dialog
    const referralDialog = useReferralDialog();

    // Native App Topper
    const topper = useNativeAppTopper(!nativeAppTopperCookie);

    // BreadcrumbList JSON-LD items
    const breadcrumbListJsonLdItems = useMemo(() => {
        let fromName = '';
        let toName = '';

        if (seoDirection) {
            fromName = seoDirection.from.name;
            toName = seoDirection.to.name;
        } else if (lastSearch) {
            fromName = lastSearch.from.name;
            toName = lastSearch.to.name;
        } else {
            return [];
        }

        return [
            {
                '@id': `https://${hostname}/`,
                name: t('breadcrumbHome'),
            },
            {
                '@id': `https://${hostname}/${seoPrefix}`,
                name: `🚍 ${seoPrefix}`,
            },
            {
                '@id': `https://${hostname}/${seoPrefix}/${fromName}`,
                name: fromName,
            },
            {
                '@id': `https://${hostname}/${seoPrefix}/${fromName}/${toName}`,
                name: toName,
            },
        ];
    }, [hostname, seoPrefix, lastSearch, seoDirection]);

    const breadcrumbs =
        lastSearch && isSuccess ? (
            <>
                <Breadcrumbs
                    aria-label="breadcrumb"
                    separator={<NavigateNextIcon fontSize="small" />}
                    classes={{
                        li: classes.breadcrumbLi,
                    }}
                >
                    <Link href="/">
                        <a>{t('breadcrumbHome')}</a>
                    </Link>

                    <Link
                        href={{
                            pathname: 'city',
                            query: {
                                city: lastSearch.from.name,
                            },
                        }}
                        as={{
                            pathname: `/${seoPrefix}/${lastSearch.from.name}`,
                        }}
                    >
                        <a>{lastSearch.from.name}</a>
                    </Link>

                    <span>{lastSearch.to.name}</span>
                </Breadcrumbs>
            </>
        ) : null;

    // banner
    let showBanner = false;
    let bannerLink = '';
    if (from && to) {
        if (directionsForBanner.includes({ from: from.id, to: to.id })) {
            showBanner = true;
        } else if (isNeedToShowAnotherBanner) {
            showBanner = true;
        }
        bannerLink = `https://t6.by/?utm_source=atlasbus.by&utm_campaign=${from.name}-${to.name}`;
    }

    //shuttleBanner
    let showShuttleBanner = false;
    let shuttleLink = '';
    let srcShuttleBannerWeb = '';
    let srcShuttleBannerMobile = '';
    if (from && to) {
        const direction = directionsForShuttleBanner.find(
            el =>
                (el.from === from.id && el.to === to.id) ||
                (el.from === to.id && el.to === from.id)
        );
        if (direction !== undefined) {
            shuttleLink = `${direction.link}`;
            showShuttleBanner = true;
            srcShuttleBannerWeb = `/static/img/${direction.fileNameWeb}`;
            srcShuttleBannerMobile = `/static/img/${direction.fileNameMobile}`;
        }
    }

    //attentionBanner
    let showAttentionBanner = false;
    let srcAttentionBannerWeb = `/static/img/${attentionBannersSrc.fileNameWeb}`;
    let srcAttentionBannerMobile = `/static/img/${attentionBannersSrc.fileNameMobile}`;
    let srcAttentionBannerIPad = `/static/img/${attentionBannersSrc.fileNameIPad}`;
    if (from === null && to === null) {
        showAttentionBanner = true;
    }
    if (from && to) {
        const attentionForHrodnaEUDirections = directionsForHrodnaEUAttentionBanner.find(
            el =>
                (el.from === from.id && el.to === to.id) ||
                (el.from === to.id && el.to === from.id)
        );
        const attentionForAllDirections = directionsForAttentionBanner.find(
            el =>
                (el.from === from.id && el.to === to.id) ||
                (el.from === to.id && el.to === from.id)
        );
        if (attentionForHrodnaEUDirections !== undefined) {
            srcAttentionBannerWeb = `/static/img/${attentionHrodnaEUBannersSrc.fileNameWeb}`;
            srcAttentionBannerMobile = `/static/img/${attentionHrodnaEUBannersSrc.fileNameMobile}`;
            srcAttentionBannerIPad = `/static/img/${attentionHrodnaEUBannersSrc.fileNameIPad}`;
            showAttentionBanner = true;
        } else if (attentionForAllDirections !== undefined) {
            showAttentionBanner = true;
        }
    }

    //InfoBanners
    let showInfoBanner = false;
    let srcInfoBannerWeb = '';
    let srcInfoBannerMobile = '';
    let srcInfoBannerIPad = '';

    //KishinevMoscowInfoBanner
    if (from && to) {
        const direction = directionsForKishinevMoscowInfoBanner.find(
            el => el.from === from.id && el.to === to.id
        );
        if (direction !== undefined) {
            srcInfoBannerWeb = `/static/img/${kishinevMoscowInfoBannerSrc.fileNameWeb}`;
            srcInfoBannerMobile = `/static/img/${kishinevMoscowInfoBannerSrc.fileNameMobile}`;
            srcInfoBannerIPad = `/static/img/${kishinevMoscowInfoBannerSrc.fileNameIPad}`;
            showInfoBanner = true;
        }
    }

    if (isMobile) {
        return (
            <Layout
                className={clsx({
                    [classes.layoutMinHeight]: isSearchWithStatus,
                })}
                nativeAppTopperVisible={topper.visible}
            >
                {meta.nativeAppTopperEnabled ? (
                    <NoSsr>
                        <NativeAppTopper
                            open={topper.open}
                            onClose={topper.handleClose}
                            className={classes.NativeAppTopper}
                            position="fixed"
                        />
                    </NoSsr>
                ) : null}

                {inWebView ? (
                    <Header compact={isSearch} ref={containerRef}>
                        <VisibilitySensor
                            offset={{ top: 32 + 85 - getSafeArea().top }}
                            partialVisibility
                            onChange={handleVisibilityChange}
                        >
                            <SearchForm onSubmit={handleSearchFormSubmit} />
                        </VisibilitySensor>

                        <SearchBar
                            visible={searchBarVisible}
                            onSearchClick={handleSearchClick}
                            AppBarProps={{
                                className: clsx({
                                    [classes.searchBarNativeAppTopperVisible]:
                                        topper.visible,
                                }),
                            }}
                        />
                    </Header>
                ) : (
                    <DesktopHeader
                        title={headerTitle}
                        subTitle={headerSubTitle}
                        ref={containerRef}
                        compact={isSearch}
                    >
                        <VisibilitySensor
                            partialVisibility
                            onChange={handleVisibilityChange}
                        >
                            <SearchForm onSubmit={handleSearchFormSubmit} />
                        </VisibilitySensor>

                        <SearchBar
                            visible={searchBarVisible}
                            onSearchClick={handleSearchClick}
                            AppBarProps={{
                                className: clsx({
                                    [classes.searchBarNativeAppTopperVisible]:
                                        topper.visible,
                                }),
                            }}
                        />
                    </DesktopHeader>
                )}

                {calendar.length &&
                !isHome &&
                !isConnectingPage &&
                !isMioTaxi ? (
                    <PriceCalendar
                        calendar={calendar}
                        value={date}
                        onChange={handleCalendarChange}
                        loading={isLoading}
                    />
                ) : null}
                <SearchSeoTags
                    searchFormState={searchFormState}
                    hostname={hostname}
                    country={country}
                    direction={seoDirection}
                />
                {isSearch || isSeoPage ? (
                    <BreadcrumbListJsonLd items={breadcrumbListJsonLdItems} />
                ) : null}

                <Container
                    className={clsx(classes.container, {
                        [classes.containerHidden]: isHome && inWebView,
                    })}
                >
                    {/* У D2D банера приоритет перед сурджом */}
                    {showAttentionBanner && !isMioTaxi && !isCompas ? (
                        <img
                            className={classes.attention_banner_mobile}
                            src={
                                isIPad()
                                    ? srcAttentionBannerIPad
                                    : srcAttentionBannerMobile
                            }
                            alt="attention_banner"
                        />
                    ) : null}
                    {showInfoBanner && !isMioTaxi && !isCompas ? (
                        <img
                            className={classes.attention_banner_mobile}
                            src={
                                isIPad()
                                    ? srcInfoBannerIPad
                                    : srcInfoBannerMobile
                            }
                            alt="info_banner"
                        />
                    ) : null}
                    {showShuttleBanner && !seoDirection && isMioTaxi ? (
                        <HowWorksShuttleBanner />
                    ) : // <a href={shuttleLink}>
                    //     <img
                    //         className={classes.shuttle_banner_mobile}
                    //         src={
                    //             isIPad()
                    //                 ? srcShuttleBannerWeb
                    //                 : srcShuttleBannerMobile
                    //         }
                    //         alt="shuttle_banner"
                    //     />
                    // </a>
                    null}
                    {isDynamicMode && meta.d2dShuttleBannerEnabled ? (
                        <NoSsr>
                            <D2DShuttleBanner
                                className={classes.d2dShuttleBanner}
                            />
                        </NoSsr>
                    ) : surged ? (
                        <SurgeCard className={classes.surgeCard} />
                    ) : null}
                    {isConnectingPage ? (
                        <div>
                            {seoDirection ? (
                                <ConnectingPage seoDirection={seoDirection} />
                            ) : null}
                        </div>
                    ) : isHome && !inWebView ? (
                        <div>
                            {searchHistory.length > 0 && !isMioTaxi && (
                                <FeaturedDestinations
                                    className={classes.featuredDestinations}
                                    destinations={searchHistory}
                                    title={t('search:searchHistory')}
                                    FeaturedDestinationProps={{
                                        disablePrice: true,
                                    }}
                                />
                            )}

                            {nearbyRoutes.length > 0 && !isMioTaxi && (
                                <FeaturedDestinations
                                    className={classes.featuredDestinations}
                                    destinations={nearbyRoutes}
                                    title={t('search:popularDestinations')}
                                    FeaturedDestinationProps={{
                                        IconComponent: SearchIcon,
                                    }}
                                />
                            )}

                            {meta.downloadAppBlockEnabled ? (
                                <DownloadAppMobile
                                    className={classes.DownloadAppMobile}
                                />
                            ) : null}

                            <SearchBanners />
                        </div>
                    ) : isLoading ? (
                        <>
                            {new Array(5).fill('').map((item, i) => (
                                <TripShimmer key={i} className={classes.trip} />
                            ))}
                        </>
                    ) : isSuccess && lastSearch ? (
                        filteredRides.map((ride, index, arr) => {
                            return (
                                <div className={classes.trip} key={ride.id}>
                                    {isMioTaxi ? (
                                        <TripMioTaxi
                                            ride={ride}
                                            onClickBooking={() =>
                                                gotoBooking(ride)
                                            }
                                            onClick={handleDetailsClick}
                                        />
                                    ) : (
                                        <Trip
                                            ride={ride}
                                            onClickDetails={handleDetailsClick}
                                            onClickBooking={() =>
                                                gotoBooking(ride)
                                            }
                                            onClick={handleDetailsClick}
                                        />
                                    )}
                                    {index === arr.length - 1 && isMioTaxi && (
                                        <Box style={{ marginTop: '16px' }}>
                                            <HowWorksShuttleBanner />
                                        </Box>
                                    )}
                                    {index ===
                                        (arr.length > 2 ? 1 : arr.length - 1) &&
                                    showBanner ? (
                                        <a href={bannerLink}>
                                            <img
                                                className={
                                                    classes.banner_mobile
                                                }
                                                src={
                                                    isIPad()
                                                        ? '/static/img/rent_bus_banner_ipad.webp'
                                                        : isNeedToShowAnotherBanner
                                                        ? '/static/img/rent_bus_banner_mobile_108_109.webp'
                                                        : '/static/img/rent_bus_banner_mobile.webp'
                                                }
                                                alt="banner"
                                            />
                                        </a>
                                    ) : null}
                                </div>
                            );
                        })
                    ) : isNotFound ? (
                        calendarWithoutCurrentDate.length > 0 ? (
                            <RidesNotFoundSuggestionsCard />
                        ) : (
                            <NotifyPaper
                                title={
                                    isMioTaxi
                                        ? t('search:notFoundTaxi')
                                        : t('search:notFound')
                                }
                                subtitle={
                                    isMioTaxi
                                        ? t('search:notFoundDescTaxi')
                                        : t('search:notFoundDesc')
                                }
                            />
                        )
                    ) : status === ERROR_RIDES ? (
                        <NotifyPaper
                            title={t('search:somethingWentWrong')}
                            subtitle={t('search:somethingWentWrongDesc')}
                        />
                    ) : (
                        false
                    )}
                </Container>

                {isAtlas && lastSearch ? (
                    <Container className={classes.beOurPartnerCardContainer}>
                        <Grid item md={4} lg={3} />
                        <Grid item md={8} lg={9}>
                            <CarbusPartnerCard />
                        </Grid>
                    </Container>
                ) : null}

                {lastSearch && !inWebView && !isConnectingPage ? (
                    <Container className={classes.relatedDestinations}>
                        {seoDirection ? (
                            <>
                                <Grid item md={4} lg={3} />
                                <Grid item md={8} lg={9}>
                                    <RelatedDestinations seo={seoDirection} />
                                </Grid>
                            </>
                        ) : (
                            false
                        )}
                    </Container>
                ) : null}

                {isSeoPage && breadcrumbs ? (
                    <Container>
                        <div className={classes.breadcrumbsMobile}>
                            {breadcrumbs}
                        </div>
                    </Container>
                ) : null}

                {!isMioTaxi && rides.length && (isSearch || isSeoPage) ? (
                    <Filters
                        open={filtersOpen}
                        count={filtersCount}
                        pickupStops={allPickupStops}
                        dischargeStops={allDischargeStops}
                        onOpen={handleFiltersOpen}
                        onClose={handleFiltersClose}
                        onSubmit={handleFiltersSubmit}
                    />
                ) : null}

                {currentRide ? (
                    <RideDetailsDialog
                        open={detailsOpen}
                        onClose={handleDetailsClose}
                        onSubmit={() => gotoBooking(currentRide)}
                        ride={currentRide}
                        passengers={lastSearch ? lastSearch.passengers : 1}
                    />
                ) : null}

                {!inWebView ? <Footer /> : null}

                {showPWAInstallButton ? <PwaDialog /> : null}

                {reviewDialog.showDialog ? (
                    <SnackbarProvider>
                        <ReviewDialog
                            open={reviewDialog.open}
                            onClose={reviewDialog.handleClose}
                        />
                    </SnackbarProvider>
                ) : null}

                {referralDialog.showDialog ? (
                    <SnackbarProvider>
                        <ReferralPromocodeDialog
                            open={referralDialog.open}
                            onClose={referralDialog.handleClose}
                            onDismiss={referralDialog.handleDismiss}
                        />
                    </SnackbarProvider>
                ) : null}
            </Layout>
        );
    } else {
        return (
            <div className={classes.root}>
                <DesktopAppBar />
                <SearchSeoTags
                    searchFormState={searchFormState}
                    hostname={hostname}
                    country={country}
                    direction={seoDirection}
                />
                {isSearch || isSeoPage ? (
                    <BreadcrumbListJsonLd items={breadcrumbListJsonLdItems} />
                ) : null}
                <DesktopHeader
                    compact={isSearch}
                    title={headerTitle}
                    subTitle={headerSubTitle}
                >
                    <SearchForm onSubmit={handleSearchFormSubmit} />

                    {isHome ? (
                        searchHistory.length > 0 || (from && to) ? (
                            <Grid
                                container
                                item
                                md={10}
                                className={
                                    classes.searchFormHintsAndDatesContainer
                                }
                            >
                                <Grid item md={6}>
                                    {searchHistory.length > 0 ? (
                                        <SearchFormHints
                                            destinations={searchHistory.slice(
                                                0,
                                                2
                                            )}
                                        />
                                    ) : null}
                                </Grid>

                                <Grid item md={6}>
                                    <SearchFormFastDates />
                                </Grid>
                            </Grid>
                        ) : (
                            <div
                                className={classes.searchFormHintsPlaceholder}
                            />
                        )
                    ) : null}
                </DesktopHeader>
                {calendar.length &&
                !isHome &&
                !isConnectingPage &&
                !isMioTaxi ? (
                    <PriceCalendar
                        calendar={calendar}
                        value={date}
                        onChange={handleCalendarChange}
                        loading={isLoading}
                    />
                ) : null}
                <Container className={classes.container}>
                    {isMioTaxi && isHome && <DownloadAppPaper />}
                    {isConnectingPage ? (
                        <div>
                            {seoDirection ? (
                                <ConnectingPage seoDirection={seoDirection} />
                            ) : null}
                        </div>
                    ) : isHome ? (
                        <div>
                            {nearbyRoutes.length >= 3 && !isMioTaxi && (
                                <FeaturedDestinations
                                    className={classes.featuredDestinations}
                                    destinations={nearbyRoutes}
                                    title={t('search:popularDestinations')}
                                    FeaturedDestinationProps={{
                                        IconComponent: SearchIcon,
                                    }}
                                />
                            )}

                            {meta.downloadAppBlockEnabled ? (
                                <DownloadAppPaper
                                    className={classes.DownloadAppPaper}
                                />
                            ) : null}
                        </div>
                    ) : isLoading ? (
                        <Grid container spacing={4}>
                            <Grid item md={8} lg={9}>
                                {Array(3)
                                    .fill('')
                                    .map((v, i) => (
                                        <DesktopTripShimmer
                                            key={i}
                                            className={classes.trip}
                                        />
                                    ))}
                            </Grid>
                            <Grid item md={4} lg={3}>
                                <DesktopFiltersShimmer />
                            </Grid>
                        </Grid>
                    ) : status === SUCCESS_RIDES ? (
                        <Grid container spacing={4}>
                            {showAttentionBanner && !isMioTaxi && !isCompas ? (
                                <img
                                    className={classes.attention_banner_web}
                                    src={srcAttentionBannerWeb}
                                    alt="attention_banner"
                                />
                            ) : null}
                            {showInfoBanner && !isMioTaxi && !isCompas ? (
                                <img
                                    className={classes.attention_banner_web}
                                    src={srcInfoBannerWeb}
                                    alt="info_banner"
                                />
                            ) : null}
                            <Grid item md={8} lg={9}>
                                {showShuttleBanner && false ? (
                                    <a href={shuttleLink}>
                                        <img
                                            className={
                                                classes.shuttle_banner_web
                                            }
                                            src={srcShuttleBannerWeb}
                                            alt="shuttle_banner"
                                        />
                                    </a>
                                ) : null}
                                {surged ? (
                                    <SurgeCard className={classes.surgeCard} />
                                ) : null}
                                {isNotFound ? (
                                    calendarWithoutCurrentDate.length > 0 ? (
                                        <RidesNotFoundSuggestionsCard />
                                    ) : (
                                        <NotifyPaper
                                            title={
                                                isMioTaxi
                                                    ? t('search:notFoundTaxi')
                                                    : t('search:notFound')
                                            }
                                            subtitle={
                                                isMioTaxi
                                                    ? t(
                                                          'search:notFoundDescTaxi'
                                                      )
                                                    : t('search:notFoundDesc')
                                            }
                                        />
                                    )
                                ) : lastSearch ? (
                                    isMioTaxi ? (
                                        filteredRides.map(ride => (
                                            <Box
                                                className={classes.tripMioTaxi}
                                                key={ride.id}
                                            >
                                                <TripMioTaxi
                                                    ride={ride}
                                                    onClickBooking={() =>
                                                        gotoBooking(ride)
                                                    }
                                                    onClick={handleDetailsClick}
                                                />
                                            </Box>
                                        ))
                                    ) : (
                                        filteredRides.map(ride => (
                                            <DesktopTrip
                                                key={ride.id}
                                                onClickBooking={() =>
                                                    gotoBooking(ride)
                                                }
                                                className={classes.trip}
                                                ride={ride}
                                            />
                                        ))
                                    )
                                ) : null}
                                {isAtlas && lastSearch ? (
                                    <CarbusPartnerCard
                                        className={
                                            classes.beOurPartnerCardContainerDesktop
                                        }
                                    />
                                ) : null}
                                {seoDirection ? (
                                    <RelatedDestinations
                                        seo={seoDirection}
                                        className={
                                            classes.relatedDestinationsDesktop
                                        }
                                    />
                                ) : null}
                            </Grid>

                            <Grid item md={4} lg={3}>
                                {isMioTaxi ? (
                                    <HowWorksShuttleBanner />
                                ) : (
                                    <DesktopFilters
                                        dischargeStops={allDischargeStops}
                                        pickupStops={allPickupStops}
                                        count={filtersCount}
                                    />
                                )}
                                {showBanner ? (
                                    <a href={bannerLink}>
                                        <img
                                            className={classes.banner_web}
                                            src={
                                                isNeedToShowAnotherBanner
                                                    ? '/static/img/rent_bus_banner_web_108_109.webp'
                                                    : '/static/img/rent_bus_banner_web.webp'
                                            }
                                            alt="banner"
                                        />
                                    </a>
                                ) : null}
                                {isSeoPage && breadcrumbs ? (
                                    <div className={classes.breadcrumbsDesktop}>
                                        {breadcrumbs}
                                    </div>
                                ) : null}
                            </Grid>
                        </Grid>
                    ) : status === ERROR_RIDES ? (
                        <NotifyPaper
                            title={t('search:somethingWentWrong')}
                            subtitle={t('search:somethingWentWrongDesc')}
                        />
                    ) : (
                        false
                    )}
                </Container>
                <Footer />
                {showPWAInstallButton ? <PwaDialog /> : null}
            </div>
        );
    }
};

Search.getInitialProps = async ctx => {
    const { query, store, req, pathname, res } = ctx;

    const cookies = new Cookies(req && req.headers.cookie);

    const initialLanguage: Locale | null =
        req && (req as any).i18n
            ? cookies.get('next-i18next')
            : getInitialLanguage(req);
    const isHome = pathname === '/';
    const isSeo = pathname === '/seo';
    const isSearch = pathname === '/search';
    const reqUrl = getCurrentPageUrl(ctx);
    const hostname = reqUrl.hostname;
    const { brand } = store.getState();

    const {
        from = '',
        to = '',
        fromName = '',
        toName = '',
        date,
        passengers: passengersParam = '1',
        time: timeParam = undefined,
    }: QueryParams = query;

    // Дата из QueryParams (?date=)
    //
    // isDateBefore: проверит не является ли дата прошедшей,
    // т.к. Яндекс проиндексировал пользовательский URL с (?from,to,date),
    const dateFromQuery =
        date && isISODate(date) && !isDateBefore(date) ? date : null;

    // Cерверное или браузерное время (зависит откуда вызывается getInitialProps)
    const serverOrBrowserTodayDate = format(new Date(), 'yyyy-MM-dd');

    // hotfix2: еще такое проиндексировалось
    // &date=undefined&passengers=undefined&fromName=Кадуй&toName=Санкт-Петербург
    const passengers = isNumeric(parseInt(passengersParam))
        ? passengersParam
        : '1';
    const time =
        brand.brandName === 'miotaxi' && !timeParam
            ? format(new Date(), 'HH:mm')
            : timeParam;

    if (isServer) {
        // Extra %20 at the end of URLs on SEO pages
        // https://tracker.yandex.ru/MORDA-461
        if (reqUrl.pathname.slice(-3) === '%20') {
            if (res) {
                res.writeHead(301, {
                    Location: reqUrl.pathname.slice(0, -3),
                });
                res.end();
            }
        }
    }

    // Попытка получить SEO direction
    let seoDirection: SeoDtoResponse | null = null;
    if (
        (isSeo || isSearch) &&
        (fromName || from) &&
        (toName || to) &&
        !isCordova
    ) {
        try {
            const xForwardedFor = isServer && req ? getRealIP(req) : undefined;

            const pathLowerCase = decodeURI(reqUrl.pathname).toLowerCase();

            const seoPrefixRu =
                req && (req as any).i18n
                    ? (req as any).i18n
                          .t('seoDirectionsPathRU')
                          .toLocaleLowerCase()
                    : 'маршруты';
            const seoPrefixPl =
                req && (req as any).i18n
                    ? (req as any).i18n
                          .t('seoDirectionsPathPL')
                          .toLocaleLowerCase()
                    : 'marszruta';

            const langFromUrl =
                pathLowerCase.includes(seoPrefixRu) ||
                pathLowerCase.includes('маршруты')
                    ? 'ru'
                    : pathLowerCase.includes(seoPrefixPl) ||
                      pathLowerCase.includes('marszruta')
                    ? 'pl'
                    : '';
            const langForSeoDirection =
                isSeo && langFromUrl ? langFromUrl : initialLanguage || 'ru';

            seoDirection = (await apiClient.getSeoDirection(
                langForSeoDirection,
                isSeo ? fromName : from,
                isSeo ? toName : to,
                brand.brandName,
                xForwardedFor,
                hostname
            )).data;

            store.dispatch(seoSuccess(seoDirection));

            // Пытаемся получить текущую дату в городе отправления
            let departureCityTodayDate = null;
            try {
                // может выдать ошибку если имя timezone невалидное
                departureCityTodayDate = getTodayDateOfCity(
                    seoDirection.from.timezone
                );
            } catch (err) {}

            // Добавляем использование переведенных названий городов, при поиске рейсов в форме на главной странице

            const langForInit = initialLanguage
                ? initialLanguage
                : langForSeoDirection;

            const localizedFrom =
                seoDirection.from.localized_name[
                    langForInit as keyof LocalizedName
                ];
            const localizedTo =
                seoDirection.to.localized_name[
                    langForInit as keyof LocalizedName
                ];

            const queryObj: any = {
                fromValue: {
                    id: `c${seoDirection.from.id}`,
                    name: localizedFrom,
                },
                toValue: {
                    id: `c${seoDirection.to.id}`,
                    name: localizedTo,
                },
                date:
                    dateFromQuery ||
                    departureCityTodayDate ||
                    serverOrBrowserTodayDate,
                passengers,
                fromInputValue: localizedFrom,
                toInputValue: localizedTo,
            };
            if (time) {
                queryObj['time'] = time;
            }
            store.dispatch(initSearchForm(queryObj));

            if (isServer) {
                store.dispatch(fetchingRides(false, !!dateFromQuery));
            } else {
                store.dispatch(fetchingRides());
            }
        } catch (e) {
            // Чтобы не отображать контактные телефоны пред. поиска
            store.dispatch(seoReset());

            console.error(e);
        }
    }

    // Если не смогли получить SEO direction,
    // fromName/toName берем из QueryParams
    if ((isSeo || isSearch) && !seoDirection) {
        let payload: Partial<SearchFormState> = {
            date: dateFromQuery || serverOrBrowserTodayDate,
            passengers,
        };

        if (from && to) {
            payload.fromValue = {
                id: from,
                name: fromName,
            };
            payload.toValue = {
                id: to,
                name: toName,
            };
            payload.fromInputValue = fromName;
            payload.toInputValue = toName;
        }

        store.dispatch(initSearchForm(payload));

        if (isServer) {
            store.dispatch(fetchingRides(false, !!dateFromQuery));
        } else {
            store.dispatch(fetchingRides());
        }
    }

    // Популярные направления для главной страницы
    if (isHome && isServer) {
        store.dispatch(seoFeaturedFetching(req));
    }

    // NativeAppTopper
    const nativeAppTopperCookie = !!cookies.get(NATIVE_APP_TOPPER_COOKIE_KEY);

    return {
        namespacesRequired: ['search', 'auth', 'brand'],
        initialLanguage,
        seoDirection,
        hostname,
        nativeAppTopperCookie,
    };
};

type QueryParams = {
    from?: string;
    to?: string;
    date?: string;
    passengers?: string;
    time?: string;
    fromName?: string;
    toName?: string;
    seoPage?: string;
};
