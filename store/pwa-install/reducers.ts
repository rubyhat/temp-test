import { Reducer } from 'redux';

import {
    PWA_BEFORE_INSTALL_PROMPT_SAVED,
    PWA_INSTALLATION_DISMISSED,
    PWA_INSTALLED_SUCCESSFULLY,
    PWA_WAITING_FOR_INSTALL,
    PWAInstallActionTypes,
    PWAInstallState,
} from './types';

const initialState: PWAInstallState = {
    status: 'idle',
    pwaPromptWasDeferred: false,
};

export const pwaInstallReducer: Reducer<
    PWAInstallState,
    PWAInstallActionTypes
> = (state = initialState, action): PWAInstallState => {
    switch (action.type) {
        case PWA_WAITING_FOR_INSTALL: {
            return {
                ...state,
                status: 'waitingForInstall',
            };
        }
        case PWA_INSTALLED_SUCCESSFULLY: {
            return {
                ...state,
                status: 'installed',
            };
        }
        case PWA_INSTALLATION_DISMISSED: {
            return {
                ...state,
                status: 'dismissed',
            };
        }
        case PWA_BEFORE_INSTALL_PROMPT_SAVED: {
            return {
                ...state,
                pwaPromptWasDeferred: true,
            };
        }
        default:
            return state;
    }
};
