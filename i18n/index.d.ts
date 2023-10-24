import NextI18Next from 'next-i18next';

declare const NextI18NextInstance: NextI18Next;

export default NextI18NextInstance;
export const useTranslation: NextI18Next['useTranslation'];
export const withTranslation: NextI18Next['withTranslation'];
export const appWithTranslation: NextI18Next['appWithTranslation'];
export const Trans: NextI18Next['Trans'];
export const Link: NextI18Next['Link'];
export const Router: NextI18Next['Router'];
export const i18n: NextI18Next['i18n'];
export const config: NextI18Next['config'];
