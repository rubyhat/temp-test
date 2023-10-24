import React from 'react';

import { IStoreBadge } from 'components/appStore/StoreBadge/interfaces';

export const StoreBagde = (props: IStoreBadge) => {
    const { src, srcSet, alt } = props;
    return <img src={src} srcSet={srcSet} alt={alt} />;
};
