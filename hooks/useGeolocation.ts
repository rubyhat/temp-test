import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { GeolocationState, requestGeolocation } from 'store/geolocation';
import { RootState } from 'store';

export function useGeolocation() {
    const dispatch = useDispatch();
    const { position, error, status } = useSelector<
        RootState,
        GeolocationState
    >(rootState => rootState.geolocation);

    useEffect(() => {
        dispatch(requestGeolocation());
    }, []);

    return {
        position,
        error,
        status,
    };
}
