import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';

export function capitalize(str: string) {
    return upperFirst(camelCase(str));
}
