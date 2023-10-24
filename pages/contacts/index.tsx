import React from 'react';
import { useSelector } from 'react-redux';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useTranslation } from 'i18n';
import { makeStyles, Theme } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import clsx from 'clsx';

import Layout from 'layouts/navigation';
import { AppBar } from 'components/AppBar';
import { RootState } from 'store';
import { CountryState } from 'store/country/types';
import { List } from 'components/ui/List/List';
import { Button } from 'components/ui/Button/Button';
import { CountryCode } from 'utils/country';
import { ContactPhoneList } from 'components/ContactPhoneList';
import { Desktop } from 'layouts/desktop';
import { DesktopHeading } from 'components/DesktopHeading';
import { HelpMenuCard } from 'components/HelpMenuCard';
import { usePlatform } from 'hooks/usePlatform';
import Head from 'next/head';
import { useSAAS } from 'hooks/useSAAS';
import { formatPhone } from 'utils/phone';
import { HelpBanner } from 'components/HelpBanner';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {},
        /* Styles applied to the container `div` element. */
        container: {
            marginTop: 16,
            marginBottom: 16,
        },
        marginTop: {
            marginTop: theme.spacing(2),
        },
        list: {
            backgroundColor: '#FFF',
            marginBottom: theme.spacing(2),
            borderRadius: 'inherit',
        },
        desktopList: {
            marginBottom: 0,
        },
        desktopContactsPhoneList: {
            flexGrow: 1,
        },
        desktopCard: {
            backgroundColor: '#FFF',
            borderRadius: theme.shape.borderRadius,
            boxShadow: theme.atlas.shadows.bottom,
            display: 'flex',
            justifyContent: 'space-between',
            padding: theme.spacing(2),
            '& ~ &': {
                marginTop: theme.spacing(2),
            },
        },
        noPadding: {
            padding: 0,
        },
        iframe: {
            width: '100%',
            minHeight: 400,
        },
    }),
    { name: 'Contacts' }
);

type Phone = {
    phone: string;
    formattedPhone: string;
};

const Terms: NextPage = () => {
    const { t } = useTranslation();
    const classes = useStyles();
    const { isMobile, isCordova } = usePlatform();
    const { country } = useSelector<RootState, CountryState>(
        rootState => rootState.country
    );
    const { meta, partnerName, isAtlas, isMioTaxi, isCompas } = useSAAS();
    const isYandexFormActive = !isAtlas;
    const isHelpBannerActive = isAtlas;
    const phone = meta.contactPhone[country];

    const handleWriteUs = () => {
        window.open(meta.contactFormURL, '_blank');
    };
    const router = useRouter();

    const handleBack = () => router.replace('/help');

    if (isMobile || isCordova) {
        return (
            <Layout>
                <div className={classes.root}>
                    <AppBar
                        title={t('contacts')}
                        position="fixed"
                        textCenter
                        onBack={handleBack}
                    />
                    <div className={classes.container}>
                        <List className={classes.list}>
                            <ListItem>
                                {isMioTaxi ? (
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: t(
                                                `brand:requisitesMiotaxiBY`,
                                                {
                                                    context: partnerName,
                                                }
                                            ),
                                        }}
                                    />
                                ) : isCompas ? (
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: t(
                                                `brand:requisitesCompasbus${country}`,
                                                {
                                                    context: partnerName,
                                                }
                                            ),
                                        }}
                                    />
                                ) : (
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: t(
                                                `brand:requisites${country}`,
                                                {
                                                    context: partnerName,
                                                }
                                            ),
                                        }}
                                    />
                                )}
                            </ListItem>
                        </List>
                        {phone ? (
                            <ContactPhoneList
                                className={classes.list}
                                phone={phone}
                                formattedPhone={formatPhone(phone)}
                            />
                        ) : null}

                        {isYandexFormActive && !isCompas && (
                            <List className={classes.list}>
                                <ListItem>
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        fullWidth
                                        onClick={handleWriteUs}
                                    >
                                        {t('writeUs')}
                                    </Button>
                                </ListItem>
                            </List>
                        )}
                    </div>
                </div>
            </Layout>
        );
    } else {
        return (
            <Desktop>
                <Head>
                    <script src="https://yastatic.net/q/forms-frontend-ext/_/embed.js" />
                </Head>
                <DesktopHeading
                    pageTitle={t('contacts')}
                    backUrl="/"
                    breadcrumbTitle={t('backToSearch')}
                />

                <Container>
                    <Grid container spacing={2}>
                        <Grid item md={4}>
                            <HelpMenuCard />
                            {isHelpBannerActive && <HelpBanner />}
                        </Grid>

                        <Grid item md={8}>
                            <div className={classes.desktopCard}>
                                {isMioTaxi ? (
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: t(
                                                `brand:requisitesMiotaxiBY`,
                                                {
                                                    context: partnerName,
                                                }
                                            ),
                                        }}
                                    />
                                ) : isCompas ? (
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: t(
                                                `brand:requisitesCompasbus${country}`,
                                                {
                                                    context: partnerName,
                                                }
                                            ),
                                        }}
                                    />
                                ) : (
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: t(
                                                `brand:requisites${country}`,
                                                {
                                                    context: partnerName,
                                                }
                                            ),
                                        }}
                                    />
                                )}
                            </div>
                            {phone ? (
                                <div
                                    className={clsx(
                                        classes.desktopCard,
                                        classes.noPadding
                                    )}
                                >
                                    <ContactPhoneList
                                        className={clsx(
                                            classes.list,
                                            classes.desktopList,
                                            classes.desktopContactsPhoneList
                                        )}
                                        phone={phone}
                                        formattedPhone={formatPhone(phone)}
                                    />
                                </div>
                            ) : null}
                            {isYandexFormActive && meta.contactFormIframeURL ? (
                                <div className={classes.desktopCard}>
                                    <iframe
                                        title="Связаться с нами"
                                        className={classes.iframe}
                                        src={meta.contactFormIframeURL}
                                        frameBorder="0"
                                        name="ya-form-5c6fe47b6b6a501b2a7ec473"
                                    />
                                </div>
                            ) : null}
                        </Grid>
                    </Grid>
                </Container>
            </Desktop>
        );
    }
};

Terms.getInitialProps = async () => {
    return {
        namespacesRequired: ['auth', 'brand'],
    };
};

export default Terms;
