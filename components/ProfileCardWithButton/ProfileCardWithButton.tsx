import React from 'react';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { IProfileCardWithButton } from 'components/ProfileCardWithButton/interface';
import { Typo } from '../Typo/Typo';

import { AtlasTheme } from 'typings/atlas-theme';
const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            padding: theme.spacing(2, 2),
            backgroundColor: '#FFF',
            borderRadius: theme.shape.borderRadius,
            boxShadow:
                '0px 1px 8px 1px rgba(0, 0, 0, 0.08), 0px 0px 16px 2px rgba(0, 0, 0, 0.04), 0px -1px 2px rgba(0, 0, 0, 0.04)',
        },
        /* Styles applied to the hint `div` element. */
        button: {
            marginTop: theme.spacing(1.2),
            cursor: 'pointer',
            fontWeight: 500,
            '&:hover': {
                textDecoration: 'underline',
            },
        },
        danger: {
            color: '#FF2D2D',
        },
        primary: {
            color: theme.atlas.palette.text.link,
        },
    }),
    { name: 'ProfileCardWithButton' }
);

export const ProfileCardWithButton = (props: IProfileCardWithButton) => {
    const { cardText, className } = props;
    const { text, variant, onClick } = props.button;

    const classes = useStyles();

    return (
        <div className={clsx(classes.root, className)}>
            <Typo variant="caption" color="textSecondary">
                {cardText}
            </Typo>
            <Typo
                onClick={onClick && onClick}
                className={clsx(classes.button, classes[variant])}
            >
                {text}
            </Typo>
        </div>
    );
};
