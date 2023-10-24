import { Theme } from '@material-ui/core/styles';

export const getThemePalleteColor = (
    theme: Theme,
    color: string | undefined
): string => {
    if (color === 'primary' || color === 'secondary') {
        return theme.palette[color].main;
    }

    return '';
};
