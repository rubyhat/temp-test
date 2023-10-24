import React, { ChangeEvent, FC, FocusEvent, KeyboardEvent } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CancelIcon from '@material-ui/icons/Cancel';
import Divider from '@material-ui/core/Divider';
import InputBase from '@material-ui/core/InputBase';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Slide, { SlideProps } from '@material-ui/core/Slide';
import Toolbar from '@material-ui/core/Toolbar';
import useAutocomplete, {
    AutocompleteChangeDetails,
    AutocompleteChangeReason,
} from '@material-ui/lab/useAutocomplete';
import {
    AutocompleteProps,
    AutocompleteRenderGroupParams,
} from '@material-ui/lab/Autocomplete';
import clsx from 'clsx';

import { Suggestion } from 'store/search-form/types';
import { useStyles } from 'components/ui/MobileSearchBar/styles';
import { ListSubheader } from '../ui/ListSubheader';

const Transition = React.forwardRef<unknown, SlideProps>(function Transition(
    props,
    ref
) {
    return <Slide direction="up" ref={ref} {...props} />;
});
Transition.displayName = 'Transition';

type Props<T = Suggestion> = {
    value: T | null;
    onChange: AutocompleteProps<T, false, false, false>['onChange'];
    inputValue: string;
    onInputChange: AutocompleteProps<T, false, false, false>['onInputChange'];
    suggestions: T[];
    label?: string;
    onFocus?: AutocompleteProps<T, false, false, false>['onFocus'];
    onBlur?: AutocompleteProps<T, false, false, false>['onBlur'];
    onClear?: () => void;
    onClose?: () => void;
    cancelButtonLabel?: string;
    autoSelect?: boolean;
    groupBy?: AutocompleteProps<T, false, false, false>['groupBy'];
    renderGroup?: AutocompleteProps<T, false, false, false>['renderGroup'];
    filterOptions?: AutocompleteProps<T, false, false, false>['filterOptions'];
};

// useAutocomplete().getInputProps() не до конца типизирован
// https://github.com/mui-org/material-ui/blob/940d5caefb14e6d5eef2c86d37858bb00fa8eb4a/packages/material-ui-lab/src/useAutocomplete/useAutocomplete.js#L947
type AutocompleteInputProps = {
    onFocus: (e: FocusEvent<HTMLInputElement>) => void;
    onBlur: (e: FocusEvent<HTMLInputElement>) => void;
};

// Недотипизированный Material-UI
type SuggestionGroup = {
    index: number;
    key: string;
    group: string;
    options: Suggestion[];
};

export const MobileSuggest: FC<Props> = props => {
    const {
        value,
        onChange,
        inputValue,
        onInputChange,
        suggestions,
        label,
        onFocus,
        onBlur,
        onClose,
        cancelButtonLabel,
        autoSelect,
        renderGroup: renderGroupProp,
        groupBy,
        filterOptions,
    } = props;
    const classes = useStyles();

    const handleChange = (
        event: ChangeEvent<{}>,
        value: Suggestion | null,
        reason: AutocompleteChangeReason,
        details?: AutocompleteChangeDetails<Suggestion> | undefined
    ) => {
        if (reason === 'select-option') {
            if (onClose) onClose();
        }

        if (onChange) {
            onChange(event, value, reason, details);
        }
    };

    const {
        getInputProps,
        getListboxProps,
        getOptionProps,
        getRootProps,
        groupedOptions,
        getClearProps,
    } = useAutocomplete<Suggestion, false, false, false>({
        value,
        onChange: handleChange,
        inputValue,
        onInputChange,
        options: suggestions,
        getOptionLabel: option => option.name,
        open: true,
        selectOnFocus: true,
        groupBy,
        getOptionSelected: (option, value) => option.id === value.id,
        filterOptions,
        autoHighlight: true,
    });
    const inputProps = getInputProps() as AutocompleteInputProps;

    const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
        if (autoSelect) event.target.select();
        if (onFocus) onFocus(event);

        inputProps.onFocus(event);
    };
    const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
        if (onBlur) onBlur(event);

        inputProps.onBlur(event);
    };

    const renderItem = (suggestion: Suggestion, index: number) => {
        return (
            <ListItem
                className={classes.option}
                {...getOptionProps({ option: suggestion, index })}
                button
                key={suggestion.name}
            >
                <ListItemText
                    primary={suggestion.name}
                    secondary={suggestion.description}
                />
            </ListItem>
        );
    };

    const defaultRenderGroup = (params: AutocompleteRenderGroupParams) => (
        <li key={params.key}>
            {/* @todo li -> li считается невалидной разметкой.
                Заменить на <ListSubheader component="div">
                после обновления Material-UI.
            */}
            <ListSubheader>{params.group}</ListSubheader>
            <ul>{params.children}</ul>
        </li>
    );
    const renderGroup = renderGroupProp || defaultRenderGroup;

    const renderListOption = (option: Suggestion, index: number) => (
        <React.Fragment key={index}>
            {renderItem(option, index)}
            {index + 1 < groupedOptions.length ? (
                <Divider variant="middle" />
            ) : null}
        </React.Fragment>
    );

    const showClearIcon = !!value;

    return (
        <div {...getRootProps()}>
            <AppBar className={classes.appBar} color="inherit" position="fixed">
                <Toolbar className={classes.toolbar}>
                    <div className={classes.search}>
                        <InputBase
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            value={value}
                            placeholder={label}
                            autoFocus
                            inputProps={{
                                ...inputProps,
                                onFocus: handleFocus,
                                onBlur: handleBlur,
                            }}
                        />
                        {showClearIcon && (
                            <div
                                {...getClearProps()}
                                className={classes.clearIcon}
                            >
                                <CancelIcon fontSize="small" />
                            </div>
                        )}
                    </div>
                    <Button
                        className={classes.cancelButton}
                        color="primary"
                        onClick={onClose}
                    >
                        {cancelButtonLabel}
                    </Button>
                </Toolbar>
            </AppBar>

            {groupedOptions.length > 0 ? (
                <List
                    className={clsx(classes.list, classes.listbox)}
                    disablePadding
                    {...getListboxProps()}
                >
                    {groupedOptions.map((option, index) => {
                        if (groupBy) {
                            // Снова не типизирован
                            // https://github.com/mui-org/material-ui/blob/next/packages/material-ui-lab/src/useAutocomplete/useAutocomplete.d.ts#L288
                            const nestedOption: {
                                index: number;
                                key: string;
                                group: string;
                                options: Suggestion[];
                            } = option as any;

                            return renderGroup({
                                key: nestedOption.key,
                                group: nestedOption.group,
                                children: nestedOption.options.map(
                                    (option2, index2) =>
                                        renderListOption(
                                            option2,
                                            nestedOption.index + index2
                                        )
                                ),
                            });
                        }

                        return renderListOption(option, index);
                    })}
                </List>
            ) : null}
        </div>
    );
};
