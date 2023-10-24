import {
    DEBUG_NEAR_DAY_WITH_RIDES,
    ERROR_RIDES,
    FETCHING_RIDES,
    POLLING_RIDES,
    SearchRidesActionTypes,
    SearchRidesState,
    SET_CONTINUE_POLLING_RIDES,
    SUCCESS_RIDES,
} from './types';

const initialState: SearchRidesState = {
    rides: [],
    calendar: [],
    status: null,
    error: null,
    continuePollingOnClient: false,
    pollingCount: 0,
    withScrolling: true,
    debugNearDayWithRides: null,
};

export const searchRidesReducer = (
    state: SearchRidesState = initialState,
    action: SearchRidesActionTypes
): SearchRidesState => {
    switch (action.type) {
        case FETCHING_RIDES: {
            return {
                ...state,
                rides: [],
                status: FETCHING_RIDES,
                error: null,
                withScrolling: action.payload.withScrolling,
            };
        }
        case POLLING_RIDES: {
            return {
                ...state,
                status: POLLING_RIDES,
                pollingCount: state.pollingCount + 1,
            };
        }
        case SUCCESS_RIDES: {
            const { rides, calendar } = action.payload;

            return {
                ...state,
                status: SUCCESS_RIDES,
                rides,
                calendar,
                pollingCount: 0,
                continuePollingOnClient: false,
            };
        }
        case ERROR_RIDES: {
            return {
                ...state,
                status: ERROR_RIDES,
                error: action.payload,
                pollingCount: 0,
                continuePollingOnClient: false,
            };
        }
        case SET_CONTINUE_POLLING_RIDES: {
            return {
                ...state,
                continuePollingOnClient: true,
            };
        }
        case DEBUG_NEAR_DAY_WITH_RIDES: {
            return {
                ...state,
                debugNearDayWithRides: action.payload,
            };
        }
        default:
            return state;
    }
};
