import React, { FC, ReactNode } from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

import { MobileBottomNavigation } from 'components/MobileBottomNavigation';
import { useTranslation } from 'i18n';
import { AppBar } from 'components/AppBar';
import { usePlatform } from 'hooks/usePlatform';
import { useMobileRoutes } from 'hooks/useMobileRoutes';
import { PhonesDialogActivator } from 'components/Phones';
import { RootState } from 'store';
import { SeoState } from 'store/seo/types';
import { nativeAppTopperHeight } from 'components/serp/NativeAppTopper';
import { useCallCenterOrCarrierPhones } from 'hooks/useCallCenterOrCarrierPhones';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        root: {
            display: 'flex',
            flexDirection: 'column',
        },
        /* Pseudo-class applied to the root component if `fullHeight={true}` */
        fullHeight: {
            height: '100vh',
        },
        /* Pseudo-class applied to the AppBar component if displayed */
        rootAppBar: {
            ...theme.atlas.appBar.paddingTop(56),
        },
        /* Pseudo-class applied to the root component if `nativeAppTopperVisible={true}` */
        rootNativeAppTopperVisible: {
            // AppBar height + NativeAppTopper height
            ...theme.atlas.appBar.paddingTop(56 + nativeAppTopperHeight),
        },
        /* Pseudo-class applied to the MobileBottomNavigation component if displayed */
        rootBottomNavigation: {
            ...theme.atlas.bottomBar.paddingBottom(56),
        },
        /* Styles applied to the AppBar component if `nativeAppTopperVisible={true}` */
        appBarNativeAppTopperVisible: {
            ...theme.atlas.appBar.paddingTop(nativeAppTopperHeight),
        },
    }),
    { name: 'Layout' }
);

type Props = {
    children: ReactNode;
    className?: string;
    fullHeight?: boolean;
    nativeAppTopperVisible?: boolean;
};

const Layout: FC<Props> = props => {
    const { children, className, fullHeight, nativeAppTopperVisible } = props;
    const router = useRouter();
    const classes = useStyles();
    const { t } = useTranslation();
    const { isMobile, isCordova, inWebView } = usePlatform();
    const routes = useMobileRoutes();
    const { phones: carrierPhones } = useSelector<RootState, SeoState>(
        rootState => rootState.seo
    );
    const phones = useCallCenterOrCarrierPhones(carrierPhones);

    const handleOnChange = (pathname: string) => router.replace(pathname);

    const appBarTitle = {
        '/': '',
        '/search': '',
        '/help': t('help'),
        '/orders': t('trips'),
        '/profile': t('profile'),
        '/login': t('loginOrSignUp'),
        '/debugging': t('debugging'),
    };
    const isMobileOnly = isMobile && !isCordova && !inWebView;
    const isSearch = router.pathname === '/search';
    const isHome = router.pathname === '/';
    const isSeo = router.pathname === '/seo';
    const showAppBar = !(
        (isCordova || inWebView) &&
        (isSearch || isHome || isSeo)
    );
    const startIcon = router.pathname === '/login' ? 'close' : 'back';

    return (
        <div
            className={clsx(classes.root, className, {
                [classes.rootAppBar]: showAppBar,
                [classes.rootBottomNavigation]: isCordova || inWebView,
                [classes.fullHeight]: fullHeight,
                [classes.rootNativeAppTopperVisible]: nativeAppTopperVisible,
            })}
        >
            {showAppBar ? (
                <AppBar
                    className={clsx({
                        [classes.appBarNativeAppTopperVisible]: nativeAppTopperVisible,
                    })}
                    title={
                        appBarTitle[router.pathname as keyof typeof appBarTitle]
                    }
                    textCenter
                    position="fixed"
                    disableBackIcon
                    showBurger={isMobileOnly}
                    showLogo={true}
                    startIcon={startIcon}
                    endIcon={
                        phones.length ? (
                            <PhonesDialogActivator phones={phones} />
                        ) : null
                    }
                />
            ) : null}

            {children}

            {isCordova || inWebView ? (
                <MobileBottomNavigation
                    value={router.pathname}
                    onChange={handleOnChange}
                    items={routes}
                />
            ) : null}
        </div>
    );
};

export default Layout;
