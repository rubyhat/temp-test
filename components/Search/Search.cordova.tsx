import React, { useEffect, useLayoutEffect } from 'react';
import Container from '@material-ui/core/Container';
import Head from 'next/head';
import VisibilitySensor from 'react-visibility-sensor';
import clsx from 'clsx';
import { NextPage } from 'next';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import animateScrollTo from 'animated-scroll-to';

import {
    ERROR_RIDES,
    FETCHING_RIDES,
    POLLING_RIDES,
    SearchRidesState,
    SUCCESS_RIDES,
} from 'store/search-rides/types';
import Layout from 'layouts/navigation';
import { CountryState } from 'store/country/types';
import { Header } from '../Header/Header';
import { Locale } from 'i18n/utils';
import { NotifyPaper } from '../NotifyPaper';
import { RideDetailsDialog } from '../RideDetailsDialog';
import { RootState } from 'store';
import { SearchBar } from '../SearchBar';
import { SearchForm } from '../SearchForm/SearchForm';
import { SearchFormState } from 'store/search-form/types';
import { Trip } from '../Trip';
import { TripShimmer } from '../TripShimmer';
import {
    changeSearchForm,
    initSearchForm,
    persistSearchForm,
} from 'store/search-form/actions';
import { fetchingRides } from 'store/search-rides/actions';
import { getInitialLanguage } from 'utils/getInitialLanguage';
import { isCordova, isIPad } from 'utils/platform';
import { useFilters } from 'hooks/useFilters';
import { useLanguage } from 'hooks/useLanguage';
import { useRideDetails } from 'hooks/useRideDetails';
import { useSearchBar } from 'hooks/useSearchBar';
import { useStyles } from './Search.styles';
import { useTranslation } from 'i18n';
import { format } from 'utils/date';
import { PriceCalendar } from '../PriceCalendar';
import { getSafeArea } from 'utils/safeArea';
import { Filters } from '../Filters';
import { LastSearchState, SearchQuery } from 'store/last-search/types';
import { SurgeCard } from 'components/Surge';
import { isSurged } from 'utils/isSurged';
import { useSAAS } from 'hooks/useSAAS';
import { CarbusPartnerCard } from 'components/CarbusPartnerCard';
import { useReviewDialog } from 'hooks/useReviewDialog';
import SnackbarProvider from 'components/ui/Snackbar/SnackbarProvider';
import { ReviewDialog } from 'components/reviews/ReviewDialog';
import { D2DShuttleBanner } from 'components/serp/D2DShuttleBanner';
import { hasDynamicMode } from 'utils/hasDynamicMode';
import { RidesNotFoundSuggestionsCard } from 'components/RidesNotFoundSuggestionsCard';
import { excludeCurrentDate } from 'utils/calendar';
import { useReferralDialog } from 'hooks/useReferralDialog';
import { ReferralPromocodeDialog } from 'components/referral/ReferralPromocodeDialog';
import {
    attentionBannersSrc,
    attentionHrodnaEUBannersSrc,
    carriersForShuttleBanner,
    directionsForAttentionBanner,
    directionsForBanner,
    directionsForHrodnaEUAttentionBanner,
    directionsForKishinevMoscowInfoBanner,
    directionsForShuttleBanner,
    kishinevMoscowInfoBannerSrc,
} from './config/bannersConfig';
import { SaasUpdateVersionLoad } from 'store/saasUpdateVersion/actions';
import { TripMioTaxi } from 'components/Trip/TripMioTaxi';
import { usePullToRefresh } from '../../hooks/usePullToRefresh';
import { BrandState } from 'store/brand/types';

type Props = {
    initialLanguage: Locale | null;
};

