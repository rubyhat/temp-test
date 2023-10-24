import React, { FC, useState } from 'react';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { useTranslation } from 'i18n';
import { ResponsiveDialog } from '../ui/ResponsiveDialog';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {},
        activator: {
            ...theme.atlas.typography.body5,
            textDecoration: 'underline',
            cursor: 'pointer',
            color: theme.palette.primary.main,
        },
        html: {
            padding: theme.spacing(2, 3),
            marginBottom: theme.spacing(2),
            '& h1': {
                fontSize: theme.typography.body1.fontSize,
                marginTop: 0,
            },
            '& ul': {
                margin: 0,
                paddingLeft: 0,
                listStyleType: 'disc',
                listStylePosition: 'inside',
            },
            '& li': {
                lineHeight: 1.5,
            },
        },
    }),
    { name: 'DesktopShuttleRules' }
);

type Props = {
    className?: string;
};

export const DesktopShuttleRules: FC<Props> = props => {
    const { className } = props;
    const classes = useStyles();
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    const handleActivator = () => {
        setOpen(true);
    };
    const handleClose = () => {
        document.body.style.overflow = 'auto';
        setOpen(false);
    };

    return (
        <div className={clsx(classes.root, className)}>
            <span onClick={handleActivator} className={classes.activator}>
                {t('shuttleRules')}
            </span>

            <ResponsiveDialog open={open} onClose={handleClose}>
                <div
                    className={classes.html}
                    dangerouslySetInnerHTML={{
                        __html: t('shuttleRulesDesc'),
                    }}
                />
            </ResponsiveDialog>
        </div>
    );
};
