import { CalendarDto, SearchDto, SearchResultDto } from 'swagger/client';

export type SearchRidesState = {
    rides: SearchDto[];
    calendar: CalendarDto[];
    status: SearchRidesStatuses | null;
    error: Error | null;
    pollingCount: number;
    /**
     * Сервер установит `true` если не смог получить статус 200
     * с первого раза. Поллинг будет продолжен на клиенте.
     */
    continuePollingOnClient: boolean;
    withScrolling: boolean;
    /**
     * Дебагинг при поиске ближайшей даты с рейсами.
     */
    debugNearDayWithRides: any;
};

export const FETCHING_RIDES = 'FETCHING_RIDES';
export const FETCHING_RIDES_BROWSER = 'FETCHING_RIDES_BROWSER';
export const POLLING_RIDES = 'POLLING_RIDES';
export const SUCCESS_RIDES = 'SUCCESS_RIDES';
export const ERROR_RIDES = 'ERROR_RIDES';
export type SearchRidesStatuses =
    | typeof FETCHING_RIDES
    | typeof POLLING_RIDES
    | typeof SUCCESS_RIDES
    | typeof ERROR_RIDES
    | typeof FETCHING_RIDES_BROWSER;

export const SET_CONTINUE_POLLING_RIDES = 'SET_CONTINUE_POLLING_RIDES';
export const DEBUG_NEAR_DAY_WITH_RIDES = 'DEBUG_NEAR_DAY_WITH_RIDES';

type FetchingRidesBrowser = {
    type: typeof FETCHING_RIDES_BROWSER;
};

export type FetchingRidesAction = {
    type: typeof FETCHING_RIDES;
    payload: {
        withScrolling: boolean;
        withDateInQuery: boolean;
    };
};

type DebugNearDayWithRides = {
    type: typeof DEBUG_NEAR_DAY_WITH_RIDES;
    payload: any;
};

type PollingRidesAction = {
    type: typeof POLLING_RIDES;
};

type SuccessRidesAction = {
    type: typeof SUCCESS_RIDES;
    payload: SearchResultDto;
};

type ErrorRidesAction = {
    type: typeof ERROR_RIDES;
    payload: Error;
};

type ContinuePollingOnClient = {
    type: typeof SET_CONTINUE_POLLING_RIDES;
};

export type SearchRidesActionTypes =
    | FetchingRidesAction
    | PollingRidesAction
    | SuccessRidesAction
    | ErrorRidesAction
    | ContinuePollingOnClient
    | FetchingRidesBrowser
    | DebugNearDayWithRides;
