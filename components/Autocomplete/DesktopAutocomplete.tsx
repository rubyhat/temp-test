import React from 'react';
import { fade, makeStyles, Theme } from '@material-ui/core/styles';
import { AutocompleteProps } from '@material-ui/lab';
import useAutocomplete from '@material-ui/lab/useAutocomplete';
import clsx from 'clsx';
import CloseIcon from '@material-ui/icons/Close';
import Popper from '@material-ui/core/Popper';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Paper from '@material-ui/core/Paper';
import { AutocompleteRenderInputParams } from '@material-ui/lab/Autocomplete/Autocomplete';

import { useTranslation } from 'i18n';

const useStyles = makeStyles(
    (theme: Theme) => ({
        /* Styles applied to the root element. */
        root: {
            '&$focused $clearIndicatorDirty': {
                visibility: 'visible',
            },
            /* Avoid double tap issue on iOS */
            '@media (pointer: fine)': {
                '&:hover $clearIndicatorDirty': {
                    visibility: 'visible',
                },
            },
        },
        /* Styles applied to the root element if `fullWidth={true}`. */
        fullWidth: {
            width: '100%',
        },
        /* Pseudo-class applied to the root element if focused. */
        focused: {},
        /* Styles applied to the tag elements, e.g. the chips. */
        tag: {
            margin: 3,
            maxWidth: 'calc(100% - 6px)',
        },
        /* Styles applied to the tag elements, e.g. the chips if `size="small"`. */
        tagSizeSmall: {
            margin: 2,
            maxWidth: 'calc(100% - 4px)',
        },
        /* Styles applied when the popup icon is rendered. */
        hasPopupIcon: {},
        /* Styles applied when the clear icon is rendered. */
        hasClearIcon: {},
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
        /* Styles applied to the popper element. */
        popper: {
            zIndex: theme.zIndex.modal,
        },
        /* Styles applied to the popper element if `disablePortal={true}`. */
        popperDisablePortal: {
            position: 'absolute',
        },
        /* Styles applied to the `Paper` component. */
        paper: {
            ...theme.typography.body1,
            overflow: 'hidden',
            margin: '4px 0',
        },
        /* Styles applied to the `listbox` component. */
        listbox: {
            listStyle: 'none',
            margin: 0,
            padding: '8px 0',
            maxHeight: '40vh',
            overflow: 'auto',
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
    }),
    { name: 'DesktopAutocomplete' }
);

export type DesktopAutocompleteProps<
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
    renderInput: (params: AutocompleteRenderInputParams) => React.ReactNode;
};

export const DesktopAutocomplete = React.forwardRef<
    unknown,
    DesktopAutocompleteProps
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
        closeText = 'Close',
        debug = false,
        defaultValue = null,
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
        onChange,
        onClose,
        onHighlightChange,
        onInputChange,
        onOpen,
        openOnFocus = false,
        openText = 'Open',
        options,
        PaperComponent = Paper,
        PopperComponent: PopperComponentProp = Popper,
        popupIcon = <ArrowDropDownIcon />,
        renderInput,
        renderOption: renderOptionProp,
        renderTags,
        selectOnFocus = !props.freeSolo,
        size = 'medium',
        value: valueProp,
        ...other
    } = props;

    const PopperComponent = PopperComponentProp;

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
        popupOpen,
        focused,
        focusedTag,
        anchorEl,
        setAnchorEl,
        inputValue,
        groupedOptions,
    } = useAutocomplete({ ...props, componentName: 'DesktopAutocomplete' });

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
    const hasPopupIcon =
        (!freeSolo || forcePopupIcon === true) && forcePopupIcon !== false;

    return (
        <React.Fragment>
            <div
                ref={ref}
                className={clsx(
                    classes.root,
                    {
                        [classes.focused]: focused,
                        [classes.fullWidth]: fullWidth,
                        [classes.hasClearIcon]: hasClearIcon,
                        [classes.hasPopupIcon]: hasPopupIcon,
                    },
                    className
                )}
                {...(getRootProps as any)(other)} // @todo types
            >
                {renderInput({
                    id,
                    disabled,
                    fullWidth: true,
                    size: size === 'small' ? 'small' : undefined,
                    InputLabelProps: getInputLabelProps(),
                    InputProps: {
                        ref: setAnchorEl,
                        className: '',
                        startAdornment: null,
                        endAdornment: null,
                    },
                    inputProps: {
                        className: clsx(classes.input, {
                            [classes.inputFocused]: focusedTag === -1,
                        }),
                        disabled,
                        ...getInputProps(),
                    },
                })}
            </div>
            {popupOpen && anchorEl ? (
                <PopperComponent
                    className={clsx(classes.popper)}
                    style={{
                        width: anchorEl ? anchorEl.clientWidth : undefined,
                    }}
                    role="presentation"
                    anchorEl={anchorEl}
                    open
                >
                    <PaperComponent className={classes.paper}>
                        {loading && groupedOptions.length === 0 ? (
                            <div className={classes.loading}>{loadingText}</div>
                        ) : null}
                        {groupedOptions.length === 0 &&
                        !freeSolo &&
                        !loading &&
                        noOptionsText ? (
                            <div className={classes.noOptions}>
                                {noOptionsText}
                            </div>
                        ) : null}
                        {groupedOptions.length > 0 ? (
                            <ListboxComponent
                                className={classes.listbox}
                                {...getListboxProps()}
                                {...ListboxProps}
                            >
                                {groupedOptions.map((option, index) => {
                                    return renderListOption(option, index);
                                })}
                            </ListboxComponent>
                        ) : null}
                    </PaperComponent>
                </PopperComponent>
            ) : null}
        </React.Fragment>
    );
});
