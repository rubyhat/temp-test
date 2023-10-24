import { i18n } from 'i18n';
import { Locale, locales } from 'i18n/utils';

/**
 * Из getInitialProps. Может быть получен и на сервере и на клиенте.
 * В Cordova должен быть `undefined`.
 * @param initialLanguage
 */
export function useLanguage(initialLanguage?: Locale | null): Locale {
    if (initialLanguage) return initialLanguage;

    let defaultLanguage: Locale = 'ru';
    let language = i18n.language && i18n.language.substr(0, 2);

    if (locales.includes(language as any)) {
        return language as Locale;
    }

    return defaultLanguage;
}
