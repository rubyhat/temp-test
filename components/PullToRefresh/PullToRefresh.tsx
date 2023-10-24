import React, { FC } from 'react';
import { useRouter } from 'next/router';

import { usePullToRefresh } from 'hooks/usePullToRefresh';

type Props = {};

export const PullToRefresh: FC<Props> = () => {
    const router = useRouter();

    usePullToRefresh(() => router.reload());

    return null;
};
