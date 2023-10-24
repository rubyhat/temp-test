export type PolicyState = {
    id: string;
    link: string;
    version: string;
    isActive: boolean;
    titleMain: string;
    countryCodes: string[];
    titleSecondery: string;
};
export const POLICY_LOADED = 'POLICY_LOADED';
export const POLICY_LOADED_ERROR = 'POLICY_LOADED_ERROR';
export const POLICY_ACCEPTED = 'POLICY_ACCEPTED';

export type PolicyIsLoad = {
    type: typeof POLICY_LOADED;
    payload: PolicyState;
};

export type PolicyLoadError = {
    type: typeof POLICY_LOADED_ERROR;
};

export type PolicyActionTypes = PolicyIsLoad | PolicyLoadError;
