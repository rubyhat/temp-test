import { FocusEvent, MouseEvent, RefObject } from 'react';

// Типы которые недотипизированы в @material-ui/lab/Autocomplete
// https://github.com/mui-org/material-ui/blob/next/packages/material-ui-lab/src/Autocomplete/Autocomplete.d.ts
// @todo убрать когда перейдет в @material-ui/core

// https://github.com/mui-org/material-ui/blob/940d5caefb14e6d5eef2c86d37858bb00fa8eb4a/packages/material-ui-lab/src/useAutocomplete/useAutocomplete.js#L947

export type AutocompleteInputProps = {
    value: string;
    onFocus: (e: FocusEvent<HTMLInputElement>) => void;
    onBlur: (e: FocusEvent<HTMLInputElement>) => void;
    onClick: (e: MouseEvent) => void;
    ref: RefObject<HTMLInputElement | null>;
};
