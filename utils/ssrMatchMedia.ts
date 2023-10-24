import mediaQuery from 'css-mediaquery';

export type DeviceType = 'desktop' | 'mobile';

export function ssrMatchMedia(deviceType: DeviceType | null) {
    return (query: string) => {
        return {
            matches: mediaQuery.match(query, {
                // The estimated CSS width of the browser.
                width: deviceType === 'mobile' ? '0px' : '1024px',
            }),
        };
    };
}
