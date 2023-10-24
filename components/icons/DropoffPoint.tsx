import React from 'react';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import { createSvgIcon } from '@material-ui/core/utils';

const Component = createSvgIcon(
    <React.Fragment>
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M13.3729 20.8646C13.7433 19.5311 14.8306 18.5529 15.9701 17.7674C17.8015 16.5049 19.002 14.3926 19.002 12C19.002 8.13401 15.8679 5 12.002 5C8.13596 5 5.00195 8.13401 5.00195 12C5.00195 14.3926 6.20238 16.5049 8.03381 17.7674C9.17329 18.5529 10.2606 19.5311 10.631 20.8646L11.3681 23.5182C11.4472 23.803 11.7065 24 12.002 24C12.2975 24 12.5567 23.803 12.6358 23.5182L13.3729 20.8646ZM14.3354 12C14.3354 13.2887 13.2907 14.3333 12.002 14.3333C10.7134 14.3333 9.6687 13.2887 9.6687 12C9.6687 10.7113 10.7134 9.66666 12.002 9.66666C13.2907 9.66666 14.3354 10.7113 14.3354 12Z"
            fill="#08293B"
            fillOpacity="0.8"
        />
    </React.Fragment>,
    'DropoffPoint'
);

const Icon = React.forwardRef<SVGSVGElement, SvgIconProps>((props, ref) => {
    return <Component {...props} ref={ref} viewBox="0 0 24 24" />;
});

export default Icon;
