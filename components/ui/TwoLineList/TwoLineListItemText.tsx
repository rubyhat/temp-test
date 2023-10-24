import React, { FC } from 'react';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';
import ListItemText, {
    ListItemTextProps,
} from '@material-ui/core/ListItemText';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {},
        /* Styles applied to the first line heading element. */
        primary: {
            ...theme.atlas.typography.body6,
            color: theme.palette.text.secondary,
        },
        /* Styles applied to the second line content element. */
        secondary: {
            ...theme.atlas.typography.body4,
            lineHeight: '22px',
            fontWeight: theme.typography.fontWeightMedium,
            color: theme.palette.text.primary,
        },
    }),
    { name: 'TwoLineListItemText' }
);

type TwoLineListItemTextProps = ListItemTextProps;

export const TwoLineListItemText: FC<TwoLineListItemTextProps> = props => {
    const { className, ...other } = props;
    const classes = useStyles();

    return (
        <ListItemText
            className={clsx(classes.root, className)}
            classes={{
                primary: classes.primary,
                secondary: classes.secondary,
            }}
            {...other}
        />
    );
};
