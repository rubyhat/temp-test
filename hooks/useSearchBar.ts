import { useEffect, useRef, useState } from 'react';
import animateScrollTo from 'animated-scroll-to';

export function useSearchBar() {
    const containerRef = useRef<HTMLElement>(null);
    const [searchBarVisible, setSearchBarVisible] = useState(false);

    const handleSearchClick = () => {
        animateScrollTo(0);
    };
    const handleVisibilityChange = (isVisible: boolean) => {
        setSearchBarVisible(!isVisible);
    };

    useEffect(() => {
        if (
            process.browser &&
            window.StatusBar &&
            window.cordova &&
            window.cordova.platformId === 'ios'
        ) {
            if (searchBarVisible) {
                window.StatusBar.styleDefault();
            } else {
                window.StatusBar.styleLightContent();
            }
        }
    }, [searchBarVisible]);

    return {
        containerRef,
        searchBarVisible,

        handleSearchClick,
        handleVisibilityChange,
    };
}
