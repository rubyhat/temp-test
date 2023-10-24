import React from 'react';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import { createSvgIcon } from '@material-ui/core/utils';

const Component = createSvgIcon(
    <React.Fragment>
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8.37094 15.8646C8.74136 14.5311 9.82866 13.5529 10.9681 12.7674C12.7996 11.5049 14 9.39265 14 7C14 3.13401 10.866 0 7 0C3.13401 0 0 3.13401 0 7C0 9.39265 1.20043 11.5049 3.03186 12.7674C4.17134 13.5529 5.25864 14.5311 5.62905 15.8646L6.36618 18.5182C6.44527 18.803 6.7045 19 7 19V19C7.2955 19 7.55473 18.803 7.63382 18.5182L8.37094 15.8646ZM9.33341 7C9.33341 8.28866 8.28875 9.33333 7.00008 9.33333C5.71142 9.33333 4.66675 8.28866 4.66675 7C4.66675 5.71133 5.71142 4.66666 7.00008 4.66666C8.28875 4.66666 9.33341 5.71133 9.33341 7Z"
            fill="#052630"
        />
    </React.Fragment>,
    'Location'
);

type LocationIconProps = Omit<SvgIconProps, 'mobile'> & {
    mobile?: boolean;
};

const Icon = React.forwardRef<SVGSVGElement, LocationIconProps>(
    (props, ref) => {
        return (
            <Component
                {...props}
                ref={ref}
                viewBox="0 0 14 19"
                style={{ fillOpacity: props.mobile ? 0.62 : 1 }}
            />
        );
    }
);

export default Icon;
