import React, { ReactNode } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useSelector } from 'react-redux';

import { Logo } from 'components/Logo/Logo';
import { useTranslation } from 'i18n';
import { isCordova } from 'utils/platform';
import clsx from 'clsx';
import { RootState } from 'store';
import { BrandState } from 'store/brand/types';
import { AtlasTheme } from 'typings/atlas-theme';

const backgroundImage = require('./jay-wennington-IAvRp28YMOE-unsplash.jpg');

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        root: {
            background: theme.atlas.palette.background.brandMinor,
            backgroundImage: `url("${backgroundImage}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            ...theme.atlas.appBar.paddingTop(theme.spacing(4)),
            paddingBottom: theme.spacing(4),
            minHeight: 'calc(100vh - 56px)',
            height: 1,
            [theme.breakpoints.up('md')]: {
                minHeight: isCordova ? undefined : 400,
            },
        },
        compact: {
            height: 'auto',
            minHeight: 'auto',
        },
        container: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
        },
        item: {
            textAlign: 'center',
            [theme.breakpoints.up('md')]: {
                textAlign: isCordova ? undefined : 'left',
            },
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            display: 'flex',
            marginBottom: theme.spacing(4),
        },
        title: {
            color: theme.atlas.palette.textInv.base,
        },
        subtitle: {
            marginTop: theme.spacing(2),
            color: theme.atlas.palette.textInv.minor,
        },
    }),
    { name: 'Header' }
);

type Props = {
    children: ReactNode;
    compact?: boolean;
};

export const Header = React.forwardRef<HTMLElement, Props>((props, ref) => {
    const { children, compact = false } = props;
    const classes = useStyles();
    const { t } = useTranslation();

    const { partner } = useSelector<RootState, BrandState>(
        rootState => rootState.brand
    );

    return (
        <header
            className={clsx(classes.root, compact && classes.compact)}
            style={{
                backgroundImage:
                    partner && partner.meta && partner.meta.backgroundURL
                        ? `url(${partner.meta.backgroundURL})`
                        : undefined,
            }}
            ref={ref}
        >
            <Container className={classes.container}>
                <div className={classes.item}>
                    <Logo />
                </div>
                {/* <div className={classes.item}>
                    <div className={classes.title}>
                        <Typo weight="bold" variant="promo2">
                            {t('search:headerTitle')}
                        </Typo>
                    </div>
                    <div className={classes.subtitle}>
                        <Typo weight="bold" variant="title">
                            {t('search:headerSubtitle')}
                        </Typo>
                    </div>
                </div> */}
                <div>{children}</div>
                {!compact && <div className={classes.item} />}
            </Container>
        </header>
    );
});
