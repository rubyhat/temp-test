import React, { FC, useEffect } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import { useDispatch, useSelector } from 'react-redux';

import { Button } from '../ui/Button';
import { ButtonGroup } from '../ui/ButtonGroup';
import { DesktopExpansionPanel } from '../DesktopExpansionPanel';
import { DesktopFiltersBar } from './DesktopFiltersBar';
import { FiltersState } from 'store/filters/types';
import { List } from '../ui/List/List';
import { MapEndpointAutocomplete } from '../MapEndpointAutocomplete';
import { RootState } from 'store';
import { SortbyButtonGroup } from '../Filters';
import { StopsDto } from 'swagger/client';
import { Typo } from 'components/Typo/Typo';
import { departureTimeValues } from 'components/FiltersDialog';
import {
    resetFilters,
    setFilters,
    updateDropoffFilter,
    updatePickupFilter,
} from 'store/filters/actions';
import { useTranslation } from 'i18n';
import { useSAAS } from 'hooks/useSAAS';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            backgroundColor: theme.atlas.palette.background.deepCold,
            borderRadius: theme.shape.borderRadius,
            boxShadow: theme.atlas.shadows.bottom,
        },
        /* Styles applied to the list item `div` element. */
        listItem: {},
        /* Styles applied to the `Button` component of departure `ButtonGroup` component. */
        departureButtonGroupButton: {
            borderRadius: '100px',
        },
    }),
    { name: 'DesktopFilters' }
);

type Props = {
    onReset?: () => void;
    dischargeStops?: StopsDto[];
    pickupStops?: StopsDto[];
    count: number;
};

export const DesktopFilters: FC<Props> = props => {
    const {
        onReset = () => {},
        dischargeStops = [],
        pickupStops = [],
        count,
    } = props;
    const classes = useStyles();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { isMioTaxi } = useSAAS();

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

    const handleFiltersReset = () => {
        onReset();
        dispatch(resetFilters());
    };

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

    return (
        <div className={classes.root}>
            {count ? (
                <DesktopFiltersBar
                    count={count}
                    showReset={isResetActive}
                    onReset={handleFiltersReset}
                />
            ) : null}

            <DesktopExpansionPanel
                defaultExpanded
                summary={<Typo>{t('search:pickupDropoffPoint')}</Typo>}
            >
                <List disablePadding>
                    <ListItem className={classes.listItem} disableGutters>
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
                            filterDynamicStops
                        />
                    </ListItem>

                    <Divider component="li" variant="fullWidth" />

                    <ListItem className={classes.listItem} disableGutters>
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
                            filterDynamicStops
                        />
                    </ListItem>
                </List>
            </DesktopExpansionPanel>

            <DesktopExpansionPanel
                defaultExpanded
                summary={
                    <Typo>
                        {isMioTaxi
                            ? t('search:departureTimeTaxi')
                            : t('search:departureTime')}
                    </Typo>
                }
            >
                <ButtonGroup
                    variant="outlined"
                    color="primary"
                    size="small"
                    fullWidth
                >
                    {departureTimeValues.map(value => (
                        <Button
                            className={classes.departureButtonGroupButton}
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
            </DesktopExpansionPanel>

            <DesktopExpansionPanel
                defaultExpanded
                summary={<Typo>{t('search:sortRides')}</Typo>}
            >
                <SortbyButtonGroup sortBy={sortBy} />
            </DesktopExpansionPanel>
        </div>
    );
};
