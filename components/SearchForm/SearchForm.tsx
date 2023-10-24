import React, {
    ChangeEvent,
    FC,
    useEffect,
    useRef,
    useState,
    MouseEvent,
} from 'react';
import Card from '@material-ui/core/Card';
import DateFnsUtils from '@date-io/date-fns';
import Divider from '@material-ui/core/Divider';
import Grid, { GridSize } from '@material-ui/core/Grid';
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import {
    AutocompleteChangeReason,
    AutocompleteInputChangeReason,
} from '@material-ui/lab/useAutocomplete';
import { useRouter } from 'next/router';

import { SuggestResultDto } from 'swagger/client';
import theme from 'themes/default';
import { Button } from '../ui/Button';
import { Suggest } from '../Suggest';
import { DatePicker } from 'components/ui/DatePicker/DatePicker';
import { TextField } from 'components/ui/TextField/TextField';
import { useStyles } from './styles';
import { SearchFormState, Suggestion } from 'store/search-form/types';
import {
    changeSearchForm,
    switchSearchForm,
    inputChangeSearchForm,
} from 'store/search-form/actions';
import { RootState } from 'store';
import { i18n, useTranslation } from 'i18n';
import { getLocale } from 'i18n/utils';
import { suggestionFetch } from 'store/suggestion/actions';
import { SuggestionState } from 'store/suggestion/types';
import { isCordova } from 'utils/platform';
import { ListSubheader } from 'components/ui/ListSubheader';
import { useSAAS } from 'hooks/useSAAS';

type Props = {
    onSubmit: () => void;
};

