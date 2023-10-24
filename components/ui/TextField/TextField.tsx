import React, { FC } from 'react';
import BaseTextField, { TextFieldProps } from '@material-ui/core/TextField';

import { useStyles } from './styles';

export type Props = TextFieldProps;

export const TextField: FC<Props> = React.forwardRef<HTMLDivElement, Props>(
    (props, ref) => {
        const { InputProps, InputLabelProps, ...rest } = props;
        const classes = useStyles(props);

        return (
            <BaseTextField
                ref={ref}
                className={classes.root}
                InputProps={{
                    className: classes.input,
                    ...InputProps,
                }}
                InputLabelProps={{
                    className: classes.label,
                    ...InputLabelProps,
                }}
                {...rest}
            />
        );
    }
);
