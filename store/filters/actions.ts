import {
    FiltersActionTypes,
    FiltersSortBy,
    FiltersState,
    RESET_FILTERS,
    SET_FILTERS,
    SORTBY_FILTERS,
    UPDATE_DROPOFF_FILTER,
    UPDATE_PICKUP_FILTER,
} from './types';
import { StopsDto } from 'swagger/client';

export const setFilters = (
    payload: Partial<FiltersState>
): FiltersActionTypes => ({
    type: SET_FILTERS,
    payload,
});

export const updatePickupFilter = (
    stopId: StopsDto['id'] | null
): FiltersActionTypes => ({
    type: UPDATE_PICKUP_FILTER,
    payload: stopId,
});

export const updateDropoffFilter = (
    stopId: StopsDto['id'] | null
): FiltersActionTypes => ({
    type: UPDATE_DROPOFF_FILTER,
    payload: stopId,
});

export const sortByFilters = (sortBy: FiltersSortBy): FiltersActionTypes => ({
    type: SORTBY_FILTERS,
    payload: sortBy,
});

export const resetFilters = (): FiltersActionTypes => ({
    type: RESET_FILTERS,
});
