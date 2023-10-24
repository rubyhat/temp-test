import { useSelector } from 'react-redux';

import { RootState } from 'store';
import { CountryState } from 'store/country/types';
import { seoPrefix } from 'utils/seoPrefix';

export function useSeoPrefix() {
    const { country } = useSelector<RootState, CountryState>(
        rootState => rootState.country
    );

    return {
        seoPrefix: seoPrefix[country],
    };
}
