import { i18n } from 'i18n';
import enLocale from 'date-fns/locale/en-US';
import ruLocale from 'date-fns/locale/ru';
import plLocale from 'date-fns/locale/pl';
import beLocale from 'date-fns/locale/be';
import ltLocale from 'date-fns/locale/lt';
import lvLocale from 'date-fns/locale/lv';
import deLocale from 'date-fns/locale/de';

export type Locale = 'en' | 'ru' | 'pl' | 'be' | 'lt' | 'lv' | 'de';

export const locales: Locale[] = ['en', 'ru', 'pl', 'be', 'lt', 'lv', 'de'];
export const compasBusLocales: Locale[] = ['pl', 'en', 'ru'];

export interface ILangItem {
    icon: string;
    value: string;
    title: string;
    selected: boolean;
    pin: boolean;
}

export const langListArray: ILangItem[] = [
    {
        icon: '',
        value: 'default',
        title: 'defaultValue',
        selected: true,
        pin: true,
    },
    {
        icon: '/static/img/icons-lang/ru.svg',
        value: 'ru',
        title: 'languageRU',
        selected: false,
        pin: false,
    },
    {
        icon: '/static/img/icons-lang/en.svg',
        value: 'en',
        title: 'languageEN',
        selected: false,
        pin: false,
    },
    {
        icon: '/static/img/icons-lang/pl.svg',
        value: 'pl',
        title: 'languagePL',
        selected: false,
        pin: false,
    },
];

export const getLocale = (code: string) => {
    const codeSlug = code.substring(0, 2).toLowerCase() as Locale;

    const locales = {
        en: enLocale,
        ru: ruLocale,
        pl: plLocale,
        be: beLocale,
        lt: ltLocale,
        lv: lvLocale,
        de: deLocale,
    };
    return locales[codeSlug];
};
