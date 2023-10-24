import React, { FC } from 'react';
import MaskedInput from 'react-text-mask';
import { InputBaseComponentProps } from '@material-ui/core/InputBase';

function toUpperCase(conformedValue: string) {
    return conformedValue.toUpperCase();
}

export const DocumentInput: FC<InputBaseComponentProps> = props => {
    const { inputRef, onFocus, mask, ...rest } = props;

    return (
        <MaskedInput
            {...rest}
            ref={ref => {
                inputRef(ref ? ref.inputElement : null);
            }}
            mask={mask}
            pipe={toUpperCase}
        />
    );
};
