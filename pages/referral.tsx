import React, { useEffect } from 'react';
import Head from 'next/head';
import { NextPage, NextPageContext } from 'next';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useRouter } from 'next/router';

import { generatePromocodeShareImage } from 'utils/referral/apiTemplateIo';
import { isServer } from 'utils/platform';
import { referralShareLink } from 'components/social/util';
import { useTranslation } from 'i18n';

const useStyles = makeStyles(
    (theme: Theme) => ({
        /* Styles applied to the root element. */
        root: {},
        content: {
            padding: theme.spacing(1),
        },
        link: {
            fontSize: theme.typography.subtitle1.fontSize,
        },
    }),
    { name: 'Referral' }
);

type Props = {
    hostname: string;
    promocode?: string;
    shareImage?: string;
};

function checkValidPromocode(promocode: string): boolean {
    return /^[a-z0-9\-]+$/i.test(promocode);
}

const Referral: NextPage<Props> = props => {
    const { hostname, promocode, shareImage } = props;
    const classes = useStyles();
    const router = useRouter();
    const { t } = useTranslation();

    const shareURL = `https://${hostname}/referral?promocode=${promocode}`;

    useEffect(() => {
        window.location.replace(referralShareLink);
    }, []);

    // Scroll fix
    useEffect(() => {
        document.body.style.overflow = 'auto';
    }, []);

    return (
        <div className={classes.root}>
            <Head>
                <title>
                    {t('referralShareOgTitle', {
                        promocode: router.query.promocode,
                    })}
                </title>

                {/* Proprietary <meta> Tags */}
                <meta
                    property="og:title"
                    content={t('referralShareOgTitle', {
                        promocode: router.query.promocode,
                    })}
                />
                <meta
                    property="og:description"
                    content={t('referralShareOgDescription', {
                        promocode: router.query.promocode,
                    })}
                />
                {shareImage ? (
                    <meta property="og:image" content={shareImage} />
                ) : null}
                <meta property="og:url" content={shareURL} />

                {/* Twitter <meta> Tags */}
                <meta
                    name="twitter:title"
                    content={t('referralShareOgTitle', {
                        promocode: router.query.promocode,
                    })}
                />
                <meta
                    name="twitter:description"
                    content={t('referralShareOgDescription', {
                        promocode: router.query.promocode,
                    })}
                />
                {shareImage ? (
                    <meta name="twitter:image" content={shareImage} />
                ) : null}
            </Head>

            <div className={classes.content}>
                <a className={classes.link} href={referralShareLink}>
                    Нажмите здесь если перенаправление не произошло
                </a>
            </div>
        </div>
    );
};

Referral.getInitialProps = async (context: NextPageContext) => {
    const { req, res, query } = context;

    let hostname = 'atlasbus.ru';
    if (req && res && !process.env.CORDOVA && !process.browser) {
        hostname =
            (req.headers['x-real-host'] as any) ||
            req.headers.host ||
            'atlasbus.ru';
    }

    // Генерация картинки с промокодом для шейринга
    const isValidPromocode = checkValidPromocode(
        (query.promocode as string) || ''
    );
    const promocode = isValidPromocode ? (query.promocode as string) : '';
    let shareImage = '';
    if (isServer && isValidPromocode) {
        try {
            const { data } = await generatePromocodeShareImage(promocode);
            shareImage = data.download_url_png;
        } catch (err) {
            console.log(err);
        }
    }

    return { namespacesRequired: [], hostname, promocode, shareImage };
};

export default Referral;
