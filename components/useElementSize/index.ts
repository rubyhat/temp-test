import { useEffect, useState } from 'react';

export default function useElementSize(
    element: Window | HTMLElement | null = window,
    deps: any[] = []
) {
    const isClient = typeof window === 'object';

    function getSize() {
        if (element === null) {
            return {
                width: 0,
                height: 0,
            };
        }
        return {
            width: isClient
                ? element instanceof HTMLElement
                    ? element.offsetWidth
                    : element.innerWidth
                : 0,
            height: isClient
                ? element instanceof HTMLElement
                    ? element.offsetHeight
                    : element.innerHeight
                : 0,
        };
    }

    const [windowSize, setWindowSize] = useState(getSize);

    useEffect(() => {
        if (!isClient) return;

        setWindowSize(getSize());
    }, deps);

    useEffect(() => {
        if (!isClient) return;

        function handleResize() {
            setWindowSize(getSize());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    });

    return windowSize;
}
