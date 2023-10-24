import React, { MutableRefObject, ReactNode } from 'react';
import Autocomplete, {
    AutocompleteProps,
    AutocompleteRenderInputParams,
} from '@material-ui/lab/Autocomplete';
import ListItemText from '@material-ui/core/ListItemText';
import { fade, makeStyles, Theme } from '@material-ui/core/styles';

import { Suggestion } from 'store/search-form/types';
import { TextField } from 'components/ui/TextField/TextField';
import { PopperBelow } from './PopperBelow';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            width: '100%',
        },
        /* Styles applied to the options `Paper` component. */
        paper: {
            boxShadow: theme.atlas.shadows.fly,
        },
        /* Styles applied to the input `TextField` component. */
        textField: {},
        /* Styles applied to the Input element. */
        inputRoot: {
            '&.MuiFilledInput-root.MuiAutocomplete-inputRoot.MuiFilledInput-adornedEnd': {
                padding: '0 12px 0 0',

                '& .MuiAutocomplete-input': {
                    padding: '27px 12px 10px',
                },
            },
            '&.MuiFilledInput-root': {
                backgroundColor: '#FFF',
            },
        },
        /* Styles applied to the no option wrapper. */
        noOptions: {
            display: 'none',
        },
        /* Styles applied to the `MuiAutocomplete-listbox`. */
        listbox: {
            padding: 0,
        },
        /* Styles applied to the option elements. */
        option: {
            '&[aria-selected="true"]': {
                backgroundColor: fade(theme.palette.primary.main, 0.16),
            },
            '&[data-focus="true"]': {
                backgroundColor: fade(theme.palette.primary.main, 0.08),
            },
            '&:active': {
                backgroundColor: fade(theme.palette.primary.main, 0.16),
            },
            '&[aria-disabled="true"]': {
                opacity: theme.palette.action.disabledOpacity,
                pointerEvents: 'none',
            },
        },
    }),
    { name: 'DesktopSuggest' }
);

export type DesktopSuggestProps<T = Suggestion> = {
    value: T | null;
    onChange: AutocompleteProps<T, false, false, false>['onChange'];
    inputValue: string;
    onInputChange: AutocompleteProps<T, false, false, false>['onInputChange'];
    suggestions: T[];
    label?: string;
    onFocus?: AutocompleteProps<T, false, false, false>['onFocus'];
    onBlur?: AutocompleteProps<T, false, false, false>['onBlur'];
    endAdornment?: ReactNode;
    groupBy?: AutocompleteProps<T, false, false, false>['groupBy'];
    renderGroup?: AutocompleteProps<T, false, false, false>['renderGroup'];
    filterOptions?: AutocompleteProps<T, false, false, false>['filterOptions'];
};

export const DesktopSuggest = React.forwardRef<
    HTMLInputElement,
    DesktopSuggestProps
>(function DesktopSuggest(props, ref) {
    const {
        value,
        onChange,
        inputValue,
        onInputChange,
        suggestions,
        label,
        endAdornment,
        groupBy,
        renderGroup,
        ...other
    } = props;
    const classes = useStyles();

    return (
        <Autocomplete
            classes={{
                root: classes.root,
                paper: classes.paper,
                inputRoot: classes.inputRoot,
                noOptions: classes.noOptions,
                listbox: classes.listbox,
                option: classes.option,
            }}
            value={value}
            onChange={onChange}
            inputValue={inputValue}
            onInputChange={onInputChange}
            getOptionLabel={option => option.name}
            groupBy={groupBy}
            renderGroup={renderGroup}
            renderInput={params => {
                // { inputProps: object } не до конца типизирован
                // https://github.com/mui-org/material-ui/blob/next/packages/material-ui-lab/src/Autocomplete/Autocomplete.d.ts#L34
                type InputElementProps = {
                    ref: MutableRefObject<HTMLInputElement | null>;
                };

                const {
                    InputProps,
                    inputProps,
                    ...TextFieldProps
                } = params as Omit<
                    AutocompleteRenderInputParams,
                    'inputProps'
                > & {
                    inputProps: InputElementProps;
                };

                return (
                    <TextField
                        {...TextFieldProps}
                        label={label}
                        fullWidth
                        variant="filled"
                        InputProps={{
                            ...InputProps,
                            disableUnderline: true,
                            endAdornment,
                        }}
                        inputProps={{
                            ...inputProps,
                            ref: (refEl: HTMLInputElement) => {
                                const { ref: refParam } = inputProps;
                                if (refParam) {
                                    refParam.current = refEl;
                                }

                                if (ref) {
                                    // [react] forwardRefs ref object should be mutable
                                    // https://github.com/DefinitelyTyped/DefinitelyTyped/pull/43265/commits
                                    (ref as MutableRefObject<HTMLInputElement | null>).current = refEl;
                                }
                            },
                        }}
                    />
                );
            }}
            renderOption={(option, state) => (
                <React.Fragment key={option.name}>
                    <ListItemText
                        primary={option.name}
                        secondary={option.description}
                    />
                </React.Fragment>
            )}
            getOptionSelected={(option, value) => option.id === value.id}
            options={suggestions}
            closeIcon={null}
            popupIcon={null}
            noOptionsText={null}
            openOnFocus
            autoHighlight
            PopperComponent={PopperBelow}
            {...other}
        />
    );
});
