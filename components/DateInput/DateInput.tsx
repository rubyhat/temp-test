import React, { FC } from 'react';
import InputMask from 'react-input-mask';
import { InputBaseComponentProps } from '@material-ui/core/InputBase';

import { Locale } from 'i18n/utils';
import { useLanguage } from 'hooks/useLanguage';

export const DateInput: FC<InputBaseComponentProps> = props => {
    const { inputRef, ...rest } = props;

    const language = useLanguage();

    return (
        <InputMask
            {...rest}
            ref={ref => {
                inputRef(ref ? ref : null);
            }}
            mask={dateMask}
            maskPlaceholder={maskPlaceholder[language]}
            spellCheck={false}
        />
    );
};

const dateMask = [/\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/];

const maskPlaceholder: Record<Locale, string> = {
    en: 'dd.mm.yyyy',
    ru: 'дд.мм.гггг',
    pl: 'dd.mm.yyyy',
    be: 'дд.мм.гггг',
    lt: 'dd.mm.yyyy',
    lv: 'dd.mm.yyyy',
    de: 'dd.mm.yyyy',
};
