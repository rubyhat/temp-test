import {
    PolicyActionTypes,
    PolicyState,
    POLICY_LOADED,
    POLICY_LOADED_ERROR,
    POLICY_ACCEPTED,
} from './types';

export const policyLoaded = (data: PolicyState): PolicyActionTypes => ({
    type: POLICY_LOADED,
    payload: { ...data },
});

export const policyLoadError = (): PolicyActionTypes => ({
    type: POLICY_LOADED_ERROR,
});

export const policyAccept = (policyVersion: string) => ({
    type: POLICY_ACCEPTED,
    payload: { policyVersion: policyVersion },
});
