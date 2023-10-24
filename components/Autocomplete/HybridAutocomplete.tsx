import React, { FC, ReactNode } from 'react';
import { useTheme } from '@material-ui/core/styles';
import { AutocompleteProps } from '@material-ui/lab';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { AutocompleteRenderInputParams } from '@material-ui/lab/Autocomplete';

import {
    DesktopAutocomplete,
    DesktopAutocompleteProps,
} from 'components/Autocomplete/DesktopAutocomplete';
import {
    TouchAutocomplete,
    TouchAutocompleteProps,
} from 'components/Autocomplete/TouchAutocomplete';
import { AutocompleteInputProps } from 'components/Autocomplete/types';
import { isCordova } from 'utils/platform';

type Props<
    T = any,
    Multiple extends boolean | undefined = false,
    DisableClearable extends boolean | undefined = false,
    FreeSolo extends boolean | undefined = false
> = Omit<
    AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>,
    | 'classes'
    | 'disablePortal'
    | 'getLimitTagsText'
    | 'groupBy'
    | 'limitTags'
    | 'multiple'
    | 'open'
    | 'renderGroup'
    | 'renderInput'
> & {
    // desktop
    renderInput: (params: AutocompleteRenderInputParams) => React.ReactNode;
} & {
    // touch
    renderActivator: (params: AutocompleteInputProps) => ReactNode;
    placeholder?: string;
    dialogOpen?: boolean;
    onClose?: () => void;
    onOpen?: () => void;
} & {
    DesktopAutocompleteProps?: Partial<DesktopAutocompleteProps>;
    TouchAutocompleteProps?: Partial<TouchAutocompleteProps>;
};

export const HybridAutocomplete: FC<Props> = props => {
    const {
        DesktopAutocompleteProps,
        TouchAutocompleteProps,
        // TouchAutocompleteProps
        renderActivator,
        placeholder,
        dialogOpen,
        onClose,
        onOpen,
        // DesktopAutocompleteProps
        renderInput,
        ...other
    } = props;
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md')) && !isCordova;

    if (isDesktop) {
        return (
            <DesktopAutocomplete
                {...other}
                {...DesktopAutocompleteProps}
                renderInput={renderInput}
            />
        );
    }

    return (
        <TouchAutocomplete
            {...other}
            {...TouchAutocompleteProps}
            renderActivator={renderActivator}
            placeholder={placeholder}
            dialogOpen={dialogOpen}
            onClose={onClose}
            onOpen={onOpen}
        />
    );
};
