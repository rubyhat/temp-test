import {
    DEVICE_TYPE_RESET,
    DEVICE_TYPE_SET,
    DeviceActionTypes,
    DeviceTypeSetAction,
} from './types';

export const deviceTypeSet = (
    device: DeviceTypeSetAction['payload']
): DeviceActionTypes => ({
    type: DEVICE_TYPE_SET,
    payload: device,
});

export const deviceTypeReset = (): DeviceActionTypes => ({
    type: DEVICE_TYPE_RESET,
});
