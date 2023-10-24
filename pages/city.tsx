import React, { useMemo, useEffect } from 'react';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Link from 'next/link';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { NextPage } from 'next';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import Layout from 'layouts/navigation';
import { BrandState } from 'store/brand/types';
import { CitySeoTags } from 'components/CitySeoTags';
import { DesktopAppBar } from 'components/DesktopAppBar';
import { DesktopHeader } from 'components/DesktopHeader';
import { FeaturedDestinationCard } from 'components/FeaturedDestinations';
import { Footer } from 'components/Footer/Footer';
import { RootState } from 'store';
import { SearchBanners } from 'components/SearchBanners/SearchBanners';
import { SearchForm } from 'components/SearchForm/SearchForm';
import { SearchFormState } from 'store/search-form/types';
import { SeoCityState } from 'store/seo-city/types';
import { Typo } from 'components/Typo/Typo';
import { fetchingRides } from 'store/search-rides/actions';
import { getCurrentPageUrl } from 'utils/pageUrl';
import { routerPushSeoPage } from 'utils/routerPushSeoPage';
import { seoCityFetching } from 'store/seo-city/actions';
import { usePlatform } from 'hooks/usePlatform';
import { useSeo } from 'hooks/useSeo';
import { useTranslation } from 'i18n';
import { useSeoPrefix } from 'hooks/useSeoPrefix';
import { isServer } from 'utils/platform';
import { BreadcrumbListJsonLd } from 'components/BreadcrumbListJsonLd';

const useStyles = makeStyles(
    (theme: Theme) => ({
        /* Styles applied to the root element. */
        root: {
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
        },
        container: {
            marginTop: theme.spacing(4),
        },
        destinations: {
            marginTop: theme.spacing(3),
        },
        breadcrumbs: {
            '& .MuiBreadcrumbs-li a': {
                textDecoration: 'none',
                color: theme.palette.text.secondary,

                '&:hover': {
                    textDecoration: 'underline',
                },
            },
        },
        subtitle: {
            marginTop: theme.spacing(1),
        },
    }),
    { name: 'City' }
);

type Props = {
    hostname: string;
};

const City: NextPage<Props> = props => {
    const { hostname } = props;
    const classes = useStyles();
    const { isMobile } = usePlatform();
    const dispatch = useDispatch();
    const router = useRouter();
    const { t } = useTranslation();

    const searchFormState = useSelector<RootState, SearchFormState>(
        rootState => rootState.searchForm
    );
    const {
        fromValue: from,
        toValue: to,
        date,
        passengers,
        time,
    } = searchFormState;

    const { city, destinations } = useSelector<RootState, SeoCityState>(
        rootState => rootState.seoCity
    );

    const { brandName } = useSelector<RootState, BrandState>(
        rootState => rootState.brand
    );

    const { seoPrefix } = useSeoPrefix();

    const handleSearchFormSubmit = async () => {
        const queryObj: any = { from, to, date, passengers };
        if (time) {
            queryObj['time'] = time;
        }
        await routerPushSeoPage(router, queryObj, seoPrefix, { shallow: true });

        dispatch(fetchingRides(true));
    };

    const { headerTitle, headerSubTitle } = useSeo(hostname, searchFormState);
    const seoCityTitle = t('brand:seoCityTitle', {
        city,
        context: brandName,
    });
    const seoCitySubtitle = t('brand:seoCitySubtitle', {
        city,
        context: brandName,
    });

    // Scroll fix
    useEffect(() => {
        document.body.style.overflow = 'auto';
    }, []);

    // BreadcrumbList JSON-LD items
    const breadcrumbListJsonLdItems = useMemo(() => {
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
                '@id': `https://${hostname}/${seoPrefix}/${city}`,
                name: city,
            },
        ];
    }, [hostname, seoPrefix, city]);

    if (isMobile) {
        return (
            <Layout>
                <DesktopHeader title={headerTitle} subTitle={headerSubTitle}>
                    <SearchForm onSubmit={handleSearchFormSubmit} />
                </DesktopHeader>

                <Container className={classes.container}>
                    <Breadcrumbs
                        aria-label="breadcrumb"
                        separator={<NavigateNextIcon fontSize="small" />}
                        className={classes.breadcrumbs}
                    >
                        <Link href="/">
                            <a>{t('breadcrumbHome')}</a>
                        </Link>

                        <Typo color="textPrimary">{city}</Typo>
                    </Breadcrumbs>
                    <BreadcrumbListJsonLd items={breadcrumbListJsonLdItems} />

                    <div>
                        <div className={classes.destinations}>
                            <Grid item xs={12}>
                                <Typo variant="title" weight="bold">
                                    {seoCityTitle}
                                </Typo>
                                <Typo
                                    variant="subtitle"
                                    className={classes.subtitle}
                                >
                                    {seoCitySubtitle}
                                </Typo>
                            </Grid>

                            <Grid
                                className={classes.container}
                                container
                                spacing={2}
                            >
                                {destinations.map((destination, i) => (
                                    <Grid item xs={12} md={4} key={i}>
                                        <FeaturedDestinationCard
                                            destination={destination}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </div>

                        <SearchBanners />
                    </div>
                </Container>

                <Footer />

                <CitySeoTags
                    docTitle={seoCityTitle}
                    docDescription={seoCitySubtitle}
                    cityName={city}
                    hostname={hostname}
                />
            </Layout>
        );
    } else {
        return (
            <div className={classes.root}>
                <DesktopAppBar />

                <DesktopHeader title={headerTitle} subTitle={headerSubTitle}>
                    <SearchForm onSubmit={handleSearchFormSubmit} />
                </DesktopHeader>

                <Container className={classes.container}>
                    <Breadcrumbs
                        aria-label="breadcrumb"
                        separator={<NavigateNextIcon fontSize="small" />}
                        className={classes.breadcrumbs}
                    >
                        <Link href="/">
                            <a>{t('breadcrumbHome')}</a>
                        </Link>

                        <Typo color="textPrimary">{city}</Typo>
                    </Breadcrumbs>
                    <BreadcrumbListJsonLd items={breadcrumbListJsonLdItems} />

                    <div>
                        <div className={classes.destinations}>
                            <Grid item xs={12}>
                                <Typo variant="title" weight="bold">
                                    {seoCityTitle}
                                </Typo>
                                <Typo
                                    variant="subtitle"
                                    className={classes.subtitle}
                                >
                                    {seoCitySubtitle}
                                </Typo>
                            </Grid>

                            <Grid
                                className={classes.container}
                                container
                                spacing={3}
                            >
                                {destinations.map((destination, i) => (
                                    <Grid item xs={12} md={4} key={i}>
                                        <FeaturedDestinationCard
                                            destination={destination}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </div>

                        <SearchBanners />
                    </div>
                </Container>

                <Footer />

                <CitySeoTags
                    docTitle={seoCityTitle}
                    docDescription={seoCitySubtitle}
                    cityName={city}
                    hostname={hostname}
                />
            </div>
        );
    }
};

City.getInitialProps = async ctx => {
    const { store, query } = ctx;
    const reqUrl = getCurrentPageUrl(ctx);
    const hostname = reqUrl.hostname;
    let { city: cityName } = query as { city: string };

    if (isServer) {
        // Для направлений типа: Правые+Мосты
        cityName = cityName.replace(/\+/g, ' ');
        store.dispatch(seoCityFetching(cityName));
    }

    return {
        hostname,
        namespacesRequired: ['search', 'brand'],
    };
};

export default City;
