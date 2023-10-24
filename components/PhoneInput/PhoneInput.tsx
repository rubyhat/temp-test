import React, { FC, useState, useEffect, useRef } from 'react';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import { AsYouType } from 'libphonenumber-js';

export type PhoneInputProps = {
    defaultCountry?: string;
    onPhoneChange?: (phone: string) => void;
    value: string;
    autoFocus?: boolean;
} & TextFieldProps;

export const PhoneInput: FC<PhoneInputProps> = props => {
    const {
        inputRef,
        onPhoneChange,
        inputProps,
        defaultCountry,
        value,
        autoFocus = true,
        ...rest
    } = props;

    const [phoneInput, setPhoneInput] = useState(value);

    useEffect(() => {
        if (phoneInput.length === 0) {
            setPhoneInput(value);
        }
    }, [value]);

    const textFieldRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (textFieldRef.current && autoFocus) {
            textFieldRef.current.focus();
        }
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
        const phone = new AsYouType(defaultCountry as any);
        const rawPhone = phone.input(e.target.value) || '+'; // на цифровой клавиатуре отсутствует "+" и его нельзя вернуть если случайно удалил
        const phoneNumber = phone.getNumber();

        if (onPhoneChange) {
            onPhoneChange(
                phoneNumber ? phoneNumber.number.toString() : rawPhone
            );
        }
        setPhoneInput(rawPhone);
    };

    return (
        <TextField
            onChange={handleChange}
            inputProps={{
                ...inputProps,
                value: phoneInput,
            }}
            {...rest}
            inputRef={textFieldRef}
        />
    );
};
