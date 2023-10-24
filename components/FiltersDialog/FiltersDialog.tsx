import React, { FC, useEffect } from 'react';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';

import { Button } from '../ui/Button';
import { ButtonGroup } from '../ui/ButtonGroup';
import { FiltersBar } from '../FiltersBar';
import { List } from '../ui/List/List';
import { ListSubheader } from '../ui/ListSubheader';
import { ResponsiveDialog } from '../ui/ResponsiveDialog';
import { StopsDto } from 'swagger/client';
import { MapEndpointAutocomplete } from '../MapEndpointAutocomplete';
import { RootState } from 'store';
import { FiltersState } from 'store/filters/types';
import {
    resetFilters,
    setFilters,
    updateDropoffFilter,
    updatePickupFilter,
} from 'store/filters/actions';
import { useTranslation } from 'i18n';
import { SortbyButtonGroup } from 'components/Filters/SortbyButtonGroup';
import { useSAAS } from 'hooks/useSAAS';

const useStyles = makeStyles(
    {
        root: {},
        waypointListItem: {
            paddingTop: 12,
            paddingBottom: 12,
        },
    },
    { name: 'FiltersDialog' }
);

export type SubmitData = {};

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: SubmitData) => void;
    onReset?: () => void;
    dischargeStops?: StopsDto[];
    pickupStops?: StopsDto[];
};

type DepartureTimeValues = Array<Exclude<FiltersState['departureTime'], null>>;

export const departureTimeValues: DepartureTimeValues = [
    'night',
    'morning',
    'afternoon',
    'evening',
];

export const FiltersDialog: FC<Props> = props => {
    const {
        open,
        onClose,
        onSubmit,
        onReset = () => {},
        pickupStops = [],
        dischargeStops = [],
    } = props;

    const {
        pickupInputValue,
        pickupValue,
        pickupMapValue,
        dropoffInputValue,
        dropoffValue,
        dropoffMapValue,
        departureTime,
        sortBy,
    } = useSelector<RootState, FiltersState>(state => state.filters);
    const dispatch = useDispatch();

    const classes = useStyles();
    const { t } = useTranslation();
    const { isMioTaxi } = useSAAS();

    const handleFiltersReset = () => {
        onReset();
        dispatch(resetFilters());
    };
    const handleFiltersSubmit = () => onSubmit({});
    const handleAutocompleteChange = (keyName: keyof FiltersState) => (
        value: FiltersState[typeof keyName]
    ) => {
        dispatch(
            setFilters({
                [keyName]: value,
            })
        );
    };

    const handlePickupValueChange = (stopId: StopsDto['id'] | null) => {
        dispatch(updatePickupFilter(stopId));
    };
    const handleDropoffValueChange = (stopId: StopsDto['id'] | null) => {
        dispatch(updateDropoffFilter(stopId));
    };

    useEffect(() => {
        const stop = pickupStops.find(stop => stop.id === pickupValue);
        dispatch(
            setFilters({
                pickupValue: stop ? stop.id : '',
            })
        );
    }, [pickupValue]);
    useEffect(() => {
        const stop = dischargeStops.find(stop => stop.id === dropoffValue);
        dispatch(
            setFilters({
                dropoffValue: stop ? stop.id : '',
            })
        );
    }, [dropoffValue]);

    const handleDepartureTimeClick = (
        value: FiltersState['departureTime']
    ) => () => {
        dispatch(
            setFilters({
                departureTime: value,
            })
        );
    };

    const isResetActive =
        !!pickupValue ||
        !!dropoffValue ||
        !!pickupInputValue ||
        !!dropoffInputValue ||
        !!departureTime ||
        !!sortBy;

    return (
        <ResponsiveDialog
            open={open}
            onClose={onClose}
            paddingBottom
            BarComponent={
                <FiltersBar
                    onClose={onClose}
                    onReset={handleFiltersReset}
                    showReset={isResetActive}
                />
            }
        >
            <div className={classes.root}>
                <List
                    disablePadding
                    subheader={
                        <ListSubheader>
                            {t('search:pickupDropoffPoint')}
                        </ListSubheader>
                    }
                >
                    <ListItem className={classes.waypointListItem}>
                        <MapEndpointAutocomplete
                            inputValue={pickupInputValue}
                            onInputChange={handleAutocompleteChange(
                                'pickupInputValue'
                            )}
                            value={pickupValue}
                            onChange={handlePickupValueChange}
                            mapValue={pickupMapValue}
                            onMapValueChange={handleAutocompleteChange(
                                'pickupMapValue'
                            )}
                            suggestions={pickupStops}
                            dialogTitle={
                                isMioTaxi
                                    ? t('booking:selectPickupPointTaxi')
                                    : t('booking:selectPickupPoint')
                            }
                            placeholder={t('search:pickup')}
                            showClearIcon
                        />
                    </ListItem>

                    <Divider component="li" variant="middle" />

                    <ListItem className={classes.waypointListItem}>
                        <MapEndpointAutocomplete
                            inputValue={dropoffInputValue}
                            onInputChange={handleAutocompleteChange(
                                'dropoffInputValue'
                            )}
                            value={dropoffValue}
                            onChange={handleDropoffValueChange}
                            mapValue={dropoffMapValue}
                            onMapValueChange={handleAutocompleteChange(
                                'dropoffMapValue'
                            )}
                            suggestions={dischargeStops}
                            dialogTitle={t('search:selectDropoffPoint')}
                            placeholder={t('search:dropoff')}
                            showClearIcon
                        />
                    </ListItem>
                </List>

                {/*<List
                    subheader={
                        <ListSubheader component="div">
                            {t('search:transfer')}
                        </ListSubheader>
                    }
                >
                    <ListItem>
                        <ButtonGroup
                            variant="outlined"
                            color="primary"
                            size="small"
                            fullWidth
                        >
                            <Button height="100%">{t('search:direct')}</Button>
                            <Button height="100%">1</Button>
                            <Button height="100%">2+</Button>
                        </ButtonGroup>
                    </ListItem>
                </List>*/}

                <List
                    subheader={
                        <ListSubheader>
                            {isMioTaxi
                                ? t('search:departureTimeTaxi')
                                : t('search:departureTime')}
                        </ListSubheader>
                    }
                >
                    <ListItem>
                        <ButtonGroup
                            variant="outlined"
                            color="primary"
                            size="small"
                            fullWidth
                        >
                            {departureTimeValues.map(value => (
                                <Button
                                    height="100%"
                                    key={value}
                                    onClick={handleDepartureTimeClick(value)}
                                    variant={
                                        value === departureTime
                                            ? 'contained'
                                            : 'outlined'
                                    }
                                >
                                    {t(`search:${value}`)}
                                </Button>
                            ))}
                        </ButtonGroup>
                    </ListItem>
                </List>

                <List
                    subheader={
                        <ListSubheader>{t('search:sortRides')}</ListSubheader>
                    }
                >
                    <ListItem>
                        <SortbyButtonGroup sortBy={sortBy} />
                    </ListItem>
                </List>

                <List>
                    <ListItem>
                        <Button
                            color="primary"
                            variant="contained"
                            fullWidth
                            onClick={handleFiltersSubmit}
                        >
                            {t('search:showResults')}
                        </Button>
                    </ListItem>
                </List>
            </div>
        </ResponsiveDialog>
    );
};
