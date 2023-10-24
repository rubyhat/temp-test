import { StopsDto } from 'swagger/client';

export type FiltersSortBy = 'time' | 'price';

export type FiltersState = {
    pickupInputValue: string;
    pickupValue: StopsDto['id'] | null;
    pickupMapValue: StopsDto['id'] | null;
    dropoffInputValue: string;
    dropoffValue: StopsDto['id'] | null;
    dropoffMapValue: StopsDto['id'] | null;
    departureTime: 'night' | 'morning' | 'afternoon' | 'evening' | null;
    sortBy: FiltersSortBy | null;
};

export const SET_FILTERS = 'SET_FILTERS';
export const UPDATE_PICKUP_FILTER = 'UPDATE_PICKUP_FILTER';
export const UPDATE_DROPOFF_FILTER = 'UPDATE_DROPOFF_FILTER';
export const SORTBY_FILTERS = 'SORTBY_FILTERS';
export const RESET_FILTERS = 'RESET_FILTERS';

type SetFiltersAction = {
    type: typeof SET_FILTERS;
    payload: Partial<FiltersState>;
};

type UpdatePickupFilterAction = {
    type: typeof UPDATE_PICKUP_FILTER;
    payload: StopsDto['id'] | null;
};

type UpdateDropoffFilterAction = {
    type: typeof UPDATE_DROPOFF_FILTER;
    payload: StopsDto['id'] | null;
};

type SortByFiltersAction = {
    type: typeof SORTBY_FILTERS;
    payload: FiltersSortBy;
};

type ResetFiltersAction = {
    type: typeof RESET_FILTERS;
};

export type FiltersActionTypes =
    | SetFiltersAction
    | UpdatePickupFilterAction
    | UpdateDropoffFilterAction
    | SortByFiltersAction
    | ResetFiltersAction;
