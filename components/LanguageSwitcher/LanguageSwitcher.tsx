import React, { ChangeEvent, FC } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';

import { i18n, useTranslation } from 'i18n';
import { locales, langListArray, compasBusLocales } from 'i18n/utils';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'store';
import { suggestionFetch } from 'store/suggestion/actions';
import { resetSearchForm } from 'store/search-form/actions';
import { CountryState } from 'store/country/types';
import { useSAAS } from '../../hooks/useSAAS';

const useStyles = makeStyles(
    (theme: Theme) => ({
        root: {
            margin: theme.spacing(0, 0),
            '& .MuiSelect-root': {
                color: '#FFF',
                '& option': {
                    color: '#000',
                },
            },
            '& .MuiSelect-icon': {
                color: '#FFF',
            },
        },
    }),
    {
        name: 'LanguageSwitcher',
    }
);

export const LanguageSwitcher: FC = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { country: countryCode } = useSelector<RootState, CountryState>(
        rootState => rootState.country
    );
    const { isCompasBus } = useSAAS();
    const languages = isCompasBus ? compasBusLocales : locales;

    // set default language based on country code
    // React.useEffect(() => {
    //     i18n.changeLanguage(countryCode.toLowerCase() as string);
    // }, [countryCode]);

    const handleChange = (e: ChangeEvent<{ value: unknown }>) => {
        i18n.changeLanguage(e.target.value as string);
        // обновляем название городов в форме поиска, в выпадающем списке
        dispatch(resetSearchForm());
        dispatch(suggestionFetch('suggestionFrom', ''));
        dispatch(suggestionFetch('suggestionTo', ''));
    };
    if (process.browser) {
        document.documentElement.setAttribute(
            'lang',
            i18n.language && i18n.language.substr(0, 2)
        );
    }
    // const handleChange = (e: ChangeEvent<{ value: unknown }>) => {
    //     let value =
    //         e.target.value === 'default'
    //             ? countryCode.toLowerCase()
    //             : String(e.target.value);
    //     i18n.changeLanguage(value);
    // };

    return (
        <FormControl className={classes.root}>
            <Select
                native
                // TODO: разкостылять. Сейчас приходится делать substr чтобы ru-RU превратить в ru
                value={i18n.language && i18n.language.substr(0, 2)}
                onChange={handleChange}
                inputProps={{
                    name: 'language',
                    id: 'language',
                }}
                disableUnderline
            >
                {languages.map(locale => (
                    <option value={locale} key={locale}>
                        {t(`language${locale.toUpperCase()}`)}
                    </option>
                ))}
            </Select>
        </FormControl>
    );
};
