import React, { FC } from 'react';
import BaseButtonGroup, {
    ButtonGroupProps,
} from '@material-ui/core/ButtonGroup';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

const useStyles = makeStyles(
    {
        /* Styles applied to the root element. */
        root: {
            '& .MuiButton-root': {
                textTransform: 'unset',
                boxShadow: 'none',
                fontWeight: 400,
            },
        },
        /* Styles applied to the root element if `size="small"`. */
        sizeSmall: {
            height: 32,
        },
        /* Styles applied to the root element if `size="medium"`. */
        sizeMedium: {
            height: 40,
        },
        /* Styles applied to the root element if `size="large"`. */
        sizeLarge: {
            height: 56,
        },
    },
    { name: 'ButtonGroup' }
);

export type Props = Omit<ButtonGroupProps, 'size'> & {
    size?: 'small' | 'medium' | 'large';
};

export const ButtonGroup: FC<Props> = props => {
    const { children, size = 'small', ...rest } = props;
    const classes = useStyles();

    return (
        <BaseButtonGroup
            classes={{
                root: clsx(classes.root, {
                    [classes.sizeSmall]: size === 'small',
                    [classes.sizeMedium]: size === 'medium',
                    [classes.sizeLarge]: size === 'large',
                }),
            }}
            {...rest}
        >
            {children}
        </BaseButtonGroup>
    );
};
