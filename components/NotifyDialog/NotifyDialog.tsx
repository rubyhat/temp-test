import React, { FC, ReactNode } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';

import {
    ResponsiveDialog,
    Props as ResponsiveDialogProps,
} from '../ui/ResponsiveDialog/ResponsiveDialog';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles((theme: Theme & AtlasTheme) => ({
    /* Styles applied to the root element. */
    root: {
        padding: '24px 16px',
        textAlign: 'center',
        [theme.breakpoints.up('sm')]: {
            padding: 24,
        },
    },
    /* Styles applied to the title `div` element. */
    title: {
        ...theme.atlas.typography.subtitle,
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

type Props = ResponsiveDialogProps & {
    title?: string;
    subtitle?: string;
    actions?: ReactNode;
};

export const NotifyDialog: FC<Props> = props => {
    const { children = null, title, subtitle, actions = null, ...rest } = props;
    const classes = useStyles();

    return (
        <ResponsiveDialog
            position="center"
            fullScreen={false}
            fullWidth={true}
            {...rest}
        >
            <div className={classes.root}>
                {children ? (
                    children
                ) : (
                    <>
                        <div className={classes.title}>{title}</div>
                        <div className={classes.subtitle}>{subtitle}</div>
                        <div className={classes.actions}>{actions}</div>
                    </>
                )}
            </div>
        </ResponsiveDialog>
    );
};
