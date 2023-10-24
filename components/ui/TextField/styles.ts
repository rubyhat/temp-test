import { makeStyles, Theme } from '@material-ui/core/styles';

import { Props } from './TextField';
import { getThemePalleteColor } from 'themes/helpers';

export const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    input: (props: Props) => ({
        '&:before': {
            borderBottom: '1px solid rgba(3, 44, 59, 0.16)',
        },
        '&:hover:not(.Mui-disabled):before': {
            borderWidth: 1,
            borderBottomColor: () => {
                const color = getThemePalleteColor(theme, props.color);

                return color || theme.palette.primary.main;
            },
        },
        '&:after': {
            borderBottomColor: () => {
                const color = getThemePalleteColor(theme, props.color);

                return color || theme.palette.primary.main;
            },
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: () => {
                const color = getThemePalleteColor(theme, props.color);

                return color || theme.palette.primary.main;
            },
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: '1px',
        },
        '&.MuiFilledInput-root': {
            backgroundColor: 'unset',
        },
    }),
    label: {
        color: 'rgba(8, 41, 59, 0.38)',
        '&.Mui-focused': {
            color: 'rgba(8, 41, 59, 0.38)',
        },
    },
}));
