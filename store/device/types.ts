import { DeviceType } from 'utils/ssrMatchMedia';

export type DeviceState = {
    device: DeviceType | null;
    wasSSR: boolean; // был ли предыдущий рендер на сервере?
};

export const DEVICE_TYPE_SET = 'DEVICE_TYPE_SET';
export const DEVICE_TYPE_RESET = 'DEVICE_TYPE_RESET';

export type DeviceTypeSetAction = {
    type: typeof DEVICE_TYPE_SET;
    payload: DeviceType | null;
};

export type DeviceTypeResetAction = {
    type: typeof DEVICE_TYPE_RESET;
};

export type DeviceActionTypes = DeviceTypeSetAction | DeviceTypeResetAction;
