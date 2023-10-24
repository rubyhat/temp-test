import React, {
    ChangeEvent,
    FocusEvent,
    ReactNode,
    useEffect,
    useRef,
    useState,
} from 'react';
import { fade, makeStyles, Theme } from '@material-ui/core/styles';
import { AutocompleteProps } from '@material-ui/lab';
import useAutocomplete, {
    AutocompleteChangeDetails,
    AutocompleteChangeReason,
} from '@material-ui/lab/useAutocomplete';
import clsx from 'clsx';
import CloseIcon from '@material-ui/icons/Close';
import Popper from '@material-ui/core/Popper';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import InputBase from '@material-ui/core/InputBase';
import CancelIcon from '@material-ui/icons/Cancel';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';

import { useTranslation } from 'i18n';
import { AutocompleteInputProps } from 'components/Autocomplete/types';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the input element. */
        input: {
            flexGrow: 1,
            textOverflow: 'ellipsis',
            opacity: 0,
        },
        /* Styles applied to the input element if tag focused. */
        inputFocused: {
            opacity: 1,
        },
        /* Styles applied to the endAdornment element. */
        endAdornment: {
            // We use a position absolute to support wrapping tags.
            position: 'absolute',
            right: 0,
            top: 'calc(50% - 14px)', // Center vertically
        },
        /* Styles applied to the `Paper` component. */
        paper: {
            ...theme.typography.body1,
            overflow: 'hidden',
            height: '100%',
            // AppBar offset
            paddingTop: 56,
            [theme.breakpoints.up('sm')]: {
                paddingTop: 64,
            },
        },
        /* Styles applied to the `listbox` component. */
        listbox: {
            listStyle: 'none',
            margin: 0,
            padding: '8px 0',
            overflow: 'auto',
            maxHeight: '100%',
        },
        /* Styles applied to the loading wrapper. */
        loading: {
            color: theme.palette.text.secondary,
            padding: '14px 16px',
        },
        /* Styles applied to the no option wrapper. */
        noOptions: {
            color: theme.palette.text.secondary,
            padding: '14px 16px',
        },
        /* Styles applied to the option elements. */
        option: {
            minHeight: 48,
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            cursor: 'pointer',
            paddingTop: 8,
            boxSizing: 'border-box',
            outline: '0',
            WebkitTapHighlightColor: 'transparent',
            paddingBottom: 8,
            paddingLeft: 16,
            paddingRight: 16,
            [theme.breakpoints.up('sm')]: {
                minHeight: 'auto',
            },
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
        /** Mobile AppBar **/
        appBar: {
            backgroundColor: '#FFF',
            boxShadow: theme.atlas.shadows.bottom,
            ...theme.atlas.appBar.paddingTop(0),
        },
        toolbar: {
            '&.MuiToolbar-gutters': {
                [theme.breakpoints.up('sm')]: {
                    paddingLeft: 16,
                    paddingRight: 16,
                },
            },
        },
        cancelButton: {
            fontSize: 16,
            marginLeft: theme.spacing(2),
            textTransform: 'unset',
            '&:hover': {
                backgroundColor: 'unset',
            },
        },
        search: {
            position: 'relative',
            borderRadius: theme.shape.borderRadius,
            backgroundColor: theme.atlas.palette.background.deepCold,
            width: '100%',
        },
        inputRoot: {
            width: '100%',
            color: theme.atlas.palette.text.base,
        },
        inputInput: {
            padding: theme.spacing(1, 4, 1, 1),
        },
        clearIcon: {
            width: theme.spacing(5),
            height: '100%',
            position: 'absolute',
            top: 0,
            right: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: theme.atlas.palette.text.disabled,
        },
        dialog: {
            backgroundColor: '#FFF',
            position: 'fixed',
            top: 'env(safe-area-inset-top)',
            bottom: 'env(safe-area-inset-bottom)',
            left: 0,
            right: 0,
            zIndex: theme.zIndex.modal,
            display: 'none',
            fallbacks: [
                {
                    top: 'constant(safe-area-inset-top)',
                    bottom: 'constant(safe-area-inset-bottom)',
                },
                {
                    top: 0,
                    bottom: 0,
                },
            ],
        },
        dialogOpen: {
            display: 'block',
        },
    }),
    { name: 'TouchAutocomplete' }
);

export type TouchAutocompleteProps<
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
    renderActivator: (params: AutocompleteInputProps) => ReactNode;
    placeholder?: string;
    dialogOpen?: boolean;
    onClose?: () => void;
    onOpen?: () => void;
};

export const TouchAutocomplete = React.forwardRef<
    unknown,
    TouchAutocompleteProps
