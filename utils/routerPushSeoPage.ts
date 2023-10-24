import { NextRouter, SingletonRouter } from 'next/router';

import { Suggestion } from 'store/search-form/types';
import { checkIsInfoPortal } from './infoportal';

type SeoQueryParams = {
    from: Suggestion | null;
    to: Suggestion | null;
    date?: string;
    time?: string;
    passengers: string | number;
};

export function routerPushSeoPage(
    router: NextRouter | SingletonRouter,
    params: SeoQueryParams,
    seoPrefix: string,
    options?: { shallow?: boolean }
): Promise<boolean> {
    const { from, to, date, passengers, time } = params;
    const isInfoPortal = checkIsInfoPortal(from, to);
    if (!from || !to) {
        console.warn(
            '[routerPushSeoPage] Missing fromValue/toValue in SearchForm state'
        );

        return Promise.resolve(false);
    }

    const query: any = {
        from: from.id,
        to: to.id,
        date,
        passengers,
        fromName: from.name,
        toName: to.name,
        seoPrefix,
    };
    if (time) {
        query['time'] = time;
    }
    const queryObj: any = {
        date,
        passengers,
        from: from.id,
        to: to.id,
    };
    if (time) {
        queryObj['time'] = time;
    }

    if (isInfoPortal) {
        return router.push({
            pathname: '/search/',
            query,
        });
    } else {
        return router.push(
            {
                pathname: '/search/',
                query,
            },
            {
                pathname: `/${seoPrefix}/${from.name}/${to.name}/`,
                query: queryObj,
            },
            options
        );
    }
}
