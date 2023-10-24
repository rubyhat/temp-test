import React, { ChangeEvent, FC, useEffect } from 'react';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import NativeSelect from '@material-ui/core/NativeSelect';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useFormik } from 'formik';
import clsx from 'clsx';
import camelCase from 'lodash/camelCase';
import upperFirst from 'lodash/upperFirst';
import { useDispatch, useSelector } from 'react-redux';
import parseISO from 'date-fns/parseISO';
import isValid from 'date-fns/isValid';
import getYear from 'date-fns/getYear';

import { ActionBar } from '../ActionBar';
import { Button } from '../ui/Button';
import { ButtonGroup } from '../ui/ButtonGroup';
import { List } from '../ui/List/List';
import { ListSubheader } from '../ui/ListSubheader';
import { MobileDialog } from '../ui/MobileDialog';
import { TextField } from '../ui/TextField/TextField';
import { BookField, PassengerFormData } from '../NewPassenger';
import {
    DocTypesDto,
    DocTypesDtoTypeEnum,
    GenderTypesDto,
    PersonalDataDto,
} from 'swagger/client';
import { DateInput } from '../DateInput';
import { useTranslation, i18n } from 'i18n';
import { TouchAutocomplete } from 'components/Autocomplete';
import { useCitizenship } from './useCitizenship';
import { SavedPassengersDialog } from '../SavedPassengersDialog';
import { useSavedPassengers } from './useSavedPassengers';
import { DocumentInput } from '../DocumentInput';
import {
    documentMask,
    documentTextMask,
    isFakeDocument,
} from 'utils/documents';
import { Typo } from '../Typo/Typo';
import { BookingState } from 'store/booking/types';
import { RootState } from 'store';
import { bookingUpdateState } from 'store/booking/actions';
import { dateMaskToISO } from 'sagas/util';
import { containsSingleAlphabet } from 'utils/booking';
import useSnackBar from '../ui/Snackbar/useSnackbar';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the 'form' element. */
        form: {
            marginBottom: 104, // ActionBar height + 16px
        },
        /* Styles applied to the List component. */
        list: {
            backgroundColor: '#FFF',
            '& .MuiListItem-root': {
                // @todo set padding inside ListItem
                paddingTop: theme.spacing(1.5),
                paddingBottom: theme.spacing(1.5),
            },
        },
        /* Pseudo-class applied to the Divider component if input is not valid. */
        dividerError: {
            backgroundColor: theme.atlas.palette.text.alert,
        },
        /* Styles applied to the NativeSelect component. */
        nativeSelect: {
            '&:focus': {
                backgroundColor: 'unset', // @todo move styles to custom component
            },
        },
    }),
    { name: 'NewPassengerDialog' }
);

export type PassengerDetailsFormData = Omit<
    PassengerFormData,
    'ticketTypeCode'
>;

type Props = {
    title: string;
    docTypes: DocTypesDto[];
    genderTypes: GenderTypesDto[];
    bookFields: BookField[];
    documents?: PersonalDataDto[];
    open: boolean;
    onClose: () => void;
    initialData?: PassengerDetailsFormData | null;
    onSubmit: (data: PassengerDetailsFormData) => void;
};

