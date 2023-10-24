import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useSelector } from 'react-redux';

import theme from 'themes/default';
import { DeviceState } from 'store/device/types';
import { DeviceType, ssrMatchMedia } from 'utils/ssrMatchMedia';
import { RootState } from 'store';
import { isCordova } from 'utils/platform';
import { BrandState } from 'store/brand/types';

export function usePlatform() {
    const { device, wasSSR } = useSelector<RootState, DeviceState>(
        rootState => rootState.device
    );
    const defaultDevice: DeviceType = 'desktop';

    const isServer = !process.browser;
    const wasServerRendered = process.browser && wasSSR;

    const isDesktop = useMediaQuery(theme.breakpoints.up('md'), {
        ssrMatchMedia: isCordova
            ? undefined
            : isServer
            ? ssrMatchMedia(device || defaultDevice) // desktop по умолчанию если не смогли определить девайс на сервере
            : wasServerRendered
            ? ssrMatchMedia(device || defaultDevice)
            : undefined, // последующие рендеры (router.push)
        noSsr: process.browser && !isCordova && !wasServerRendered,
        // Фикс мигания [mobile -> desktop] с десктопным экраном при `router.push()`.
        // https://github.com/mui-org/material-ui/issues/14336
        //
        // Получит значение useMediaQuery синхронно, не дожидаясь useEffect():
        // https://github.com/mui-org/material-ui/blob/a1018937b3df5aaa1c6f11bfcafc662a8249f7e2/packages/material-ui/src/useMediaQuery/useMediaQuery.js#L45
    });

    const { inWebView } = useSelector<RootState, BrandState>(
        rootState => rootState.brand
    );

    const isTablet = useMediaQuery(theme.breakpoints.between(768, 'md'));

    return {
        isCordova,
        isBrowser: !isCordova,
        isDesktop,
        isMobile: !isDesktop,
        inWebView,
        isTablet,
    };
}
