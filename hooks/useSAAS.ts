import { useSelector } from 'react-redux';

import { RootState } from 'store';
import { BrandState } from 'store/brand/types';
import { atlasMetaConfig } from 'saas/atlasConfig';

export function useSAAS() {
    const { brandName, partners, partner } = useSelector<RootState, BrandState>(
        rootState => rootState.brand
    );

    const isAtlas = brandName === 'atlas';
    const isMioTaxi = brandName === 'miotaxi';
    const isCompasBus = brandName === 'compasbus';
    const isCompas = brandName === 'compasbus';

    const configMeta = {
        ...atlasMetaConfig,
        ...(partner && partner.meta),
    };

    return {
        partnerName: brandName,
        partners,
        partner,
        isAtlas,
        isMioTaxi,
        isCompasBus,
        isCompas,
        meta: configMeta,
        cordova: (partner && partner.cordova) || {},
    };
}
