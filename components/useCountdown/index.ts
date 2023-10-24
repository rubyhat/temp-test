import { useState } from 'react';

import useInterval from 'components/useInterval';

const useCountdown = (timeout: number, delayProp: number = 1000) => {
    const [seconds, setSeconds] = useState(timeout);
    const [delay, setDelay] = useState<number | null>(delayProp);

    useInterval(() => {
        if (seconds <= 0) {
            setDelay(null);
            return;
        }
        setSeconds(seconds - 1);
    }, delay);

    return seconds;
};

export default useCountdown;
