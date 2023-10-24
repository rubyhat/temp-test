import { makeStyles, Theme } from '@material-ui/core/styles';

import { Props } from './Checkbox';
import { getThemePalleteColor } from 'themes/helpers';

export const useStyles = makeStyles((theme: Theme) => ({
    root: (props: Props) => ({
        '&:hover': {
            backgroundColor: 'unset',
            '& .MuiSvgIcon-root': {
                color: getThemePalleteColor(theme, props.color),
            },
        },
        '&.Mui-checked:hover': {
            backgroundColor: 'unset',
        },
    }),
}));
