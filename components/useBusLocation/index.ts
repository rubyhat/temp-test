import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from 'store';
import {
    BUS_LOCATION_SUCCESS,
    BusLocationState,
} from 'store/bus-location/types';
import { busLocationFetching } from 'store/bus-location/actions';

type Props = {
    fetching: boolean;
    orderId: string;
};

export function useBusLocation(props: Props) {
    const { fetching, orderId } = props;
    const dispatch = useDispatch();

    const { available, willBeAvailableIn, status } = useSelector<
        RootState,
        BusLocationState
    >(rootState => rootState.busLocation);
    useEffect(() => {
        if (fetching) {
            dispatch(busLocationFetching(orderId));
        }
    }, [fetching]);

    const [willBeAvailableInDate, setWillBeAvailableInDate] = useState(
        Date.now()
    );
    useEffect(() => {
        if (status === BUS_LOCATION_SUCCESS && willBeAvailableIn) {
            const today = new Date();
            const availableDate = new Date(willBeAvailableIn * 1000);
            setWillBeAvailableInDate(
                +today >= +availableDate ? 0 : +availableDate
            );
            // setWillBeAvailableInDate(Date.now() + willBeAvailableIn * 1000);
        }
    }, [status, willBeAvailableIn]);

    return {
        available,
        willBeAvailableIn,
        willBeAvailableInDate,
        status,
    };
}
