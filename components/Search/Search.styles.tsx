import { makeStyles, Theme } from '@material-ui/core/styles';
import { searchFormHintsHeight } from 'components/SearchFormHints';
import { nativeAppTopperHeight } from 'components/serp/NativeAppTopper';
import { AtlasTheme } from 'typings/atlas-theme';

export const useStyles = makeStyles(
    // @ts-ignore
    (theme: Theme & AtlasTheme) => ({
        root: {
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
        },
        container: {
            marginTop: theme.spacing(4),
            flex: 1,
        },
        containerHidden: {
            display: 'none',
        },
        layoutMinHeight: {
            minHeight:
                'calc(200vh - 56px - 56px - env(safe-area-inset-bottom))',
            fallbacks: [
                {
                    minHeight:
                        'calc(200vh - 56px - 56px - constant(safe-area-inset-bottom))',
                },
                { minHeight: '200vh' },
            ],
        },
        trip: {
            '& ~ &': {
                marginTop: theme.spacing(2),
            },
        },
        tripMioTaxi: {
            marginBottom: theme.spacing(2),
        },
        desktopPhones: {
            maxWidth: 360,
            marginLeft: 'auto',
            marginBottom: theme.spacing(2),
        },
        /* Styles applied to the `RelatedDestinations` container (touch). */
        relatedDestinations: {
            marginTop: theme.spacing(4),
        },
        /* Styles applied to the `RelatedDestinations` container (desktop). */
        relatedDestinationsDesktop: {
            marginTop: theme.spacing(4),
        },
        /* Styles applied to the `FeaturedDestinations`. */
        featuredDestinations: {
            marginTop: theme.spacing(1),

            '& ~ &': {
                marginTop: theme.spacing(5),
            },
        },
        breadcrumbLi: {
            color: theme.palette.text.primary,

            '& a': {
                textDecoration: 'none',
                color: theme.palette.text.secondary,

                '&:hover': {
                    textDecoration: 'underline',
                },
            },
        },
        breadcrumbsDesktop: {
            padding: theme.spacing(1, 2),
            backgroundColor: '#FFF',
            boxShadow: theme.atlas.shadows.bottom,
            marginTop: theme.spacing(2),
        },
        breadcrumbsMobile: {
            padding: theme.spacing(1, 2),
            backgroundColor: theme.atlas.palette.background.disabled,
            boxShadow: theme.atlas.shadows.bottom,
            marginTop: theme.spacing(2),
        },
        /* Styles applied to the `SearchFormHints` and `SearchFormFastDates` container (desktop). */
        searchFormHintsAndDatesContainer: {
            marginTop: theme.spacing(1),
        },
        /* Занять высоту пока подгружаются `SearchFormHints` чтобы поисковая форма не дергалась */
        searchFormHintsPlaceholder: {
            height: searchFormHintsHeight + theme.spacing(1), // +searchFormHints.marginTop
        },
        /* Styles applied to the `SurgeCard` component. */
        surgeCard: {
            marginBottom: theme.spacing(2),
        },
        /* Styles applied to the `BeOurPartnerCard` container (mobile). */
        beOurPartnerCardContainer: {
            marginTop: theme.spacing(4),
        },
        /* Styles applied to the `BeOurPartnerCard` container (desktop). */
        beOurPartnerCardContainerDesktop: {
            marginTop: theme.spacing(4),
        },
        /* Styles applied to the `BeOurPartnerCard` container (cordova). */
        beOurPartnerCardCordova: {
            marginTop: theme.spacing(4),
        },
        /* Styles applied to the `D2DShuttleBanner` (mobile). */
        d2dShuttleBanner: {
            marginBottom: theme.spacing(2),
        },
        /* Styles applied to the `DownloadAppPaper` component (desktop). */
        DownloadAppPaper: {
            marginTop: theme.spacing(5),
        },
        /* Styles applied to the `DownloadAppMobile` component (mobile). */
        DownloadAppMobile: {
            marginTop: theme.spacing(5),
        },
        /* Styles applied to the `NativeAppTopper` component (mobile). */
        NativeAppTopper: {},
        /* Pseudo-class applied to the AppBar component if NativeAppTopper is visible. */
        searchBarNativeAppTopperVisible: {
            ...theme.atlas.appBar.paddingTop(nativeAppTopperHeight),
        },
        banner_web: {
            width: '100%',
            marginTop: theme.spacing(1),
        },
        banner_mobile: {
            width: '100%',
            borderRadius: '8px',
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(-0.5),
        },
        shuttle_banner_web: {
            width: '100%',
            borderRadius: '3px',
            marginBottom: theme.spacing(1.5),
        },
        shuttle_banner_mobile: {
            width: '100%',
            borderRadius: '8px',
            marginTop: theme.spacing(-2),
            marginBottom: theme.spacing(1.5),
        },
        attention_banner_web: {
            width: '97.5%',
            marginLeft: theme.spacing(2),
        },
        attention_banner_mobile: {
            width: '100%',
            marginTop: theme.spacing(-2),
            marginBottom: theme.spacing(1.5),
        },
    }),
    { name: 'Search' }
);
