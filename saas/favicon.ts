import { BrandState } from 'store/brand/types';
import { publicPath } from 'utils/publicPath';

type FaviconSize = 'ico' | '16x16' | '32x32';

const faviconMap: Record<FaviconSize, string> = {
    ico: '/favicon.ico',
    '16x16': publicPath('/static/img/favicon-16x16.png'),
    '32x32': publicPath('/static/img/favicon-32x32.png'),
};

export function favicon(size: FaviconSize, brandState: BrandState) {
    if (size === 'ico') return faviconMap.ico;

    const { partner } = brandState;

    if (partner) {
        return (partner as any).meta[`favicon${size}URL`] || null;
    }

    return null;
}
