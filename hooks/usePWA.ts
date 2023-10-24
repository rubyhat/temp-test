import { useSelector } from 'react-redux';

import { BrandState } from 'store/brand/types';
import { PWAInstallState } from 'store/pwa-install';
import { RootState } from 'store';
import { usePlatform } from 'hooks/usePlatform';

export function usePWA() {
    const { partner } = useSelector<RootState, BrandState>(
        rootState => rootState.brand
    );
    const { pwaPromptWasDeferred, status } = useSelector<
        RootState,
        PWAInstallState
    >(rootState => rootState.pwaInstall);

    const { isMobile, isDesktop } = usePlatform();

    const pwaDesktopEnabled =
        partner && partner.meta.pwaDesktopEnabled && isDesktop;
    const pwaMobileEnabled =
        partner && partner.meta.pwaMobileEnabled && isMobile;

    return {
        pwaDesktopEnabled,
        pwaMobileEnabled,
        pwaSaaSEnabled: pwaDesktopEnabled || pwaMobileEnabled,

        pwaPromptWasDeferred,
        status,
    };
}
