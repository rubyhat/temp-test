import React from 'react';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { useTranslation } from 'i18n';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            borderRadius: theme.atlas.borderRadius.soft,
            position: 'relative',
            color: theme.palette.secondary.main,
            padding: '3px 7px',
            fontSize: theme.atlas.typography.body6.fontSize,
            lineHeight: theme.atlas.typography.body6.lineHeight,
            fontWeight: 400,
            [theme.breakpoints.down('sm')]: {
                textAlign: 'center',
                marginRight: theme.spacing(1),
            },
        },
        background: {
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,

            backgroundColor: 'currentColor',
            opacity: 0.1,

            borderRadius: 'inherit',
        },
        singlePayment: {
            color: '#F3660B',
            border: '1px solid #F3660B',
        },
        allPayment: {
            color: '#6D900A',
            border: '1px solid #6D900A',
        },
    }),
    { name: 'OnlinePaymentBadge' }
);

type OnlinePaymentBadgeProps = {
    type: string;
    className?: string;
};

export const OnlinePaymentBadge = React.forwardRef<
    HTMLDivElement,
    OnlinePaymentBadgeProps
>((props, ref) => {
    const { className, type, ...other } = props; // в ...other есть DOM события которые нужны для работы <Tooltip/>
    const classes = useStyles();
    const { t } = useTranslation();

    return (
        <div
            ref={ref}
            className={clsx(
                classes.root,
                classes[type === 'All' ? 'allPayment' : 'singlePayment'],
                className
            )}
            {...other}
        >
            {/* <div className={classes.background} /> */}
            {t(`search:only${type}BadgeTitle`)}
        </div>
    );
});
