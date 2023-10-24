import React, { FC } from 'react';
import BaseListSubheader, {
    ListSubheaderProps,
} from '@material-ui/core/ListSubheader';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            ...theme.atlas.typography.caption,
            backgroundColor: theme.atlas.palette.background.deepCold,
            color: theme.atlas.palette.text.disabled,
            height: 40,
            paddingBottom: 8,
            fontWeight: 700,
            display: 'flex',
            justifyContent: 'flex-end',
            flexDirection: 'column',
            [theme.breakpoints.up('sm')]: {
                height: 48,
                paddingBottom: 12,
            },
        },
    }),
    { name: 'ListSubheader' }
);

type Props = Omit<ListSubheaderProps, 'classes'>;

export const ListSubheader: FC<Props> = props => {
    const classes = useStyles();

    return <BaseListSubheader classes={classes} {...props} />;
};
