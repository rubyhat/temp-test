import React, { FC } from 'react';
import { useSelector } from 'react-redux';

import { DesktopPartnersTable } from './DesktopPartnersTable';
import { MobilePartnersTable } from './MobilePartnersTable';
import { PartnersState } from 'store/partners/types';
import { RootState } from 'store';
import { usePlatform } from 'hooks/usePlatform';

export const PartnersTable: FC = () => {
    const { isCordova, isMobile } = usePlatform();
    const { partners } = useSelector<RootState, PartnersState>(
        rootState => rootState.partners
    );

    if (isCordova || isMobile) {
        return <MobilePartnersTable partners={partners} />;
    } else {
        return <DesktopPartnersTable partners={partners} />;
    }
};
