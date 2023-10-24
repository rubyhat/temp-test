import React, { FC } from 'react';
import Link from 'next/link';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import LogoSVG from './assets/logo.svg';
import LogoDarkSVG from './assets/logo-dark.svg';
import LogoRUSVG from './assets/logo_RU.svg';
import LogoDarkRUSVG from './assets/logo-dark_RU.svg';
import { useTranslation } from 'i18n';
import { useSAAS } from 'hooks/useSAAS';
import { publicPath } from 'utils/publicPath';

const useStyles = makeStyles(
    {
        root: {
            display: 'block',
            lineHeight: 0,

            '& > svg': {
                width: 'auto',
            },
        },
        /* Псевдо-класс мини-логотипа для применения в AppBar */
        logoMini: {
            // лого Атласа
            '& > svg': {
                maxHeight: 40,
            },
            // лого SaaS партнеров
            '& > img': {
                maxHeight: 32,
            },
        },
        img: {
            // для картинок в теге <img/> (SAAS)
            maxWidth: 208,
        },
    },
    { name: 'Logo' }
);

type Props = {
    dark?: boolean;
    mini?: boolean;
    className?: string;
};

const logos = {
    LogoSVG: LogoSVG,
    LogoDarkSVG: LogoDarkSVG,
    LogoRUSVG: LogoRUSVG,
    LogoDarkRUSVG: LogoDarkRUSVG,
};

export const Logo: FC<Props> = props => {
    const { dark, className, mini } = props;
    const classes = useStyles();
    const { i18n } = useTranslation();
    const { isAtlas, partner } = useSAAS();

    const language = i18n.language && i18n.language.substr(0, 2);
    const locale = language === 'ru' ? 'RU' : '';
    const variant = dark ? 'Dark' : '';
    const logoName = `Logo${variant}${locale}SVG` as keyof typeof logos;
    const Logo = logos[logoName];

    if (partner && !isAtlas) {
        const partnerLogoURL = dark
            ? partner.meta.logoDarkURL ||
              publicPath('/static/logo/logo-dark.png')
            : partner.meta.logoURL || publicPath('/static/logo/logo.png');

        return (
            <Link href="/">
                <a
                    className={clsx(classes.root, {
                        [classes.logoMini]: mini,
                    })}
                >
                    <img src={partnerLogoURL} className={classes.img} />
                </a>
            </Link>
        );
    }

    return (
        <Link href="/">
            <a
                className={clsx(classes.root, className, {
                    [classes.logoMini]: mini,
                })}
            >
                <Logo key={logoName} />
            </a>
        </Link>
    );
};
