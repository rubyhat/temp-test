import React, { ChangeEvent, FC, useEffect, useRef } from 'react';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import camelCase from 'lodash/camelCase';
import clsx from 'clsx';
import throttle from 'lodash/throttle';
import upperFirst from 'lodash/upperFirst';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useFormik } from 'formik';

import { DesktopAutocomplete } from 'components/Autocomplete';
import { DateInput } from '../DateInput';
import { DocumentInput } from '../DocumentInput';
import { DocumentSelect } from '../DocumentSelect';
import { GenderSegmented } from '../GenderSegmented';
import { PassengerFormData } from '../NewPassenger';
import { Props as NewPassengerProps } from '../NewPassenger';
import { TextField } from 'components/ui/TextField/TextField';
import { TicketTypeSelect } from '../TicketTypeSelect';
import { Typo } from 'components/Typo/Typo';
import { documentTextMask } from 'utils/documents';
import { isDocumentTypeNumeric, validate } from '../NewPassengerDialog';
import { setFormikValues } from '../NewPassengerDialog/useSavedPassengers';
import { useCitizenship } from '../NewPassengerDialog/useCitizenship';
import { i18n, useTranslation } from 'i18n';
import { AtlasTheme } from 'typings/atlas-theme';
import { RootState } from 'store';
import { BookingState } from 'store/booking/types';
import { useSelector } from 'react-redux';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            backgroundColor: '#FFF',
            borderRadius: theme.shape.borderRadius,
            boxShadow: theme.atlas.shadows.bottom,
        },
        /* Styles applied to the section `div` element. */
        section: {
            padding: theme.spacing(3),
        },
        /* Styles applied to the heading section `div` element. */
        heading: {
            display: 'flex',
            alignItems: 'center',
        },
        spacer: {
            flexGrow: 1,
        },
        gridListTile: {
            overflow: 'visible',
            // @todo баг с исчезающим верхним бордером у TextField с `variant="outlined"`
        },
        ticketTypeSelect: {
            marginLeft: theme.spacing(2),
        },
        select: {
            height: '48.974px',
        },
    }),
    { name: 'DesktopNewPassenger' }
);

type Props = NewPassengerProps;

