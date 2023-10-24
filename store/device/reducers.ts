import { Reducer } from 'redux';

import {
    DEVICE_TYPE_RESET,
    DEVICE_TYPE_SET,
    DeviceActionTypes,
    DeviceState,
} from './types';

const initialState: DeviceState = {
    device: null,
    wasSSR: false,
};

export const deviceReducer: Reducer<DeviceState, DeviceActionTypes> = (
    state = initialState,
    action
): DeviceState => {
    switch (action.type) {
        case DEVICE_TYPE_SET: {
            return {
                ...state,
                device: action.payload,
                wasSSR: true,
            };
        }
        case DEVICE_TYPE_RESET: {
            return initialState;
        }
        default:
            return state;
    }
};
