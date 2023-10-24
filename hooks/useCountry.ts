import { useSelector } from 'react-redux';

import { RootState } from 'store';
import { CountryState } from 'store/country/types';

export function useCountry(): CountryState {
    const { country } = useSelector<RootState, CountryState>(
        rootState => rootState.country
    );

    return {
        country,
    };
}
