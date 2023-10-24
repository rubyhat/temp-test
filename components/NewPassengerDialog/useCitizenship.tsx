import React, { ChangeEvent, useEffect, useState } from 'react';
import ListItemText from '@material-ui/core/ListItemText';
import { useSelector } from 'react-redux';

import { i18n } from 'i18n';
import { Locale } from 'i18n/utils';
import apiClient from 'lib/apiClient';
import { Citizenship, getCitizenshipByDocumentType } from 'utils/documents';
import { RootState } from 'store';
import { CountryState } from 'store/country/types';

type Props<F> = {
    formik: F;
    open: boolean;
};

export function useCitizenship<F extends any>(props: Props<F>) {
    const { formik, open } = props;

    const [countryInputValue, setCountryInputValue] = useState('');
    const handleCountryInputValueChange = (
        event: ChangeEvent<{}>,
        value: string
    ) => {
        setCountryInputValue(value);
    };
    const handleCountryValueChange = (
        event: ChangeEvent<{}>,
        value: Citizenship | null
    ) => {
        formik.setFieldValue(
            'citizenshipCode',
            value ? value.country_code : null
        );
    };

    const renderSuggestion = (citizenship: Citizenship) => (
        <ListItemText
            primary={
                citizenship.localized_name[
                    (i18n.language && i18n.language.substr(0, 2)) as Locale
                ]
            }
        />
    );
    const getSuggestionLabel = (citizenship: Citizenship) =>
        citizenship.localized_name[
            (i18n.language && i18n.language.substr(0, 2)) as Locale
        ];
    const getSuggestionValue = (citizenship: Citizenship) =>
        citizenship.country_code;

    const [countries, setCountries] = useState<Citizenship[]>([]);
    const { country } = useSelector<RootState, CountryState>(
        rootState => rootState.country
    );
    useEffect(() => {
        apiClient.getCitizenships(country).then(res => {
            setCountries(res.data);
        });
    }, []);

    useEffect(() => {
        const citizenship = getCitizenshipByDocumentType(
            formik.values.docTypeCode
        );

        const selectedCountry = countries.find(
            country => country.country_code === citizenship
        );
        if (selectedCountry) {
            formik.setFieldValue('citizenshipCode', citizenship);

            setCountryInputValue(
                selectedCountry.localized_name[
                    (i18n.language && i18n.language).substr(0, 2) as Locale
                ]
            );
        }
    }, [formik.values.docTypeCode, countries, open]);

    const selectedCountry =
        countries.find(
            country => country.country_code === formik.values.citizenshipCode
        ) || null;

    return {
        countries,
        selectedCountry,
        countryInputValue,
        handleCountryInputValueChange,
        handleCountryValueChange,
        renderSuggestion,
        getSuggestionLabel,
        getSuggestionValue,
    };
}