>((props, ref) => {
    const classes = useStyles();
    const { t } = useTranslation();

    const {
        autoComplete = false,
        autoHighlight = false,
        autoSelect = false,
        blurOnSelect = false,
        ChipProps,
        className,
        clearOnBlur = !props.freeSolo,
        clearOnEscape = false,
        clearText = 'Clear',
        closeIcon = <CloseIcon fontSize="small" />,
        closeText = t('cancel'),
        debug = false,
        defaultValue = null,
        dialogOpen: dialogOpenProp,
        disableClearable = false,
        disableCloseOnSelect = false,
        disabled = false,
        disabledItemsFocusable = false,
        disableListWrap = false,
        filterOptions,
        filterSelectedOptions = false,
        forcePopupIcon = 'auto',
        freeSolo = false,
        fullWidth = false,
        getOptionDisabled,
        getOptionLabel = (option: any) => option.label || option, // @todo types
        getOptionSelected,
        handleHomeEndKeys = !props.freeSolo,
        id: idProp,
        includeInputInList = false,
        inputValue: inputValueProp,
        ListboxComponent = 'ul',
        ListboxProps,
        loading = false,
        loadingText = 'Loading…',
        noOptionsText = 'No options',
        onBlur,
        onChange,
        onClose,
        onFocus,
        onHighlightChange,
        onInputChange,
        onOpen,
        openOnFocus = false,
        openText = 'Open',
        options,
        PaperComponent = 'div',
        PopperComponent: PopperComponentProp = Popper,
        placeholder,
        popupIcon = <ArrowDropDownIcon />,
        renderActivator,
        renderOption: renderOptionProp,
        renderTags,
        selectOnFocus = !props.freeSolo,
        size = 'medium',
        value: valueProp,
        ...other
    } = props;

    const { current: isDialogControlled } = useRef(dialogOpenProp != null);
    const [dialogOpenState, setDialogOpen] = useState(false);
    const dialogOpen = isDialogControlled ? dialogOpenProp : dialogOpenState;

    const handleDialogOpen = () => {
        if (onOpen) onOpen();

        if (!isDialogControlled) {
            setDialogOpen(true);
        }
    };

    const handleDialogClose = () => {
        if (onClose) onClose();

        if (!isDialogControlled) {
            setDialogOpen(false);
        }
    };

    const handleChange = (
        event: ChangeEvent<{}>,
        value: any | null,
        reason: AutocompleteChangeReason,
        details?: AutocompleteChangeDetails<any> | undefined
    ) => {
        if (onChange) {
            onChange(event, value, reason, details);
        }

        if (reason === 'select-option') {
            handleDialogClose();
        }
    };

    const {
        getRootProps,
        getInputProps,
        getInputLabelProps,
        getPopupIndicatorProps,
        getClearProps,
        getTagProps,
        getListboxProps,
        getOptionProps,
        value,
        dirty,
        id,
        focused,
        focusedTag,
        inputValue,
        groupedOptions,
    } = useAutocomplete({
        ...props,
        onChange: handleChange,
        open: true,
        componentName: 'TouchAutocomplete',
    });

    const inputProps = getInputProps() as AutocompleteInputProps;

    const renderOption = renderOptionProp || getOptionLabel;

    const renderListOption = (option: any, index: number) => {
        // @todo types
        const optionProps = getOptionProps({ option, index }) as any;

        return (
            <li {...optionProps} className={classes.option}>
                {renderOption(option, {
                    selected: optionProps['aria-selected'],
                    inputValue,
                })}
            </li>
        );
    };

    const hasClearIcon = !disableClearable && !disabled;
    const showClearIcon = !!(value || inputValue) && hasClearIcon;

    const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
        if (onFocus) onFocus(event);

        inputProps.onFocus(event);
    };

    const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
        if (onBlur) onBlur(event);

        inputProps.onBlur(event);
    };

    // Autofocus on open dialog
    useEffect(() => {
        const input = inputProps.ref.current;

        if (dialogOpen && input) {
            input.focus();
            if (autoHighlight) input.select();
        }
    }, [dialogOpen]);

    return (
        <>
            {renderActivator({
                ...inputProps,
                onClick: handleDialogOpen,
            })}

            <div
                className={clsx(classes.dialog, {
                    [classes.dialogOpen]: dialogOpen,
                })}
                {...(getRootProps as any)(other)} // @todo types
            >
                <AppBar className={classes.appBar} color="inherit">
                    <Toolbar className={classes.toolbar}>
                        <div className={classes.search}>
                            <InputBase
                                id={id}
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput,
                                }}
                                value={value}
                                placeholder={placeholder}
                                fullWidth
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
                            onClick={handleDialogClose}
                        >
                            {closeText}
                        </Button>
                    </Toolbar>
                </AppBar>

                <PaperComponent className={classes.paper}>
                    {loading && groupedOptions.length === 0 ? (
                        <div className={classes.loading}>{loadingText}</div>
                    ) : null}
                    {groupedOptions.length === 0 &&
                    !freeSolo &&
                    !loading &&
                    noOptionsText ? (
                        <div className={classes.noOptions}>{noOptionsText}</div>
                    ) : null}
                    {groupedOptions.length > 0 ? (
                        <List
                            className={classes.listbox}
                            disablePadding
                            {...getListboxProps()}
                        >
                            {groupedOptions.map((option, index) => {
                                return renderListOption(option, index);
                            })}
                        </List>
                    ) : null}
                </PaperComponent>
            </div>
        </>
    );
});