export const validate = (
    values: PassengerDetailsFormData,
    bookFields: BookField[]
): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (bookFields.includes('name')) {
        if (!values.firstName) {
            errors.firstName = 'Required';
        } else if (values.firstName.length < 2) {
            errors.firstName = 'formErrors:firstNameError';
        } else if (!containsSingleAlphabet(values.firstName)) {
            errors.firstName = 'formErrors:mixingAlphabets';
        }
    }

    if (bookFields.includes('patronymic')) {
        if (!values.middleName) {
        } else if (
            values.middleName.length < 2 &&
            values.middleName.length > 0
        ) {
            errors.middleName = 'formErrors:middleNameError';
        } else if (!containsSingleAlphabet(values.middleName)) {
            errors.middleName = 'formErrors:mixingAlphabets';
        }
    }

    if (bookFields.includes('surname')) {
        if (!values.lastName) {
            errors.lastName = 'Required';
        } else if (values.lastName.length < 2) {
            errors.lastName = 'formErrors:lastNameError';
        } else if (!containsSingleAlphabet(values.lastName)) {
            errors.lastName = 'formErrors:mixingAlphabets';
        }
    }

    if (bookFields.includes('birthDate')) {
        if (!values.birthDate) {
            errors.birthDate = 'Required';
        } else if (!isValidBirthdate(values.birthDate)) {
            errors.birthDate = 'formErrors:birthDateError';
        }
    }

    if (bookFields.includes('document')) {
        const regExp = documentMask[values.docTypeCode];
        const isValidDocument = regExp.test(values.docNumber);

        if (!values.docNumber) {
            errors.docNumber = 'Required';
        } else if (!isValidDocument) {
            errors.docNumber = `formErrors:formatRequired_${values.docTypeCode}`;
        } else if (isFakeDocument(values.docNumber)) {
            errors.docNumber = 'formErrors:fakeDocNumber';
        }
    }

    if (!values.citizenshipCode && bookFields.includes('citizenship')) {
        errors.citizenshipCode = 'Required';
    }

    return errors;
};