export const DesktopNewPassenger: FC<Props> = props => {
    const {
        ticketTypes,
        docTypes,
        genderTypes,
        bookFields = [],
        onSubmit,
        title,
        initialData = null,
        className,
        currency,
        documents = [],
        handleTicketPriceChange,
        paymentTypes,
    } = props;
    const classes = useStyles();
    const { t } = useTranslation();
    const { fireFormValidate } = useSelector<RootState, BookingState>(
        rootState => rootState.booking
    );

    const resetValues = {
        id: 0,
        lastName: '',
        firstName: '',
        middleName: '',
        birthDate: '',
        genderCode: bookFields.includes('gender') ? genderTypes[0].code : '',
        docTypeCode: bookFields.includes('document') ? docTypes[0].code : '',
        ticketTypeCode: ticketTypes[0].code,
        docNumber: '',
        citizenshipCode: '',
    };
    const initialValues = {
        ...resetValues,
        ...initialData,
    };
    const formik = useFormik<PassengerFormData>({
        initialValues,
        onSubmit: values => {
            onSubmit({
                ...values,
            });
        },
        validate: values => validate(values, bookFields),
        validateOnChange: false,
    });

    const bookfieldsLength = bookFields.filter(f => f !== 'phone').length;

    const gridItemSizes: Record<string, number> = {
        md: bookfieldsLength >= 3 ? 4 : bookfieldsLength === 2 ? 6 : 12,
        sm: 6,
    };

    const docMask = documentTextMask[formik.values.docTypeCode] || false;
    const isDocNumeric = isDocumentTypeNumeric(formik.values.docTypeCode);

    const handleDocTypeCodeChange = (
        e: ChangeEvent<{ name?: string | undefined; value: unknown }>
    ) => {
        // Очищаем инпут с номером документа чтобы
        // новая маска не применилась к старому документу
        formik.setFieldValue('docNumber', '', false);

        formik.handleChange(e);
    };

    const handleGenderChange = (genderCode: string) => {
        formik.setFieldValue('genderCode', genderCode);
    };

    const {
        countries,
        selectedCountry,
        countryInputValue,
        handleCountryInputValueChange,
        handleCountryValueChange,
        renderSuggestion,
        getSuggestionLabel,
        getSuggestionValue,
    } = useCitizenship<typeof formik>({ formik, open: false }); // @todo open false

    // Ticket type
    const handleTicketTypeChange = (ticketCode: string) => {
        formik.setFieldValue('ticketTypeCode', ticketCode);

        if (handleTicketPriceChange) {
            const ticket = ticketTypes.find(
                ticket => ticket.code === ticketCode
            );

            if (ticket) {
                handleTicketPriceChange(ticket);
            }
        }
    };

    // Auto submit form to Redux when all inputs completed
    const submitForm = useRef(
        throttle(async () => {
            const errors = await formik.validateForm();
            const errorsCount = Object.keys(errors).length;
            if (errorsCount === 0) {
                await formik.submitForm();
            } else {
                onSubmit(null);
            }
        }, 1000)
    );

    const mounted = useRef(false);
    useEffect(() => {
        // не делать submit формы сразу после
        // автозаполнения сохраненного документа
        if (mounted.current) submitForm.current();
    }, [formik.values]);

    useEffect(() => {
        mounted.current = true;
    }, []);

    const handleSavedPassengerChange = (index: number) => {
        setFormikValues(formik, documents[index]);
    };

    const resetFormikValues = () => {
        formik.setValues({ ...resetValues });
    };

    const errorHelperText = (key?: string) => {
        return key && i18n.exists(key) ? t(key) : undefined;
    };

    React.useEffect(() => {
        if (fireFormValidate) formik.validateForm();
    }, [fireFormValidate]);

    return (
        <div className={clsx(classes.root, className)}>
            <div className={clsx(classes.section, classes.heading)}>
                <Typo variant="subtitle" weight="bold">
                    {title}
                </Typo>

                <div className={classes.spacer} />

                {documents.length ? (
                    <DocumentSelect
                        onChange={handleSavedPassengerChange}
                        onNewPassenger={resetFormikValues}
                        documents={documents}
                        fullWidth
                    />
                ) : null}

                <TicketTypeSelect
                    className={classes.ticketTypeSelect}
                    value={formik.values.ticketTypeCode}
                    onChange={handleTicketTypeChange}
                    ticketTypes={ticketTypes}
                    currency={currency}
                    fullWidth
                    paymentTypes={paymentTypes}
                />
            </div>
            <Divider variant="fullWidth" />
            <div className={classes.section}>
                <Grid container spacing={2}>
                    {bookFields.includes('name') ? (
                        <Grid item {...gridItemSizes}>
                            <TextField
                                name="firstName"
                                value={formik.values.firstName}
                                onChange={formik.handleChange}
                                placeholder={t('booking:firstName')}
                                label={t('booking:firstName')}
                                variant="standard"
                                fullWidth
                                error={!!formik.errors.firstName}
                                helperText={errorHelperText(
                                    formik.errors.firstName
                                )}
                            />
                        </Grid>
                    ) : null}

                    {bookFields.includes('patronymic') ? (
                        <Grid item {...gridItemSizes}>
                            <TextField
                                name="middleName"
                                value={formik.values.middleName}
                                onChange={formik.handleChange}
                                placeholder={t('booking:middleName')}
                                label={t('booking:middleName')}
                                variant="standard"
                                fullWidth
                                helperText={errorHelperText(
                                    formik.errors.middleName
                                )}
                            />
                        </Grid>
                    ) : null}

                    {bookFields.includes('surname') ? (
                        <Grid item {...gridItemSizes}>
                            <TextField
                                name="lastName"
                                value={formik.values.lastName}
                                onChange={formik.handleChange}
                                placeholder={t('booking:lastName')}
                                label={t('booking:lastName')}
                                variant="standard"
                                fullWidth
                                error={!!formik.errors.lastName}
                                helperText={errorHelperText(
                                    formik.errors.lastName
                                )}
                            />
                        </Grid>
                    ) : null}

                    {bookFields.includes('gender') ? (
                        <Grid item {...gridItemSizes}>
                            <GenderSegmented
                                className={classes.select}
                                variant="select"
                                value={formik.values.genderCode}
                                onChange={handleGenderChange}
                                genderTypes={genderTypes}
                            />
                        </Grid>
                    ) : null}

                    {bookFields.includes('birthDate') ? (
                        <Grid item {...gridItemSizes}>
                            <TextField
                                name="birthDate"
                                placeholder={t('booking:birthDate')}
                                label={t('booking:birthDate')}
                                fullWidth
                                InputProps={{
                                    value: formik.values.birthDate,
                                    onChange: formik.handleChange,
                                    inputComponent: DateInput,
                                }}
                                inputProps={{
                                    inputMode: 'numeric',
                                    pattern: '[0-9.]*',
                                }}
                                variant="standard"
                                helperText={errorHelperText(
                                    formik.errors.birthDate
                                )}
                            />
                        </Grid>
                    ) : null}

                    {bookFields.includes('citizenship') ? (
                        <Grid item {...gridItemSizes}>
                            <DesktopAutocomplete
                                inputValue={countryInputValue}
                                value={selectedCountry}
                                onChange={handleCountryValueChange}
                                onInputChange={handleCountryInputValueChange}
                                options={countries}
                                getOptionLabel={getSuggestionLabel}
                                renderInput={params => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                        variant="standard"
                                        InputProps={{
                                            ...params.InputProps,
                                        }}
                                        label={t('booking:citizenship')}
                                    />
                                )}
                                openOnFocus
                                autoHighlight
                                noOptionsText={''}
                            />
                        </Grid>
                    ) : null}

                    {bookFields.includes('document') ? (
                        <Grid item {...gridItemSizes}>
                            <Select
                                name="docTypeCode"
                                value={formik.values.docTypeCode}
                                onChange={handleDocTypeCodeChange}
                                variant="standard"
                                className={classes.select}
                                fullWidth
                            >
                                {docTypes.map(docType => (
                                    <MenuItem
                                        value={docType.type}
                                        key={docType.type}
                                    >
                                        {t(
                                            `booking:docTypeName${upperFirst(
                                                camelCase(docType.type)
                                            )}`
                                        )}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                    ) : null}

                    {bookFields.includes('document') ? (
                        <Grid item {...gridItemSizes}>
                            <TextField
                                name="docNumber"
                                value={formik.values.docNumber}
                                onChange={formik.handleChange}
                                placeholder={t('booking:docNumber')}
                                label={t('booking:docNumber')}
                                fullWidth
                                variant="standard"
                                error={!!formik.errors.docNumber}
                                helperText={errorHelperText(
                                    formik.errors.docNumber
                                )}
                            />
                        </Grid>
                    ) : null}
                </Grid>
            </div>
        </div>
    );
};
