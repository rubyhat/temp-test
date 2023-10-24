import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import { FiltersState } from 'store/filters/types';
import { LastSearchState } from 'store/last-search/types';
import { RootState } from 'store';
import { SearchDto } from 'swagger/client';
import { SearchFormState } from 'store/search-form/types';
import { useDialogHash } from 'hooks/useDialogHash';
import { usePlatform } from 'hooks/usePlatform';
import { useSAAS } from './useSAAS';

export function useRideDetails(rides: SearchDto[]) {
    const router = useRouter();
    const { isMobile } = usePlatform();
    const { isCompasBus } = useSAAS();
    const { lastSearch } = useSelector<RootState, LastSearchState>(
        rootState => rootState.lastSearch
    );
    const { fromValue: from, toValue: to, date } = useSelector<
        RootState,
        SearchFormState
    >(rootState => rootState.searchForm);
    const { pickupValue, dropoffValue } = useSelector<RootState, FiltersState>(
        rootState => rootState.filters
    );

    const [currentRide, setCurrentRide] = useState<SearchDto | null>(null);
    const [detailsOpen, setDetailsOpen] = useDialogHash('#ride-details');

    const handleDetailsClose = () => {
        document.body.style.overflow = 'auto';
        setDetailsOpen(false);
    };
    const gotoBooking = (ride: SearchDto) => {
        if (!lastSearch) {
            console.warn('Missing store.lastSearch');
            return;
        }

        //TODO: remove after editing the backend
        const id = isCompasBus ? ride.id.replace('atlas', 'compas') : ride.id;

        const { from, to, date, passengers } = lastSearch;

        // Если d2d рейс перенаправляем на специальный флоу бронирования
        if (ride.dynamicMode && isMobile) {
            router.push({
                pathname: `/d2dbooking`,
                query: {
                    id: ride.id,
                    passengers,
                    from: from.id,
                    to: to.id,
                    date: date,
                    pickup: pickupValue || '',
                    discharge: dropoffValue || '',
                },
            });
        } else if (process.env.CORDOVA) {
            router.push({
                pathname: `/booking`,
                query: {
                    id: ride.id,
                    passengers,
                    from: from.id,
                    to: to.id,
                    date: date,
                    pickup: pickupValue || '',
                    discharge: dropoffValue || '',
                },
            });
        } else {
            router.push(
                {
                    pathname: '/booking/[id]',
                    query: {
                        passengers,
                        from: from.id,
                        to: to.id,
                        date: date,
                        pickup: pickupValue || '',
                        discharge: dropoffValue || '',
                    },
                },
                {
                    pathname: `/booking/${id}`,
                    query: {
                        passengers,
                        from: from.id,
                        to: to.id,
                        date: date,
                        pickup: pickupValue || '',
                        discharge: dropoffValue || '',
                    },
                }
            );
        }
    };
    const handleDetailsClick = (rideId: string) => {
        const ride = rides.find(ride => ride.id === rideId);

        if (ride) {
            setCurrentRide(ride);
            document.body.style.overflow = 'hidden';
            setDetailsOpen(true);
        }
    };

    return {
        currentRide,
        detailsOpen,

        handleDetailsClick,
        handleDetailsClose,
        gotoBooking,
    };
}
