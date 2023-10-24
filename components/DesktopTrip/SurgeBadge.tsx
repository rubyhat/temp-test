import React from 'react';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { useSAAS } from 'hooks/useSAAS';
import { useTranslation } from 'i18n';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            borderRadius: theme.atlas.borderRadius.soft,
            position: 'relative',
            color: theme.palette.primary.main,
            padding: '3px 7px',
            fontSize: theme.atlas.typography.body6.fontSize,
            lineHeight: theme.atlas.typography.body6.lineHeight,
            fontWeight: 400,
        },
        background: {
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,

            backgroundColor: 'currentColor',
            opacity: 0.2,

            borderRadius: 'inherit',
        },
    }),
    { name: 'SurgeBadge' }
);

type SurgeBadgeProps = {
    className?: string;
};

export const SurgeBadge = React.forwardRef<HTMLDivElement, SurgeBadgeProps>(
    (props, ref) => {
        const { className, ...other } = props; // в ...other есть DOM события которые нужны для работы <Tooltip/>
        const classes = useStyles();
        const { t } = useTranslation();
        const { meta } = useSAAS();

        return (
            <div
                ref={ref}
                className={clsx(classes.root, className)}
                style={{
                    color: meta.surgeColor,
                }}
                {...other}
            >
                <div className={classes.background} />
                {t('surgeBadgeText')}
            </div>
        );
    }
);