export const NewPassengerDialog: FC<Props> = props => {
    const {
        open,
        onClose,
        onSubmit,
        title,
        initialData,
        docTypes,
        genderTypes,
        bookFields,
        documents = [],
    } = props;
    const { t } = useTranslation();
    const [, snackbar] = useSnackBar();
    const initialValues = {
        id: 0,
        lastName: '',
        firstName: '',
        middleName: '',
        birthDate: '',
        genderCode: bookFields.includes('gender') ? genderTypes[0].code : '',
        docTypeCode: bookFields.includes('document') ? docTypes[0].code : '',
        docNumber: '',
        citizenshipCode: '',
        ...initialData,
    };
    const formik = useFormik<PassengerDetailsFormData>({
        initialValues,
        onSubmit: values => {
            onSubmit({
                ...values,
            });
        },
        validate: values => {
            const errorsMap = validate(values, bookFields);
            const errors = Object.values(errorsMap);
            const firstError: string | undefined = errors && errors[0];

            if (firstError && i18n.exists(firstError)) {
                snackbar({
                    type: 'show',
                    payload: {
                        message: t(firstError),
                        variant: 'alert',
                    },
                });
            }

            return errorsMap;
        },
        validateOnChange: false,
    });
    const classes = useStyles();
    const dispatch = useDispatch();

    const docMask = documentTextMask[formik.values.docTypeCode] || false;

    const handleDocTypeCodeChange = (e: ChangeEvent<HTMLSelectElement>) => {
        // Очищаем инпут с номером документа чтобы
        // новая маска не применилась к старому документу
        formik.setFieldValue('docNumber', '');

        formik.handleChange(e);
    };

    useEffect(() => {
        if (open) {
            formik.resetForm({
                values: initialValues,
            });
        }
    }, [open]);

    const {
        openSavedPassengers,
        handleSavedPassengersClose,
        handleNewPassenger,
        handleSelectPassenger,
    } = useSavedPassengers<typeof formik>({
        formik,
        documents,
        open,
        onClose,
    });

    const { savePersonalData } = useSelector<RootState, BookingState>(
        rootState => rootState.booking
    );
    const handleSavePersonalData = (e: React.ChangeEvent<HTMLInputElement>) =>
        dispatch(
            bookingUpdateState({
                savePersonalData: e.target.checked,
            })
        );

    const FormDivider = ({ error }: { error?: string }) => (
        <Divider
            component="li"
            variant="middle"
            className={clsx({
                [classes.dividerError]: !!error,
            })}
        />
    );
    const GenderButtonGroup = () => {
        const handleButtonGroupChange = (
            e: React.MouseEvent<HTMLButtonElement, MouseEvent>
        ) => {
            formik.setFieldValue(
                e.currentTarget.name,
                e.currentTarget.dataset.value
            );
        };
        const getVariant = (genderCode: string) =>
            formik.values.genderCode === genderCode ? 'contained' : 'outlined';
        const getGenderName = (genderCode: GenderTypesDto['code']) => {
            return t(`booking:gender${genderCode}`);
        };

        return (
            <ButtonGroup
                variant="outlined"
                color="primary"
                size="medium"
                fullWidth
            >
                {genderTypes.map(genderType => (
                    <Button
                        key={genderType.code}
                        onClick={handleButtonGroupChange}
                        name="genderCode"
                        data-value={genderType.code}
                        height="100%"
                        variant={getVariant(genderType.code)}
                    >
                        {getGenderName(genderType.code)}
                    </Button>
                ))}
            </ButtonGroup>
        );
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
    } = useCitizenship<typeof formik>({ formik, open });

    const isDocNumeric = isDocumentTypeNumeric(formik.values.docTypeCode);

    const errorHelperText = (key?: string) => {
        return key && i18n.exists(key) ? t(key) : undefined;
    };

    return (
        <MobileDialog
            open={open}
            onClose={onClose}
            title={title}
            textCenter
            startIcon="close"
        >
            <form onSubmit={formik.handleSubmit} className={classes.form}>
                <List
                    className={classes.list}
                    subheader={
                        <ListSubheader>
                            {t('booking:passengerData')}
                        </ListSubheader>
                    }
                    disablePadding
                >
                    {bookFields.includes('name') ? (
                        <>
                            <ListItem>
                                <TextField
                                    name="firstName"
                                    value={formik.values.firstName}
                                    onChange={formik.handleChange}
                                    placeholder={t('booking:firstName')}
                                    fullWidth
                                    label={t('booking:firstName')}
                                    InputProps={{
                                        disableUnderline: true,
                                    }}
                                    helperText={errorHelperText(
                                        formik.errors.firstName
                                    )}
                                />
                            </ListItem>

                            <FormDivider error={formik.errors.firstName} />
                        </>
                    ) : null}

                    {bookFields.includes('surname') ? (
                        <>
                            <ListItem>
                                <TextField
                                    name="lastName"
                                    value={formik.values.lastName}
                                    onChange={formik.handleChange}
                                    placeholder={t('booking:lastName')}
                                    fullWidth
                                    label={t('booking:lastName')}
                                    helperText={errorHelperText(
                                        formik.errors.lastName
                                    )}
                                />
                            </ListItem>

                            <FormDivider error={formik.errors.lastName} />
                        </>
                    ) : null}

                    {bookFields.includes('patronymic') ? (
                        <>
                            <ListItem>
                                <TextField
                                    name="middleName"
                                    value={formik.values.middleName}
                                    onChange={formik.handleChange}
                                    placeholder={t('booking:middleName')}
                                    label={t('booking:middleName')}
                                    variant="standard"
                                    fullWidth
                                    InputProps={{
                                        disableUnderline: true,
                                    }}
                                    helperText={errorHelperText(
                                        formik.errors.middleName
                                    )}
                                />
                            </ListItem>

                            <FormDivider error={formik.errors.middleName} />
                        </>
                    ) : null}

                    {bookFields.includes('birthDate') ? (
                        <>
                            <ListItem>
                                <TextField
                                    name="birthDate"
                                    placeholder={t('booking:birthDate')}
                                    fullWidth
                                    label={t('booking:birthDate')}
                                    InputProps={{
                                        disableUnderline: true,
                                        value: formik.values.birthDate,
                                        onChange: formik.handleChange,
                                        inputComponent: DateInput,
                                    }}
                                    inputProps={{
                                        inputMode: 'numeric',
                                        pattern: '[0-9.]*',
                                    }}
                                    helperText={errorHelperText(
                                        formik.errors.birthDate
                                    )}
                                />
                            </ListItem>

                            <FormDivider error={formik.errors.birthDate} />
                        </>
                    ) : null}

                    {bookFields.includes('gender') ? (
                        <ListItem>
                            <GenderButtonGroup />
                        </ListItem>
                    ) : null}
                </List>

                {bookFields.includes('document') ? (
                    <List
                        className={classes.list}
                        subheader={
                            <ListSubheader>{t('booking:idCard')}</ListSubheader>
                        }
                        disablePadding
                    >
                        <ListItem>
                            <NativeSelect
                                name="docTypeCode"
                                value={formik.values.docTypeCode}
                                onChange={handleDocTypeCodeChange}
                                fullWidth
                                disableUnderline
                                classes={{
                                    select: classes.nativeSelect,
                                }}
                            >
                                {docTypes.map(docType => (
                                    <option
                                        value={docType.type}
                                        key={docType.type}
                                    >
                                        {t(
                                            `booking:docTypeName${upperFirst(
                                                camelCase(docType.type)
                                            )}`
                                        )}
                                    </option>
                                ))}
                            </NativeSelect>
                        </ListItem>

                        <Divider component="li" variant="middle" />

                        <ListItem>
                            <TextField
                                name="docNumber"
                                value={formik.values.docNumber}
                                onChange={formik.handleChange}
                                placeholder={t('booking:docNumber')}
                                label={t('booking:docNumber')}
                                fullWidth
                                helperText={errorHelperText(
                                    formik.errors.docNumber
                                )}
                            />
                        </ListItem>

                        <FormDivider error={formik.errors.docNumber} />
                    </List>
                ) : null}

                {bookFields.includes('citizenship') ? (
                    <List className={classes.list} disablePadding>
                        <ListItem>
                            <TouchAutocomplete
                                inputValue={countryInputValue}
                                value={selectedCountry}
                                onChange={handleCountryValueChange}
                                onInputChange={handleCountryInputValueChange}
                                options={countries}
                                getOptionLabel={getSuggestionLabel}
                                renderActivator={params => (
                                    <TextField
                                        onClick={params.onClick}
                                        value={params.value}
                                        fullWidth
                                        variant="standard"
                                        InputProps={{
                                            disableUnderline: true,
                                            inputProps: {
                                                readOnly: true,
                                            },
                                        }}
                                        label={t('booking:citizenship')}
                                        placeholder={t('booking:citizenship')}
                                    />
                                )}
                                placeholder={t('booking:citizenship')}
                                openOnFocus
                                autoHighlight
                                noOptionsText={''}
                            />
                        </ListItem>

                        <FormDivider error={formik.errors.citizenshipCode} />
                    </List>
                ) : null}

                <List disablePadding>
                    <ListItem>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={savePersonalData}
                                    onChange={handleSavePersonalData}
                                    color="primary"
                                />
                            }
                            label={
                                <Typo color="textPrimary">
                                    {t('booking:savePersonalData')}
                                </Typo>
                            }
                        />
                    </ListItem>
                </List>

                <ActionBar>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        title={t('done')}
                        type="submit"
                    />
                </ActionBar>
            </form>

            <SavedPassengersDialog
                title={title}
                documents={documents}
                open={openSavedPassengers}
                onClose={handleSavedPassengersClose}
                onNewPassenger={handleNewPassenger}
                onSelectPassenger={handleSelectPassenger}
            />
        </MobileDialog>
    );
};

export function isDocumentTypeNumeric(docTypeCode: string) {
    return (
        docTypeCode === DocTypesDtoTypeEnum.IdRu ||
        docTypeCode === DocTypesDtoTypeEnum.PassportRu
    );
}

/**
 * dd.mm.YYYY => YYYY-mm-dd
 * @param dateString
 */
function isValidBirthdate(dateString: string): boolean {
    const date = parseISO(dateMaskToISO(dateString));

    if (isValid(date) && getYear(date) >= 1900) {
        return true;
    }

    return false;
}
