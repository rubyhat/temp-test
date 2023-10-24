import React, { useEffect } from 'react';
import NoSsr from '@material-ui/core/NoSsr';
import { NextPage } from 'next';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

import Layout from 'layouts/navigation';
import { Typo } from 'components/Typo/Typo';
import { useTranslation } from 'i18n';
import { usePlatform } from 'hooks/usePlatform';
import { HelpMenuList } from 'components/HelpMenuList';
import Contacts from 'pages/contacts';
import { CountryState } from 'store/country/types';
import { RootState } from 'store';
import { version } from 'package.json';
import { useSAAS } from 'hooks/useSAAS';
import { carbusLink } from 'utils/carbusPartnerLink';
import { carriersAmocrmLink } from 'utils/carriersAmocrmLink';
import { footerText } from 'utils/footerText';
import { HelpBanner } from 'components/HelpBanner';
import { PolicyState } from 'store/saasPolicyInfo/types';

const useStyles = makeStyles(
    (theme: Theme) => ({
        /* Styles applied to the root element. */
        root: {},
        /* Styles applied to the container `div` element. */
        container: {
            padding: 16,
        },
        /* Styles applied to the footer `div` element. */
        footer: {
            marginTop: theme.spacing(2),
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
        },
        developedBy: {
            '& a': {
                color: 'unset',
            },
        },
        company: {
            marginBottom: 4,
        },
    }),
    { name: 'Help' }
);

type Props = {};

const Help: NextPage<Props> = props => {
    const classes = useStyles();
    const { t } = useTranslation();
    const { isMobile, isCordova } = usePlatform();
    const { country } = useSelector<RootState, CountryState>(
        rootState => rootState.country
    );
    const { link: policyLink, isActive: isPolicyActive } = useSelector<
        RootState,
        PolicyState
    >(rootState => rootState.policy);

    const { isAtlas, meta, isCompas } = useSAAS();
    const isHelpBannerActive = isAtlas;

    const partnerPage = {
        label: t('partners'),
        pathname: '/partners',
    };
    let pages = [
        {
            label: t('contacts'),
            pathname: '/contacts',
        },
    ];
    enum Links {
        Partners = 'https://atlasbus.by/partners',
        Help = 'https://atlasbus.by/help',
    }
    if (country === 'BY' && isAtlas) {
        pages.splice(1, 0, partnerPage);
    }
    if (meta.termsIframeURL[country]) {
        pages.push({ label: t('termsOfUse'), pathname: '/terms' });
    }
    if (isPolicyActive && policyLink) {
        pages.push({ label: t('termsOfPrivacy'), pathname: '/privacy' });
    }
    if (meta.driversIframeURL) {
        pages.push({
            label: t('forDrivers'),
            pathname: '/drivers',
        });
    }
    if (isAtlas) {
        pages.push({
            label: t('forCarriers'),
            pathname: carriersAmocrmLink,
        });
    }

    const companyDescription = t(`companyDescription${country}`, {
        defaultValue: '',
    }).replace(
        `"/partners"`,
        `"${Links.Partners}" target="_blank" rel="noopener noreferrer"`
    );
    // Scroll fix
    useEffect(() => {
        document.body.style.overflow = 'auto';
    }, []);

    if (isMobile || isCordova) {
        return (
            <Layout>
                <div className={classes.root}>
                    <div className={classes.container}>
                        <HelpMenuList items={pages} />
                        {isHelpBannerActive && <HelpBanner />}
                    </div>

                    <div className={classes.footer}>
                        {isAtlas ? (
                            <Typo
                                variant="caption"
                                color="textSecondary"
                                className={classes.company}
                            >
                                {isAtlas ? (
                                    <a
                                        href={Links.Help}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {footerText(t(`companyName${country}`))}
                                    </a>
                                ) : (
                                    <span>
                                        {footerText(t(`companyName${country}`))}
                                    </span>
                                )}

                                {companyDescription ? (
                                    <span>
                                        &nbsp;
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: companyDescription.replace(
                                                    /\n/g,
                                                    '<br/>'
                                                ),
                                            }}
                                        />
                                        .
                                    </span>
                                ) : null}
                            </Typo>
                        ) : null}
                        <Typo variant="caption" color="textSecondary">
                            {t('appVersion')}: {version}
                        </Typo>
                        {!isCompas && (
                            <NoSsr>
                                <Typo
                                    variant="caption"
                                    color="textSecondary"
                                    className={classes.developedBy}
                                >
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: t('developedBy', {
                                                platform: carbusLink,
                                            }),
                                        }}
                                    />
                                </Typo>
                            </NoSsr>
                        )}
                    </div>
                </div>
            </Layout>
        );
    } else {
        return <Contacts />;
    }
};

Help.getInitialProps = async () => {
    return {
        namespacesRequired: ['auth', 'brand'],
    };
};

export default Help;
