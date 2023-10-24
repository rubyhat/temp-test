import React from 'react';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import { createSvgIcon } from '@material-ui/core/utils';

const Component = createSvgIcon(
    <React.Fragment>
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12.002 19C15.8679 19 19.002 15.866 19.002 12C19.002 8.13401 15.8679 5 12.002 5C8.13596 5 5.00195 8.13401 5.00195 12C5.00195 15.866 8.13596 19 12.002 19ZM12.002 14.3333C13.2906 14.3333 14.3353 13.2887 14.3353 12C14.3353 10.7113 13.2906 9.66667 12.002 9.66667C10.7133 9.66667 9.66862 10.7113 9.66862 12C9.66862 13.2887 10.7133 14.3333 12.002 14.3333Z"
            fill="#08293B"
            fillOpacity="0.8"
        />
    </React.Fragment>,
    'PickupPoint'
);

const Icon = React.forwardRef<SVGSVGElement, SvgIconProps>((props, ref) => {
    return <Component {...props} ref={ref} viewBox="0 0 24 24" />;
});

export default Icon;
