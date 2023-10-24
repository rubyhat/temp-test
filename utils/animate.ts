// Source:
// https://github.com/mui-org/material-ui/blob/45779b92d3a259effc4cb79b82f8538b3364a1eb/packages/material-ui/src/internal/animate.js

type Options = {
    ease?: (time: number) => number;
    duration?: number;
};
type Properties = 'scrollLeft' | 'scrollTop';
type Callback = (error: Error | null) => void;

function easeInOutSin(time: number) {
    return (1 + Math.sin(Math.PI * time - Math.PI / 2)) / 2;
}

export default function animate(
    property: Properties,
    element: HTMLElement,
    to: number,
    options: Options = {},
    cb: Callback = () => {}
) {
    const {
        ease = easeInOutSin,
        duration = 300, // standard
    } = options;

    let start: number | null = null;
    const from = element[property];
    let cancelled = false;

    const cancel = () => {
        cancelled = true;
    };

    const step = (timestamp: number) => {
        if (cancelled) {
            cb(new Error('Animation cancelled'));
            return;
        }

        if (start === null) {
            start = timestamp;
        }
        const time = Math.min(1, (timestamp - start) / duration);

        element[property] = ease(time) * (to - from) + from;

        if (time >= 1) {
            requestAnimationFrame(() => {
                cb(null);
            });
            return;
        }

        requestAnimationFrame(step);
    };

    if (from === to) {
        cb(new Error('Element already at target position'));
        return cancel;
    }

    requestAnimationFrame(step);

    return cancel;
}
