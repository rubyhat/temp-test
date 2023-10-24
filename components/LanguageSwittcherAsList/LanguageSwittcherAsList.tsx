import React from 'react';
import { i18n, useTranslation } from 'i18n';
import {
    ILangItem,
    langListArray,
    Locale,
    locales,
    compasBusLocales,
} from 'i18n/utils';
import { AtlasTheme } from 'typings/atlas-theme';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { List } from 'components/ui/List/List';
import ListItem from '@material-ui/core/ListItem';
import { Box, Typography } from '@material-ui/core';

import { RootState } from 'store';
import { CountryState } from 'store/country/types';
import { useSelector } from 'react-redux';
import { useSAAS } from 'hooks/useSAAS';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {},
        list: {
            backgroundColor: '#FFF',
            marginTop: theme.spacing(3),
            borderRadius: theme.spacing(1),
            padding: 0,
        },
        listItem: {
            cursor: 'pointer',
            borderBottom: '1px solid #e2e2e2',
            padding: theme.spacing(2),
            transition: 'all 333ms ease',
            '&:last-child': {
                border: 'none',
            },
        },
        listItemText: {
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginLeft: theme.spacing(1.25),
        },
        langIcon: {
            width: '22px',
            height: '16px',
        },
    }),
    { name: 'LanguageSwittcherAsList' }
);

export const LanguageSwittcherAsList = () => {
    const { t } = useTranslation();
    const { isCompasBus } = useSAAS();
    const classes = useStyles();

    const { country } = useSelector<RootState, CountryState>(
        rootState => rootState.country
    );

    const [langList, setLangList] = React.useState<ILangItem[]>(langListArray);

    React.useEffect(() => {
        setLangList((prevState: ILangItem[]) => {
            const list = [...prevState].map((listItem: ILangItem) => {
                listItem.value === i18n.language
                    ? (listItem.selected = true)
                    : (listItem.selected = false);

                return listItem;
            });
            list.sort((a, b) => Number(b.selected) - Number(a.selected));
            return list.sort((a, b) => Number(b.pin) - Number(a.pin));
        });
    }, []);

    const handleChange = (countryCode: string) => {
        const languages = isCompasBus ? compasBusLocales : locales;

        const countryCandidate = country.toLowerCase() as Locale;

        const defaultLang = isCompasBus
            ? 'pl'
            : languages.includes(countryCandidate)
            ? countryCandidate
            : 'ru';

        i18n.changeLanguage(
            countryCode === 'default' ? defaultLang : countryCode
        );
        setLangList((prevState: ILangItem[]) => {
            const list = [...prevState].map((listItem: ILangItem) => {
                listItem.value === countryCode
                    ? (listItem.selected = true)
                    : (listItem.selected = false);

                return listItem;
            });

            list.sort((a, b) => Number(b.selected) - Number(a.selected));
            return list.sort((a, b) => Number(b.pin) - Number(a.pin));
        });
    };

    return (
        <List className={classes.list}>
            {langList &&
                langList.map((langItem, index) => (
                    <ListItem
                        className={classes.listItem}
                        key={index}
                        onClick={() => handleChange(langItem.value)}
                    >
                        <img
                            style={Boolean(langItem.icon) ? {} : { opacity: 0 }}
                            className={classes.langIcon}
                            src={langItem.icon}
                            alt={langItem.title}
                        />

                        <Box className={classes.listItemText}>
                            <Typography variant="body1">
                                {t(langItem.title)}
                            </Typography>
                            {langItem.selected && (
                                <img
                                    src="/static/img/icons-lang/check.svg"
                                    alt="selected"
                                />
                            )}
                        </Box>
                    </ListItem>
                ))}
        </List>
    );
};
