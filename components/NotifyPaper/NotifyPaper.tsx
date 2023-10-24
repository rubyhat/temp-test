import React, { FC, ReactNode } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles((theme: Theme & AtlasTheme) => ({
    /* Styles applied to the root element. */
    root: {
        color: theme.atlas.palette.text.disabled,
        textAlign: 'center',
    },
    /* Styles applied to the title `div` element. */
    title: {
        ...theme.atlas.typography.title,
        fontWeight: 700,
    },
    /* Styles applied to the subtitle `div` element. */
    subtitle: {
        ...theme.atlas.typography.body1,
        marginTop: theme.spacing(1),
    },
    /* Styles applied to the actions `div` element. */
    actions: {
        marginTop: theme.spacing(3),
    },
}));

type Props = {
    title?: string;
    subtitle?: string;
    actions?: ReactNode;
};

export const NotifyPaper: FC<Props> = props => {
    const { title, subtitle, actions = null } = props;
    const classes = useStyles();

    return (
        <div className={classes.root}>
            {title && <div className={classes.title}>{title}</div>}
            {subtitle && <div className={classes.subtitle}>{subtitle}</div>}
            {actions && <div className={classes.actions}>{actions}</div>}
        </div>
    );
};
