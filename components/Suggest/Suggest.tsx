import React, { ReactNode, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import Slide, { SlideProps } from '@material-ui/core/Slide';
import {
    AutocompleteProps,
    AutocompleteRenderGroupParams,
} from '@material-ui/lab/Autocomplete';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { DesktopSuggest } from './DesktopSuggest';
import { MobileSuggest } from './MobileSuggest';
import { Suggestion } from 'store/search-form/types';
import { TextField } from '../ui/TextField/TextField';
import { usePlatform } from 'hooks/usePlatform';
import { useTranslation } from 'i18n';
import { createFilterOptions } from 'utils/createFilterOptions';
import { useDialogHash } from 'hooks/useDialogHash';

const Transition = React.forwardRef<unknown, SlideProps>(function Transition(
    props,
    ref
) {
    return <Slide direction="up" ref={ref} {...props} />;
});
Transition.displayName = 'Transition';

const filterOptions = createFilterOptions();

const useStyles = makeStyles(
    (theme: Theme) => ({
        /* Styles applied to the root element. */
        root: {},
        /* Styles applied to the `ul` renderGroup. */
        ul: {
            // reset user agent stylesheet `padding-inline-start: 40px;`
            padding: 0,
        },
        groupName: {
            padding: `14px 16px 8px`,
            ...theme.typography.caption,
            fontWeight: 700,
            color: theme.palette.text.disabled,
        },
    }),
    { name: 'Suggest' }
);

type SuggestProps<T = Suggestion> = {
    value: T | null;
    onChange: AutocompleteProps<T, false, false, false>['onChange'];
    inputValue: string;
    onInputChange: AutocompleteProps<T, false, false, false>['onInputChange'];
    suggestions: T[];
    label?: string;
    onFocus?: AutocompleteProps<T, false, false, false>['onFocus'];
    onBlur?: AutocompleteProps<T, false, false, false>['onBlur'];
    endAdornment?: ReactNode;
    onClear?: () => void;
    cancelButtonLabel?: string;
    /* Значение для window.location.hash */
    locationHash: string;
};

export const Suggest = React.forwardRef<HTMLInputElement, SuggestProps>(
    function Suggest(props, ref) {
        const {
            onClear,
            cancelButtonLabel,
            endAdornment,
            inputValue,
            label,
            locationHash,
            ...other
        } = props;
        const { isCordova, isMobile } = usePlatform();
        const { t } = useTranslation();
        const classes = useStyles();

        // TODO: Исправить функцианальность useDialogHash
        const [open, setOpen] = useState(false);
        const handleClose = () => {
            document.body.style.overflow = 'auto';
            setOpen(false);
        };
        const handleOpen = () => {
            document.body.style.overflow = 'hidden';
            setOpen(true);
        };

        const renderGroup = (params: AutocompleteRenderGroupParams) => (
            <li key={params.key}>
                <div className={classes.groupName}>{params.group}</div>
                <ul className={classes.ul}>{params.children}</ul>
            </li>
        );

        if (isCordova || isMobile) {
            return (
                <>
                    <TextField
                        value={inputValue}
                        label={label}
                        fullWidth
                        variant="filled"
                        InputProps={{
                            disableUnderline: true,
                            readOnly: true,
                            endAdornment,
                        }}
                        inputProps={{
                            onClick: handleOpen,
                        }}
                    />

                    <Dialog
                        disableScrollLock
                        fullScreen
                        open={open}
                        onClose={handleClose}
                    >
                        <MobileSuggest
                            inputValue={inputValue}
                            label={label}
                            onClear={onClear}
                            cancelButtonLabel={t('cancel')}
                            onClose={handleClose}
                            renderGroup={renderGroup}
                            groupBy={() => t('nearYou')}
                            filterOptions={filterOptions}
                            {...other}
                            autoSelect
                        />
                    </Dialog>
                </>
            );
        }

        return (
            <DesktopSuggest
                inputValue={inputValue}
                label={label}
                renderGroup={renderGroup}
                groupBy={() => t('nearYou')}
                filterOptions={filterOptions}
                endAdornment={endAdornment}
                {...other}
                ref={ref}
            />
        );
    }
);
