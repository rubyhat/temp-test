import {
    SaasUpdateVersionState,
    VERSION_LOAD,
    VERSION_LOADED,
    VERSION_LOADED_ERROR,
} from 'store/saasUpdateVersion/types';

export const SaasUpdateVersionLoad = () => ({
    type: VERSION_LOAD,
});

export const SassUpdateVersionLoaded = (data: SaasUpdateVersionState) => ({
    type: VERSION_LOADED,
    payload: data,
});

export const SassUpdateVersionLoadedError = () => ({
    type: VERSION_LOADED_ERROR,
});
