import React, { FC } from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Link from 'next/link';
import NoSsr from '@material-ui/core/NoSsr';
import clsx from 'clsx';
import { useSelector } from 'react-redux';

import { useStyles } from './styles';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { usePlatform } from 'hooks/usePlatform';
import { useTranslation } from 'i18n';
import { useSAAS } from 'hooks/useSAAS';
import { RootState } from 'store';
import { CountryState } from 'store/country/types';
import { carbusLink } from 'utils/carbusPartnerLink';
import { footerText } from 'utils/footerText';
import { useLinks } from './hook';
import { FooterMenu } from './menu/Menu';
import { Typography } from '@material-ui/core';
import { SeoState } from '../../store/seo/types';
import { useCallCenterOrCarrierPhones } from '../../hooks/useCallCenterOrCarrierPhones';
import { PhonesList } from '../Phones';

type Page = {
    title: string;
    link: string;
    external?: boolean;
};

export const Footer: FC = () => {
    const classes = useStyles();
    const { t } = useTranslation();
    const { country } = useSelector<RootState, CountryState>(
        rootState => rootState.country
    );
    const { isMobile, isCordova } = usePlatform();
    const { isAtlas, meta, isMioTaxi, isCompas } = useSAAS();
    let isRu = country === 'BY' || country === 'RU';
    const {
        includeByDomain,
        menu,
        socialLinks,
        appLinks,
        isResidentHTP,
    } = useLinks();
    const { phones: carrierPhones } = useSelector<RootState, SeoState>(
        rootState => rootState.seo
    );
    const phones = useCallCenterOrCarrierPhones(carrierPhones);

    // Footer
    const pages: Page[] = [];
    if (meta.driversURL) {
        pages.push({
            title: t('forDrivers'),
            link: isMobile || isCordova ? meta.driversURL : '/drivers',
            external: isMobile || isCordova,
        });
    }
    if (meta.termsIframeURL[country]) {
        pages.push({
            title: t('termsOfUse'),
            link: '/terms',
        });
    }

    const companyDescription = t(`companyDescription${country}`, {
        defaultValue: '',
    });

    if (isRu && isAtlas) {
        return (
            <footer className={classes.footer}>
                <Container>
                    <Grid
                        container
                        direction={isMobile ? 'column' : 'row'}
                        className={classes.container}
                        wrap="nowrap"
                    >
                        <Grid item md={9}>
                            <FooterMenu menu={menu} isMobile={isMobile} />
                        </Grid>
                        <Grid item md={3}>
                            <div>
                                <Typography className={classes.iconsTitle}>
                                    {t('common:socialNetworks')}
                                </Typography>
                                <div className={classes.iconsRow}>
                                    {socialLinks.map(({ icon, href }) => (
                                        <Link key={href} href={href}>
                                            <a
                                                href={href}
                                                className={classes.icon}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <img src={icon} alt={icon} />
                                            </a>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className={classes.mobileApps}>
                                <Typography className={classes.iconsTitle}>
                                    {t('common:mobileApp')}
                                </Typography>
                                <div className={classes.iconsRow}>
                                    {appLinks.map(({ icon, href }) => (
                                        <Link key={href} href={href}>
                                            <a
                                                href={href}
                                                className={classes.icon}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <img src={icon} alt={icon} />
                                            </a>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </Grid>
                    </Grid>

                    <Grid
                        className={classes.bottomRow}
                        container
                        wrap="nowrap"
                        direction={isMobile ? 'column-reverse' : 'row'}
                    >
                        <Grid item md={includeByDomain ? 6 : 9}>
                            <div className={classes.type}>
                                {isAtlas ? (
                                    <span className={classes.description}>
                                        <a
                                            href="https://atlasbus.by/help"
                                            className={classes.menuItem}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {footerText(
                                                t(`companyName${country}`)
                                            )}
                                        </a>
                                        {companyDescription ? (
                                            <>
                                                &nbsp;
                                                <span
                                                    className={
                                                        classes.description
                                                    }
                                                    dangerouslySetInnerHTML={{
                                                        __html: companyDescription.replace(
                                                            /\n/g,
                                                            '<br/>'
                                                        ),
                                                    }}
                                                />
                                            </>
                                        ) : null}
                                        .&nbsp;
                                    </span>
                                ) : null}

                                {!isMioTaxi ? (
                                    <span
                                        className={classes.description}
                                        dangerouslySetInnerHTML={{
                                            __html: t('developedBy', {
                                                platform: carbusLink,
                                            }),
                                        }}
                                    />
                                ) : (
                                    <span>ООО "ПРОШАТТЛ"</span>
                                )}
                            </div>
                        </Grid>

                        {includeByDomain && isResidentHTP && (
                            <Grid item md={3}>
                                <Typography className={classes.hiTitle}>
                                    {t('residentHTP')}
                                </Typography>
                                <Link href="https://b2b.atlasbus.ru/pvt">
                                    <a
                                        href="https://b2b.atlasbus.ru/pvt"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <img
                                            className={classes.hiIcon}
                                            src={'/static/hi.svg'}
                                            alt={'/static/hi.svg'}
                                        />
                                    </a>
                                </Link>
                            </Grid>
                        )}

                        <Grid item md={3}>
                            {phones && phones.length ? (
                                <PhonesList
                                    phones={phones}
                                    className={classes.desktopPhones}
                                />
                            ) : null}
                            <LanguageSwitcher />
                        </Grid>
                    </Grid>
                </Container>
            </footer>
        );
    } else {
        return (
            <div className={classes.root}>
                <Container className={classes.container}>
                    <Grid container spacing={1}>
                        <Grid container item md={7}>
                            <NoSsr>
                                <div
                                    className={clsx(
                                        classes.item,
                                        classes.copyright
                                    )}
                                >
                                    {isAtlas ? (
                                        <span>
                                            <a href="/help">
                                                {footerText(
                                                    t(`companyName${country}`)
                                                )}
                                            </a>
                                            {companyDescription ? (
                                                <>
                                                    &nbsp;
                                                    <span
                                                        dangerouslySetInnerHTML={{
                                                            __html: companyDescription.replace(
                                                                /\n/g,
                                                                '<br/>'
                                                            ),
                                                        }}
                                                    />
                                                </>
                                            ) : null}
                                            .&nbsp;
                                        </span>
                                    ) : null}
                                    {isCompas ? (
                                        <span>
                                            <a href="/help">
                                                {footerText(
                                                    t(`companyNameCompas`)
                                                )}
                                            </a>
                                            &nbsp;
                                            <span>
                                                {t(`companyDescriptionCompas`)}
                                            </span>
                                        </span>
                                    ) : null}

                                    {!isMioTaxi && !isCompas ? (
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: t('developedBy', {
                                                    platform: carbusLink,
                                                }),
                                            }}
                                        />
                                    ) : null}
                                    {isMioTaxi && <span>ООО "ПРОШАТТЛ"</span>}
                                </div>
                            </NoSsr>
                        </Grid>

                        <Grid container item md={5}>
                            {pages.map(page =>
                                page.external ? (
                                    <a
                                        href={page.link}
                                        key={page.link}
                                        target="_blank"
                                        className={clsx(
                                            classes.item,
                                            classes.link
                                        )}
                                    >
                                        {page.title}
                                    </a>
                                ) : (
                                    <Link href={page.link} key={page.link}>
                                        <a
                                            className={clsx(
                                                classes.item,
                                                classes.link
                                            )}
                                        >
                                            {page.title}
                                        </a>
                                    </Link>
                                )
                            )}
                        </Grid>
                    </Grid>

                    <Grid container justify="flex-end">
                        <LanguageSwitcher />
                    </Grid>
                </Container>
            </div>
        );
    }
};
