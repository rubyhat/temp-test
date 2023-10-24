import { BrandState } from 'store/brand/types';

/**
 * Сгенерирует `manifest.jaon` на основе SaaS конфига.
 * @param brand
 * @param appName
 */
export function generateWebManifest(
    brand: BrandState,
    appName: string
): WebAppManifest | null {
    const { partner } = brand;

    if (!partner) return null;

    return {
        short_name: appName,
        name: appName,
        description: '',
        start_url: '.',
        display: 'standalone',

        background_color: '#FFF',

        icons: [
            {
                src: partner.meta.pwaIcon512x512Png || '',
                sizes: '512x512',
                type: 'image/png',
            },
            {
                src: partner.meta.pwaIcon192x192Png || '',
                sizes: '192x192',
                type: 'image/png',
            },
        ].filter(icon => !!icon.src),
    };
}
