import React, { FC, MouseEvent } from 'react';
import Button, { ButtonProps } from '@material-ui/core/Button';
import clsx from 'clsx';
import { fade, makeStyles, Theme } from '@material-ui/core/styles';

import { useTranslation } from 'i18n';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            borderRadius: 100,
            borderColor: fade(theme.palette.text.disabled, 0.16),
            borderWidth: 2,
            borderStyle: 'solid',

            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1),
            paddingRight: theme.spacing(2),
            paddingLeft: theme.spacing(2),

            fontWeight: 700,
            display: 'inline-block',
            cursor: 'pointer',
            '-webkit-tap-highlight-color': 'transparent',

            fontSize: theme.atlas.typography.body1.fontSize,
            textTransform: 'none',
            lineHeight: 'inherit',
        },
    }),
    { name: 'CommentRadioButton' }
);

type CommentRadioButtonProps = {
    className?: string;
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
    ButtonProps?: ButtonProps;
};

export const CommentRadioButton: FC<CommentRadioButtonProps> = props => {
    const { className, onClick, ButtonProps } = props;
    const classes = useStyles();
    const { t } = useTranslation();

    return (
        <Button
            {...ButtonProps}
            className={clsx(classes.root, className)}
            onClick={onClick}
        >
            <span>💬 </span>
            {t('leaveComment')}
        </Button>
    );
};
