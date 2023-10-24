import { useSelector } from 'react-redux';

import { MilesState } from 'store/miles/types';
import { RootState } from 'store';
import { countryCurrency } from 'utils/currency';
import { UserState } from 'store/user/types';
import { detectCountryByPhone } from 'utils/country';

export function useMilesBalance() {
    const {
        balance: milesBalance,
        currency: milesCurrency,
        status: milesStatus,
    } = useSelector<RootState, MilesState>(rootState => rootState.miles);
    const user = useSelector<RootState, UserState>(rootState => rootState.user);

    const country = detectCountryByPhone(user.phoneNumber) || 'BY';
    const currency = countryCurrency[country];
    const milesEquivalent = milesCurrency.find(item => item.code === currency);
    const milesEquivalentBalance = milesEquivalent
        ? milesEquivalent.balance
        : 0;

    return {
        currency,
        milesBalance,
        milesEquivalentBalance,
        milesStatus,
    };
}
