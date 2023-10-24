export type SaasUpdateVersionState = {
    forced?: string;
    recommended?: string;
};

export const VERSION_LOADED = 'VERSION_LOADED';
export const VERSION_LOADED_ERROR = 'VERSION_LOADED_ERROR';
export const VERSION_LOAD = 'VERSION_LOAD';

export type SassUpdateVersionIsLoadAction = {
    type: typeof VERSION_LOAD;
};

export type SassUpdateVersionIsLoadedAction = {
    type: typeof VERSION_LOADED;
    payload: SaasUpdateVersionState;
};

export type SassUpdateVersionIsLoadErrorAction = {
    type: typeof VERSION_LOADED_ERROR;
};

export type SaasUpdateVersionActionTypes =
    | SassUpdateVersionIsLoadedAction
    | SassUpdateVersionIsLoadErrorAction
    | SassUpdateVersionIsLoadAction;