export const SearchForm: FC<Props> = props => {
    const { onSubmit } = props;
    const classes = useStyles();
    const { t } = useTranslation();
    const router = useRouter();
    const { isMioTaxi } = useSAAS();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md')) && !isCordova;
    const {
        fromValue,
        fromInputValue,
        toValue,
        toInputValue,
        date,
        time,
        passengers,
    } = useSelector<RootState, SearchFormState>(
        rootState => rootState.searchForm
    );
    const { data: fromSuggestions, userInput: fromUserInput } = useSelector<
        RootState,
        SuggestionState
    >(rootState => rootState.suggestionFrom);
    const { data: toSuggestions, userInput: toUserInput } = useSelector<
        RootState,
        SuggestionState
    >(rootState => rootState.suggestionTo);

    const dispatch = useDispatch();
    const isHome = router.pathname === '/';

    // form refs
    const departureRef = useRef<HTMLInputElement | null>(null);
    const arrivalRef = useRef<HTMLInputElement | null>(null);

    const [dateOpen, setDateOpen] = useState(false);
    const dateObject = date ? new Date(date) : null;
    const handleDateOpen = () => {
        document.body.style.overflow = 'auto';
        setDateOpen(true);
    };
    const handleDateClose = () => {
        document.body.style.overflow = 'auto';
        setDateOpen(false);
    };
    const handleDateChange = (date: Date | null) => {
        const dateString = date ? format(date, 'yyyy-MM-dd') : '';

        dispatch(
            changeSearchForm({
                date: dateString,
            })
        );
    };

    const handleSwitch = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        dispatch(switchSearchForm());
    };

    const handlePassengersChange = (e: ChangeEvent<{ value: unknown }>) => {
        dispatch(changeSearchForm({ passengers: e.target.value as string }));
    };

    const handleTimeChange = (e: ChangeEvent<{ value: unknown }>) => {
        dispatch(changeSearchForm({ time: e.target.value as string }));
    };

    // если время не меняли и делаем поиск, то выводит все рейсы у миотакси, ставим время подефолту
    React.useEffect(() => {
        isMioTaxi && dispatch(changeSearchForm({ time: '09:00' }));
    }, []);

    const handleSubmit = () => {
        if (fromValue && toValue && dateObject && passengers) {
            onSubmit();
        }
    };

    useEffect(() => {
        // Fetch all suggestions when mount
        dispatch(suggestionFetch('suggestionFrom', ''));
        dispatch(suggestionFetch('suggestionTo', ''));
    }, []);

    const renderDivider = () => (
        <Divider
            className={classes.divider}
            orientation={isDesktop ? 'vertical' : 'horizontal'}
        />
    );

    const setStatusBar = (theme: 'light' | 'dark') => {
        if (
            process.browser &&
            window.StatusBar &&
            window.cordova.platformId === 'ios'
        ) {
            switch (theme) {
                case 'light':
                    window.StatusBar.styleLightContent();
                    break;
                case 'dark':
                    window.StatusBar.styleDefault();
                    break;
            }
        }
    };

    const handleDepartureInputChange = (
        event: ChangeEvent<{}>,
        value: string,
        reason: AutocompleteInputChangeReason
    ) => {
        dispatch(
            inputChangeSearchForm({
                fromInputValue: value,
            })
        );

        if (reason === 'input') {
            dispatch(suggestionFetch('suggestionFrom', value));
        } else if (reason === 'reset' || reason === 'clear') {
            dispatch(suggestionFetch('suggestionFrom', ''));
        }
    };
    const handleDepartureChange = (
        event: ChangeEvent<{}>,
        value: Suggestion | null,
        reason: AutocompleteChangeReason
    ) => {
        dispatch(
            changeSearchForm({
                fromValue: value,
            })
        );

        if (reason === 'select-option' || reason === 'clear') {
            dispatch(suggestionFetch('suggestionFrom', ''));
        }

        if (reason === 'select-option') {
            dispatch(suggestionFetch('suggestionTo', ''));
        }

        // Forward focus to arrival suggest
        if (reason === 'select-option' && isHome && isDesktop) {
            if (arrivalRef.current) arrivalRef.current.focus();
        }
    };

    const handleArrivalInputChange = (
        event: ChangeEvent<{}>,
        value: string,
        reason: AutocompleteInputChangeReason
    ) => {
        dispatch(
            inputChangeSearchForm({
                toInputValue: value,
            })
        );

        if (reason === 'input') {
            dispatch(suggestionFetch('suggestionTo', value));
        } else if (reason === 'reset' || reason === 'clear') {
            dispatch(suggestionFetch('suggestionTo', ''));
        }
    };
    const handleArrivalChange = (
        event: ChangeEvent<{}>,
        value: Suggestion | null,
        reason: AutocompleteChangeReason
    ) => {
        dispatch(
            changeSearchForm({
                toValue: value,
            })
        );

        if (reason === 'select-option' || reason === 'clear') {
            dispatch(suggestionFetch('suggestionTo', ''));
        }

        // Forward focus to DatePicker
        if (reason === 'select-option' && isHome && isDesktop) {
            if (arrivalRef.current) arrivalRef.current.blur();
            handleDateOpen();
        }
    };

    const dateMioList = () => {
        const today = new Date();
        const tomorrow = new Date().setDate(today.getDate() + 1);

        const todayFormatted = format(today, 'yyyy-MM-dd');
        const tomorrowFormatted = format(tomorrow, 'yyyy-MM-dd');

        return [
            { text: 'Сегодня', date: todayFormatted },
            { text: 'Завтра', date: tomorrowFormatted },
        ];
    };

    const handleDateChangeMioTaxi = (e: ChangeEvent<{ value: any }>) => {
        const value = Number(e.target.value);
        setMioDate(value);

        dispatch(
            changeSearchForm({
                date: dateMioList()[value].date,
            })
        );
    };
    const [mioDate, setMioDate] = React.useState(0);

    return (
        <Card className={classes.card}>
            <Grid container>
                <Grid
                    item
                    xs={12}
                    md={breakpoint(10)}
                    className={classes.inputContainer}
                >
                    <Grid container>
                        <Grid item xs={12} md={breakpoint(3)}>
                            <Grid
                                container={isDesktop}
                                wrap={isDesktop ? 'nowrap' : undefined}
                            >
                                <Suggest
                                    ref={departureRef}
                                    inputValue={fromInputValue}
                                    onInputChange={handleDepartureInputChange}
                                    value={fromValue}
                                    onChange={handleDepartureChange}
                                    suggestions={fromSuggestions}
                                    label={t('search:fromPoint')}
                                    onFocus={() => setStatusBar('light')}
                                    onBlur={() => setStatusBar('dark')}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={handleSwitch}
                                                color="primary"
                                                edge="end"
                                            >
                                                <CompareArrowsIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    locationHash="#suggest-from"
                                />

                                {renderDivider()}
                            </Grid>
                        </Grid>

                        <Grid item xs={12} md={breakpoint(3)}>
                            <Grid
                                container={isDesktop}
                                wrap={isDesktop ? 'nowrap' : undefined}
                            >
                                <Suggest
                                    ref={arrivalRef}
                                    inputValue={toInputValue}
                                    onInputChange={handleArrivalInputChange}
                                    value={toValue}
                                    onChange={handleArrivalChange}
                                    suggestions={toSuggestions}
                                    label={t('search:toPoint')}
                                    onFocus={() => setStatusBar('light')}
                                    onBlur={() => setStatusBar('dark')}
                                    locationHash="#suggest-to"
                                />

                                {renderDivider()}
                            </Grid>
                        </Grid>

                        <Divider />
                        {isMioTaxi ? (
                            <>
                                <Grid item xs={6} md={breakpoint(2)}>
                                    <FormControl
                                        variant="filled"
                                        fullWidth
                                        className={classes.passengersSelect}
                                    >
                                        <InputLabel htmlFor="mioDate">
                                            Дата
                                        </InputLabel>
                                        <Select
                                            native
                                            value={mioDate}
                                            onChange={handleDateChangeMioTaxi}
                                            inputProps={{
                                                id: 'mioDate',
                                                name: 'mioDate',
                                            }}
                                            disableUnderline
                                            fullWidth
                                        >
                                            {dateMioList().map(
                                                (item, index) => (
                                                    <option
                                                        key={index}
                                                        value={index}
                                                    >
                                                        {item.text}
                                                    </option>
                                                )
                                            )}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                {/* <Divider
                                    orientation="vertical"
                                    className={classes.divider}
                                /> */}
                                {/* Time Picker */}
                                <Grid item xs={6} md={breakpoint(2)}>
                                    <Grid container wrap="nowrap">
                                        <MuiPickersUtilsProvider
                                            utils={DateFnsUtils}
                                            locale={
                                                i18n.language &&
                                                getLocale(i18n.language)
                                            }
                                        >
                                            <div
                                                style={{
                                                    width: '100%',
                                                    padding: '8px 12px 10px',
                                                }}
                                            >
                                                <TextField
                                                    onChange={handleTimeChange}
                                                    value={time}
                                                    id="time"
                                                    style={{ width: '100%' }}
                                                    label="Время"
                                                    type="time"
                                                    defaultValue="09:00"
                                                    InputProps={{
                                                        disableUnderline: true,
                                                    }}
                                                    inputProps={{
                                                        step: 300, // 5 min
                                                    }}
                                                />
                                            </div>
                                        </MuiPickersUtilsProvider>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} md={breakpoint(2)}>
                                    <Grid
                                        container={isDesktop}
                                        wrap={isDesktop ? 'nowrap' : undefined}
                                    >
                                        {renderDivider()}
                                        <FormControl
                                            variant="filled"
                                            fullWidth
                                            className={classes.passengersSelect}
                                        >
                                            <InputLabel htmlFor="passengers">
                                                {/* {t('search:passengers')} */}
                                                Количество мест
                                            </InputLabel>
                                            <Select
                                                native
                                                value={passengers}
                                                onChange={
                                                    handlePassengersChange
                                                }
                                                inputProps={{
                                                    name: 'passengers',
                                                    id: 'passengers',
                                                }}
                                                disableUnderline
                                                fullWidth
                                            >
                                                {[1, 2, 3, 4, 5, 6, 7, 8].map(
                                                    value => (
                                                        <option
                                                            value={value}
                                                            key={value}
                                                        >
                                                            {value}{' '}
                                                            {t('search:seat', {
                                                                count: value,
                                                            })}
                                                        </option>
                                                    )
                                                )}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </>
                        ) : (
                            <>
                                <Grid item xs={6} md={breakpoint(3)}>
                                    <Grid container wrap="nowrap">
                                        <MuiPickersUtilsProvider
                                            utils={DateFnsUtils}
                                            locale={
                                                i18n.language &&
                                                getLocale(i18n.language)
                                            }
                                        >
                                            <div style={{ width: '100%' }}>
                                                <DatePicker
                                                    open={dateOpen}
                                                    value={dateObject}
                                                    onOpen={handleDateOpen}
                                                    onClose={handleDateClose}
                                                    onChange={handleDateChange}
                                                    onAccept={handleDateClose}
                                                    variant="inline"
                                                    label={t('search:date')}
                                                    inputVariant="filled"
                                                    InputProps={{
                                                        disableUnderline: true,
                                                    }}
                                                    TextFieldComponent={
                                                        TextField
                                                    }
                                                    fullWidth
                                                    disablePast
                                                />
                                            </div>
                                        </MuiPickersUtilsProvider>
                                        <Divider
                                            orientation="vertical"
                                            style={{
                                                height: 'inherit',
                                                marginTop: 8,
                                                marginBottom: 8,
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item xs={6} md={breakpoint(3)}>
                                    <FormControl
                                        variant="filled"
                                        fullWidth
                                        className={classes.passengersSelect}
                                    >
                                        <InputLabel htmlFor="passengers">
                                            {t('search:passengers')}
                                        </InputLabel>
                                        <Select
                                            native
                                            value={passengers}
                                            onChange={handlePassengersChange}
                                            inputProps={{
                                                name: 'passengers',
                                                id: 'passengers',
                                            }}
                                            disableUnderline
                                            fullWidth
                                        >
                                            {[1, 2, 3, 4, 5].map(value => (
                                                <option
                                                    value={value}
                                                    key={value}
                                                >
                                                    {value}{' '}
                                                    {t('search:passenger', {
                                                        count: value,
                                                    })}
                                                </option>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </>
                        )}
                    </Grid>
                </Grid>

                <Grid item xs={12} md={breakpoint(2)}>
                    <Button
                        onClick={handleSubmit}
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        fullWidth
                        height="100%"
                        size="large"
                    >
                        {t('search:find')}
                    </Button>
                </Grid>
            </Grid>
        </Card>
    );
};

const breakpoint = (size: GridSize) => (isCordova ? false : size);