export const Search: NextPage<Props> = props => {
    const { initialLanguage } = props;
    const router = useRouter();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const classes = useStyles();

    // Document title
    const language = useLanguage(initialLanguage);
    const { country } = useSelector<RootState, CountryState>(
        rootState => rootState.country
    );
    const { brandName } = useSelector<RootState, BrandState>(
        rootState => rootState.brand
    );

    // SearchBar
    const {
        containerRef,
        searchBarVisible,
        handleSearchClick,
        handleVisibilityChange,
    } = useSearchBar();

    // SearchForm
    const handleSearchFormSubmit = async () => {
        const queryObj: SearchQuery = {
            from: from ? from.id : '',
            to: to ? to.id : '',
            date,
            passengers: Number(passengers),
            fromName,
            toName,
        };
        if (time) {
            queryObj['time'] = time;
        }
        await router.push(
            {
                pathname: '/search',
                query: queryObj,
            },
            undefined,
            { shallow: true }
        );
        dispatch(fetchingRides(true));
    };

    // Rides
    const { lastSearch } = useSelector<RootState, LastSearchState>(
        rootState => rootState.lastSearch
    );
    const { rides, calendar, status, withScrolling } = useSelector<
        RootState,
        SearchRidesState
    >(rootState => rootState.searchRides);
    const calendarWithoutCurrentDate = excludeCurrentDate(
        calendar,
        (lastSearch && lastSearch.date) || ''
    );

    const {
        fromValue: from,
        toValue: to,
        fromInputValue: fromName,
        toInputValue: toName,
        date,
        passengers,
        time,
    } = useSelector<RootState, SearchFormState>(
        rootState => rootState.searchForm
    );

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
        pickupStop,
        dischargeStop,

        filtersOpen,
        handleFiltersOpen,
        handleFiltersClose,
        handleFiltersSubmit,

        getDepartureDate,
        getArrivalDate,
    } = useFilters();

    // Calendar
    const handleCalendarChange = (newDate: string) => {
        if (!lastSearch) {
            console.warn('Missing store.lastSearch');
            return;
        }
        const { from, to, passengers, time } = lastSearch;

        dispatch(
            changeSearchForm({
                date: newDate,
            })
        );
        const queryObj: SearchQuery = {
            from: from.id,
            to: to.id,
            date: newDate,
            passengers,
            fromName: from.name,
            toName: to.name,
        };
        if (time) {
            queryObj['time'] = time;
        }
        router.push(
            {
                pathname: '/search',
                query: queryObj,
            },
            undefined,
            { shallow: true }
        );
        dispatch(fetchingRides());
    };

    // Helpers
    const isLoading = status === FETCHING_RIDES || status === POLLING_RIDES;
    const isSuccess = status === SUCCESS_RIDES && filteredRides.length > 0;
    const isNotFound = status === SUCCESS_RIDES && !filteredRides.length;
    const isSearch = router.pathname === '/search';
    const isSearchWithStatus = isSearch && status !== null;

    const isNeedToShowAnotherBanner =
        status === SUCCESS_RIDES &&
        filteredRides
            .map(
                ride =>
                    ride.carrierID && ['108', '109'].includes(ride.carrierID)
            )
            .filter(Boolean).length > 0;

    // Surge
    const { meta } = useSAAS();
    const surged =
        isSuccess &&
        isSearch &&
        !meta.surgeDisabled &&
        isSurged(rides, meta.surgePercentage);

    // D2D
    const isDynamicMode = isSuccess && isSearch && hasDynamicMode(rides);

    // При открытии напрямую из Cordova
    // нужно установить QueryParams
    // в редюсер SearchForm, т.к.
    // `getInitialProps` не вызывается.
    useEffect(() => {
        if (isSearch) {
            const query: Record<string, string> = router.query as any;
            dispatch(
                initSearchForm({
                    fromValue: {
                        id: query.from || '',
                        name: query.fromName || '',
                    },
                    toValue: {
                        id: query.to || '',
                        name: query.toName || '',
                    },
                    fromInputValue: query.fromName || '',
                    toInputValue: query.toName || '',
                    date: query.date || format(new Date(), 'yyyy-MM-dd'),
                    passengers: query.passengers || '1',
                })
            );
        }
    }, []);
    // Ждем инициализации SearchForm
    useEffect(() => {
        if (isCordova && isSearch) {
            if (from && to && date && passengers) {
                dispatch(fetchingRides());
            }
        }
    }, [from, to, date, passengers, isSearch, time]);

    useEffect(() => {
        if (!isSearch) {
            dispatch(persistSearchForm());
        }
    }, []);

    // Scroll fix
    useEffect(() => {
        document.body.style.overflow = 'auto';
        // Запрашиваем актуальную версию приложения на главной странице
        dispatch(SaasUpdateVersionLoad());
    }, []);

    useLayoutEffect(() => {
        if (containerRef.current && isLoading && isSearch && withScrolling) {
            // AppBar height
            animateScrollTo(
                containerRef.current.offsetHeight - 56 - getSafeArea().top
            );
        }
    }, [isLoading, isSearch, withScrolling]);

    const { isAtlas, isMioTaxi, isCompas } = useSAAS();
    usePullToRefresh(() => {
        dispatch(fetchingRides());
    }, isSearch);

    // Trip review dialog
    const reviewDialog = useReviewDialog();

    // User referral dialog
    const referralDialog = useReferralDialog();

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
            el => el.from === from.id && el.to === to.id
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
            srcAttentionBannerMobile = `/static/img/${attentionHrodnaEUBannersSrc.fileNameMobile}`;
            srcAttentionBannerIPad = `/static/img/${attentionHrodnaEUBannersSrc.fileNameIPad}`;
            showAttentionBanner = true;
            showAttentionBanner = true;
        } else if (attentionForAllDirections !== undefined) {
            showAttentionBanner = true;
        }
    }

    //InfoBanners
    let showInfoBanner = false;
    let srcInfoBannerMobile = '';
    let srcInfoBannerIPad = '';

    //KishinevMoscowInfoBanner
    if (from && to) {
        const direction = directionsForKishinevMoscowInfoBanner.find(
            el =>
                (el.from === from.id && el.to === to.id) ||
                (el.from === to.id && el.to === from.id)
        );
        if (direction !== undefined) {
            srcInfoBannerMobile = `/static/img/${kishinevMoscowInfoBannerSrc.fileNameMobile}`;
            srcInfoBannerIPad = `/static/img/${kishinevMoscowInfoBannerSrc.fileNameIPad}`;
            showInfoBanner = true;
        }
    }

    return (
        <Layout
            className={clsx({ [classes.layoutMinHeight]: isSearchWithStatus })}
        >
            <Head>
                <title key="title">
                    {t(`documentTitle${country}`, { context: brandName })}
                </title>
            </Head>

            <Header compact={isSearchWithStatus} ref={containerRef}>
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
                />
            </Header>

            {calendar.length && isSearch && !isMioTaxi ? (
                <PriceCalendar
                    calendar={calendar}
                    value={date}
                    onChange={handleCalendarChange}
                    loading={isLoading}
                />
            ) : null}

            <Container
                className={clsx(classes.container, {
                    [classes.containerHidden]: router.pathname === '/',
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
                        src={isIPad() ? srcInfoBannerIPad : srcInfoBannerMobile}
                        alt="info_banner"
                    />
                ) : null}
                {showShuttleBanner ? (
                    <a href={shuttleLink}>
                        <img
                            className={classes.shuttle_banner_mobile}
                            src={
                                isIPad()
                                    ? srcShuttleBannerWeb
                                    : srcShuttleBannerMobile
                            }
                            alt="shuttle_banner"
                        />
                    </a>
                ) : null}
                {isDynamicMode && meta.d2dShuttleBannerEnabled ? (
                    <D2DShuttleBanner className={classes.d2dShuttleBanner} />
                ) : surged ? (
                    <SurgeCard className={classes.surgeCard} />
                ) : null}

                {isLoading ? (
                    <>
                        {new Array(5).fill('').map((item, i) => (
                            <TripShimmer key={i} className={classes.trip} />
                        ))}
                    </>
                ) : isSuccess && lastSearch ? (
                    filteredRides.map((ride, index, arr) => (
                        <div className={classes.trip}>
                            {isMioTaxi ? (
                                <TripMioTaxi
                                    key={ride.id}
                                    ride={ride}
                                    onClickBooking={() => gotoBooking(ride)}
                                    onClick={handleDetailsClick}
                                />
                            ) : (
                                <Trip
                                    key={ride.id}
                                    ride={ride}
                                    onClickDetails={handleDetailsClick}
                                    onClickBooking={() => gotoBooking(ride)}
                                    onClick={handleDetailsClick}
                                />
                            )}
                            {index === (arr.length > 2 ? 1 : arr.length - 1) &&
                            showBanner ? (
                                <a href={bannerLink}>
                                    <img
                                        className={classes.banner_mobile}
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
                    ))
                ) : isNotFound ? (
                    calendarWithoutCurrentDate.length > 0 ? (
                        <RidesNotFoundSuggestionsCard />
                    ) : (
                        <NotifyPaper
                            title={t('search:notFound')}
                            subtitle={t('search:notFoundDesc')}
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

                {isAtlas && lastSearch ? (
                    <CarbusPartnerCard
                        className={classes.beOurPartnerCardCordova}
                    />
                ) : null}
            </Container>

            {!isMioTaxi && rides.length && isSearch ? (
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
};

Search.getInitialProps = async ctx => {
    const { req } = ctx;
    const initialLanguage: Locale | null = getInitialLanguage(req);

    return {
        namespacesRequired: ['search', 'brand'],
        initialLanguage,
    };
};
