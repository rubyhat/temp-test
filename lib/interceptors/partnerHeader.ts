import { AxiosRequestConfig } from 'axios';

import { getBrandID } from 'utils/brand';

export function partnerHeader(config: AxiosRequestConfig) {
    const partnerId = getBrandID();

    return {
        ...config,
        headers: {
            ...config.headers,
            'X-SAAS-Partner-Id': partnerId,
        },
    };
}
