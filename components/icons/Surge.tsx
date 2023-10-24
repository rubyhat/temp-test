import React from 'react';
import clsx from 'clsx';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import { createSvgIcon } from '@material-ui/core/utils';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {},
        /* Pseudo-class applied to the root element if `color={purple}` */
        colorPurple: {
            backgroundColor: theme.atlas.palette.background.purple,
            borderRadius: '50%',
            border: `2px solid ${theme.palette.common.white}`,
        },
    }),
    { name: 'SurgeIcon' }
);

const Component = createSvgIcon(
    <React.Fragment>
        <path d="M302.7,64L143,288h95.8l-29.5,160L369,224h-95.8L302.7,64L302.7,64z" />
    </React.Fragment>,
    'BigBus'
);

export type SurgeIconProps = Omit<SvgIconProps, 'color'> & {
    /**
     * The color of the component. It supports those theme colors that make sense for this component.
     * You can use the `htmlColor` prop to apply a color attribute to the SVG element.
     */
    color?:
        | 'inherit'
        | 'primary'
        | 'secondary'
        | 'action'
        | 'disabled'
        | 'error'
        | 'purple';
};

const Icon = React.forwardRef<SVGSVGElement, SurgeIconProps>((props, ref) => {
    const { className, color, ...other } = props;
    const classes = useStyles();

    return (
        <Component
            className={clsx(classes.root, className, {
                [classes.colorPurple]: color === 'purple',
            })}
            color={color !== 'purple' ? color : undefined}
            {...other}
            ref={ref}
            viewBox="0 0 512 512"
        />
    );
});

export default Icon;
