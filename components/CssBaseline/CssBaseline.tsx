import React, { FC, ReactNode } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        '@global': {
            html: {
                WebkitFontSmoothing: 'antialiased', // Antialiasing.
                MozOsxFontSmoothing: 'grayscale', // Antialiasing.
                // Change from `box-sizing: content-box` so that `width`
                // is not affected by `padding` or `border`.
                boxSizing: 'border-box',
            },
            '*, *::before, *::after': {
                boxSizing: 'inherit',
            },
            'strong, b': {
                fontWeight: 'bolder',
            },
            body: {
                margin: 0, // Remove the margin in all browsers.
                color: theme.palette.text.primary,
                fontFamily: theme.typography.fontFamily,
                ...theme.atlas.typography.body1,
                backgroundColor: theme.palette.background.default,
                '@media print': {
                    // Save printer ink.
                    backgroundColor: theme.palette.common.white,
                },
                // Add support for document.body.requestFullScreen().
                // Other elements, if background transparent, are not supported.
                '&::backdrop': {
                    backgroundColor: theme.palette.background.default,
                },
            },
            '.grecaptcha-badge': {
                visibility: 'hidden',
            },
        },
    }),
    { name: 'CssBaseline' }
);

type Props = {
    children?: ReactNode;
};

/**
 * Kickstart an elegant, consistent, and simple baseline to build upon.
 */
export const CssBaseline: FC<Props> = props => {
    const { children = null } = props;
    useStyles();
    return <React.Fragment>{children}</React.Fragment>;
};
