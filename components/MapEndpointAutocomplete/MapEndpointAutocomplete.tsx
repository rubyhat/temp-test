import React, { ChangeEvent, FC, MouseEvent, useState } from 'react';
import InputAdornment from '@material-ui/core/InputAdornment';
import CancelIcon from '@material-ui/icons/Cancel';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { TextField } from 'components/ui/TextField/TextField';
import { MapEndpointPickerDialog } from '../MapEndpointPickerDialog';
import { StopsDto } from 'swagger/client';
import { useTranslation } from 'i18n';
import { getCenterOfMass } from 'utils/map';
import { sortStopsByDatetime } from 'utils/ride';
import { HybridAutocomplete } from 'components/Autocomplete';
import { AtlasTheme } from 'typings/atlas-theme';
import { stopsClickAnalytics } from 'store/affiliates/actions';
import { useDispatch } from 'react-redux';
import { useSAAS } from 'hooks/useSAAS';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        mapActivator: {
            fontSize: theme.atlas.typography.body1.fontSize,
            color: theme.palette.primary.main,
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            borderLeft: `1px solid ${theme.atlas.palette.divider.default}`,
            padding: theme.spacing(1, 0, 1, 1),
        },
        clearIcon: {
            width: theme.spacing(5),
            height: theme.spacing(4),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: theme.atlas.palette.text.disabled,
        },
    }),
    { name: 'MapEndpointAutocomplete' }
);

type Props = {
    inputValue: string;
    onInputChange: (value: string) => void;
    value: StopsDto['id'] | null;
    onChange: (value: StopsDto['id'] | null) => void;
    mapValue: StopsDto['id'] | null;
    onMapValueChange: (value: StopsDto['id'] | null) => void;
    suggestions: StopsDto[];
    dialogTitle: string;
    placeholder?: string;
    showClearIcon?: boolean;
    sortByDatetime?: boolean;
    /**
     * Фильтровать D2D остановки (desktop не поддерживает d2d)
     */
    filterDynamicStops?: boolean;
};

export const MapEndpointAutocomplete: FC<Props> = props => {
    const {
        inputValue,
        value,
        mapValue,
        onInputChange,
        onChange,
        onMapValueChange,
        suggestions: suggestionsProp,
        dialogTitle,
        placeholder,
        showClearIcon,
        sortByDatetime,
        filterDynamicStops,
    } = props;
    const classes = useStyles();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { isCompas } = useSAAS();
    const isMapShown = !isCompas;

    const [dialogOpen, setDialogOpen] = useState(false);

    const handleDialogClose = () => {
        document.body.style.overflow = 'auto';
        setDialogOpen(false);
    };
    const handleDialogAccept = (id: StopsDto['id']) => {
        onChange(id);
        document.body.style.overflow = 'auto';
        setDialogOpen(false);
    };
    const handleMapIconClick = (e: MouseEvent) => {
        e.stopPropagation();
        document.body.style.overflow = 'hidden';
        setDialogOpen(true);
        dispatch(stopsClickAnalytics());
    };
    const handleClearIcon = (e: MouseEvent) => {
        e.stopPropagation();

        onInputChange('');
        onChange(null);
        onMapValueChange(null);
    };

    let suggestions = suggestionsProp;
    if (sortByDatetime) {
        suggestions = sortStopsByDatetime(suggestions);
    }
    if (filterDynamicStops) {
        suggestions = suggestions.filter(suggestion => !suggestion.dynamic);
    }

    let defaultLatitude, defaultLongitude;
    if (suggestions.length >= 2) {
        [defaultLatitude, defaultLongitude] = getCenterOfMass(suggestions);
    } else if (suggestions.length === 1) {
        defaultLatitude = suggestions[0].latitude;
        defaultLongitude = suggestions[0].longitude;
    }

    const handleChange = (event: ChangeEvent<{}>, value: StopsDto | null) => {
        onChange(value ? value.id : null);
    };
    const handleInputChange = (event: ChangeEvent<{}>, value: string) => {
        onInputChange(value);
    };

    const endAdornment = (
        <InputAdornment position="end">
            {showClearIcon ? (
                <div onClick={handleClearIcon} className={classes.clearIcon}>
                    <CancelIcon fontSize="small" />
                </div>
            ) : null}

            <div onClick={handleMapIconClick} className={classes.mapActivator}>
                {t('onTheMap')}
            </div>
        </InputAdornment>
    );

    const selectedStop =
        suggestions.find(suggestion => suggestion.id === value) || null;

    return (
        <>
            <HybridAutocomplete
                inputValue={inputValue}
                value={selectedStop}
                onChange={handleChange}
                onInputChange={handleInputChange}
                options={suggestions}
                getOptionLabel={option => option.desc}
                renderInput={params => (
                    <TextField
                        {...params}
                        fullWidth
                        variant="standard"
                        InputProps={
                            isMapShown
                                ? {
                                      ...params.InputProps,
                                      disableUnderline: true,
                                      endAdornment,
                                  }
                                : {
                                      ...params.InputProps,
                                      disableUnderline: true,
                                  }
                        }
                        placeholder={placeholder}
                        onClick={() => dispatch(stopsClickAnalytics())}
                    />
                )}
                renderActivator={params => (
                    <TextField
                        onClick={params.onClick}
                        value={params.value}
                        fullWidth
                        variant="standard"
                        InputProps={
                            isMapShown
                                ? {
                                      disableUnderline: true,
                                      endAdornment,
                                      inputProps: {
                                          readOnly: true,
                                      },
                                  }
                                : {
                                      disableUnderline: true,
                                      inputProps: {
                                          readOnly: true,
                                      },
                                  }
                        }
                        placeholder={placeholder}
                    />
                )}
                placeholder={placeholder}
                openOnFocus
                autoHighlight
                fullWidth
                noOptionsText={''}
            />

            <MapEndpointPickerDialog
                value={mapValue}
                endpoints={suggestions}
                open={dialogOpen}
                onClose={handleDialogClose}
                onChange={onMapValueChange}
                onAccept={handleDialogAccept}
                title={dialogTitle}
                defaultLatitude={defaultLatitude}
                defaultLongitude={defaultLongitude}
            />
        </>
    );
};
