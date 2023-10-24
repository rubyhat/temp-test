import React from 'react';
import { PopperProps } from '@material-ui/core';
import Popper from '@material-ui/core/Popper';

const popperOptions = {
    modifiers: {
        // Не флипать в верхнюю часть при нехватке пространства
        flip: { enabled: false },
    },
};

export const PopperBelow = React.forwardRef<HTMLDivElement, PopperProps>(
    (props, ref) => {
        return <Popper ref={ref} {...props} popperOptions={popperOptions} />;
    }
);
