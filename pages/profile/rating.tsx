import React, { useEffect } from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { NextPage } from 'next';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import { AppBar } from 'components/AppBar';
import { BrandState } from 'store/brand/types';
import { Desktop } from 'layouts/desktop';
import { DesktopHeading } from 'components/DesktopHeading';
import { KarmaInfo } from 'components/KarmaInfo';
import { KarmaInfoCard } from 'components/KarmaInfoCard';
import { ProfileMenuCard } from 'components/ProfileMenuCard';
import { RootState } from 'store';
import { karmaFetching } from 'store/karma/actions';
import { usePlatform } from 'hooks/usePlatform';
import { useTranslation } from 'i18n';
import { isCordova, isServer } from 'utils/platform';
import NotFound from 'pages/not-found';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {},
        /* Styles applied to the container `div` element. */
        container: {
            ...theme.atlas.appBar.marginTop(16), // AppBar height + 16,
            marginBottom: 16,
        },
        /* Styles applied to the content `div` element. */
        content: {
            marginTop: theme.spacing(3),
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(2),
            color: theme.atlas.palette.text.minor,
            fontSize: theme.atlas.typography.body1.fontSize,
        },
        /* Styles applied to the content `div` element (desktop). */
        desktopContent: {
            marginTop: theme.spacing(3),
            color: theme.atlas.palette.text.minor,
            fontSize: theme.atlas.typography.body1.fontSize,
            '& > *:first-child': {
                marginTop: 0,
            },
        },
    }),
    { name: 'Rating' }
);

type Props = {
    statusCode?: number;
};

const Rating: NextPage<Props> = props => {
    const { statusCode } = props;
    const classes = useStyles();
    const { t } = useTranslation();
    const router = useRouter();
    const dispatch = useDispatch();
    const { isMobile, isCordova } = usePlatform();
    const { brandName } = useSelector<RootState, BrandState>(
        rootState => rootState.brand
    );

    const handleBack = () => router.back();

    useEffect(() => {
        dispatch(karmaFetching());
    }, []);

    // Scroll fix
    useEffect(() => {
        document.body.style.overflow = 'auto';
    }, []);

    if (statusCode === 404) {
        return <NotFound />;
    }

    if (isMobile || isCordova) {
        return (
            <div className={classes.root}>
                <AppBar
                    title={t('profile:myKarma')}
                    textCenter
                    position="fixed"
                    onBack={handleBack}
                />

                <div className={classes.container}>
                    <KarmaInfo />

                    <div
                        className={classes.content}
                        dangerouslySetInnerHTML={{
                            __html: t('brand:karmaAbout', {
                                context: brandName,
                            }),
                        }}
                    />
                </div>
            </div>
        );
    } else {
        return (
            <Desktop>
                <DesktopHeading
                    pageTitle={t('profile:myKarma')}
                    backUrl="/"
                    breadcrumbTitle={t('backToSearch')}
                />

                <Container>
                    <Grid container spacing={2}>
                        <Grid item md={4}>
                            <ProfileMenuCard />
                        </Grid>

                        <Grid item md={8}>
                            <KarmaInfoCard />

                            <div
                                className={classes.desktopContent}
                                dangerouslySetInnerHTML={{
                                    __html: t('brand:karmaAbout', {
                                        context: brandName,
                                    }),
                                }}
                            />
                        </Grid>
                    </Grid>
                </Container>
            </Desktop>
        );
    }
};

Rating.getInitialProps = async ctx => {
    const { store, res } = ctx;

    // Вернуть 404 для SaaS партнеров у которых
    // которые не поддерживают "Рейтинг"
    let statusCode = 200;
    if (isServer && !isCordova && res) {
        const { partner } = store.getState().brand;
        const isRatingDisabled =
            partner && partner.meta && !partner.meta.ratingDisabled;

        if (!isRatingDisabled) {
            statusCode = 404;
            res.statusCode = 404;
        }
    }

    return {
        namespacesRequired: ['profile', 'brand'],
        statusCode,
    };
};

export default Rating;
