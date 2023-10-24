import React, { ChangeEvent, FC, ReactNode } from 'react';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            position: 'relative',
            display: 'inline-flex',
            fontSize: theme.atlas.typography.body1.fontSize,
            height: 24,
            color: theme.atlas.palette.text.base,
        },
        /* Styles applied to the select element. */
        select: {
            border: 0,
            margin: 0,
            display: 'block',
            background: 'none',
            color: 'currentColor',
            userSelect: 'none',
            borderRadius: 0,
            fontSize: 'inherit',
            outline: 'none',
            height: 'inherit',
            lineHeight: 'inherit',
            minWidth: 168,
            width: '100%',
            /* Remove default select arrow */
            '-moz-appearance': 'none', // Firefox
            '-webkit-appearance': 'none', // Chrome
            '&::-ms-expand': {
                // IE 10
                display: 'none',
            },
        },
        endAdornment: {
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            right: 0,
            top: 0,
            bottom: 0,
            height: 'inherit',
            cursor: 'default',
            pointerEvents: 'none',
        },
        text: {
            color: theme.atlas.palette.text.minor,
        },
        icon: {
            marginLeft: theme.spacing(1),
            color: theme.atlas.palette.text.minor,
            height: 'inherit',
        },
    }),
    { name: 'NativeSelect' }
);

type Props = {
    value?: string | number;
    onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
    className?: string;
    disabled?: boolean;
    children: ReactNode;
    renderLabel?: () => ReactNode;
};

export const NativeSelect: FC<Props> = React.forwardRef<
    HTMLSelectElement,
    Props
>((props, ref) => {
    const {
        className,
        disabled,
        children,
        onChange = () => {},
        value,
        renderLabel,
    } = props;
    const classes = useStyles();

    return (
        <div className={clsx(classes.root)}>
            <select
                value={value}
                className={clsx(classes.select, className)}
                disabled={disabled}
                ref={ref}
                onChange={onChange}
                children={children}
            />
            <div className={classes.endAdornment}>
                {renderLabel && (
                    <div className={classes.text}>{renderLabel()}</div>
                )}
                <div className={classes.icon}>
                    <ArrowDropDownIcon />
                </div>
            </div>
        </div>
    );
});
