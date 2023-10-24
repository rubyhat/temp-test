import React, { FC } from 'react';
import Downshift from 'downshift';
import Divider from '@material-ui/core/Divider';
import MenuItem, { MenuItemProps } from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';

import { useStyles } from './styles';

type Option = {
    text: string;
    value: string | number;
};

type RenderOptionProps = {
    highlightedIndex: number | null;
    index: number;
    itemProps: MenuItemProps<'div', { button?: never }>;
    option: Option;
    selectedItem: Option;
};

type RenderInputProps = TextFieldProps & {
    classes: ReturnType<typeof useStyles>;
    ref?: React.Ref<HTMLDivElement>;
};

type Props = {
    /**
     * 	If `true`, the Input will not have an underline.
     */
    disableUnderline?: boolean;
    /**
     * The label content of TextField.
     */
    label?: string;
    /**
     * Callback fired when the value changes.
     */
    onChange?: (option: Option | null) => void;
    /**
     * Array of suggestions.
     */
    options: Option[];
    /**
     * The short hint displayed in the input before the user enters a value.
     */
    placeholder?: string;
    /**
     * Render the option inside MenuItem. Use `option.text` by default.
     */
    renderOptionContent?: (option: Option) => React.ReactNode;
    /**
     * Display options when input is empty and focused.
     */
    showEmpty?: boolean;
    /**
     * The input value.
     */
    value?: Option | null;
};

export const Autocomplete: FC<Props> = props => {
    const {
        disableUnderline,
        label,
        onChange,
        options,
        placeholder,
        renderOptionContent,
        showEmpty = false,
        value,
    } = props;

    const classes = useStyles();

    const handleStateChange = (changes: { selectedItem?: Option }) => {
        if (changes.hasOwnProperty('selectedItem')) {
            onChange && onChange(changes.selectedItem || null);
        }
    };

    const handleItemToString = (option: Option | null) => {
        return (option && option.text) || '';
    };

    const getOptions = (value: string | null) => {
        const inputValue = (value || '').trim().toLowerCase();
        const inputLength = inputValue.length;
        let count = 0;

        return inputLength === 0 && !showEmpty
            ? []
            : options.filter(option => {
                  const keep =
                      count < 5 &&
                      option.text.slice(0, inputLength).toLowerCase() ===
                          inputValue;

                  if (keep) count += 1;

                  return keep;
              });
    };

    const renderOption = (optionProps: RenderOptionProps) => {
        const {
            option,
            index,
            itemProps,
            highlightedIndex,
            selectedItem,
        } = optionProps;
        const isHighlighted = highlightedIndex === index;
        const isSelected =
            selectedItem && (selectedItem.text || '').indexOf(option.text) > -1;

        const classesList = [
            classes.menuItem,
            isSelected ? 'Atlas-selected' : undefined,
        ].join(' ');

        return (
            <React.Fragment key={option.value}>
                <MenuItem
                    className={classesList}
                    {...itemProps}
                    selected={isHighlighted}
                    component="div"
                >
                    {renderOptionContent
                        ? renderOptionContent(option)
                        : option.text}
                </MenuItem>
                <Divider className={classes.divider} variant="middle" />
            </React.Fragment>
        );
    };

    const renderInput = (inputProps: RenderInputProps) => {
        const { InputProps, classes, ref, ...other } = inputProps;

        return (
            <TextField
                className={classes.textField}
                InputProps={{
                    inputRef: ref,
                    classes: {
                        root: classes.inputRoot,
                        input: classes.inputInput,
                    },
                    ...InputProps,
                }}
                {...other}
            />
        );
    };

    return (
        <div className={classes.root}>
            <Downshift
                selectedItem={value}
                onStateChange={handleStateChange}
                itemToString={handleItemToString}
            >
                {({
                    getInputProps,
                    getItemProps,
                    getLabelProps,
                    getMenuProps,
                    isOpen,
                    inputValue,
                    highlightedIndex,
                    selectedItem,
                    clearSelection,
                    openMenu,
                }) => {
                    const {
                        onBlur,
                        onChange,
                        onFocus,
                        ...inputProps
                    } = getInputProps({
                        onChange: (
                            event: React.ChangeEvent<HTMLInputElement>
                        ) => {
                            if (event.target.value === '') {
                                clearSelection();
                            }
                        },
                        onFocus: openMenu,
                    });

                    return (
                        <div className={classes.container}>
                            {renderInput({
                                classes,
                                fullWidth: true,
                                InputLabelProps: getLabelProps({
                                    shrink: undefined,
                                } as any),
                                inputProps,
                                InputProps: {
                                    onBlur,
                                    onChange,
                                    onFocus,
                                    disableUnderline,
                                },
                                label,
                                placeholder,
                            })}

                            <div {...getMenuProps()}>
                                {isOpen ? (
                                    <Paper
                                        className={classes.paper}
                                        elevation={0}
                                        square
                                    >
                                        {getOptions(inputValue).map(
                                            (option, index) =>
                                                renderOption({
                                                    option,
                                                    index,
                                                    itemProps: getItemProps({
                                                        item: option,
                                                    }),
                                                    highlightedIndex,
                                                    selectedItem,
                                                })
                                        )}
                                    </Paper>
                                ) : null}
                            </div>
                        </div>
                    );
                }}
            </Downshift>
        </div>
    );
};
