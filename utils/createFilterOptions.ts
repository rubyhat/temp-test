// Саджест асинхронный и не предполагает локальной фильтрации направлений.
// Это становится проблемой когда у пользователя выбран язык "Английский" а
// направления вводит на русском. В ответе он получает естественно направления
// на английском. При этом <Autocomplete /> пытается дополнительно отфильтровать
// на основе значение инпута (пример: Москва). Получаем пустой список т.к. в
// списке есть только Moscow.
//
// Ниже кастомный фильтр где опускается фильтрация.
// Исходник: https://github.com/mui-org/material-ui/blob/next/packages/material-ui-lab/src/useAutocomplete/useAutocomplete.js#L18

import {
    CreateFilterOptionsConfig,
    FilterOptionsState,
} from '@material-ui/lab';

import { Suggestion } from 'store/search-form/types';

export function createFilterOptions<T = Suggestion>(
    config: CreateFilterOptionsConfig<T> = {}
): (options: T[], state: FilterOptionsState<T>) => T[] {
    const { ignoreAccents = true, ignoreCase = true, limit } = config;

    return options => {
        return typeof limit === 'number' ? options.slice(0, limit) : options;
    };
}
