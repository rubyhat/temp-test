import React, { FC } from 'react';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { TypographyProps } from '@material-ui/core/Typography';
import upperFirst from 'lodash/upperFirst';

import { AtlasTypographyNames } from 'typings/atlas-theme';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            margin: 0,
        },
        /* Styles applied to the root element if `variant="promo2"`. */
        promo2: theme.atlas.typography.promo2,
        /* Styles applied to the root element if `variant="promo1"`. */
        promo1: theme.atlas.typography.promo1,
        /* Styles applied to the root element if `variant="header2"`. */
        header2: theme.atlas.typography.header2,
        /* Styles applied to the root element if `variant="header"`. */
        header: theme.atlas.typography.header,
        /* Styles applied to the root element if `variant="title"`. */
        title: theme.atlas.typography.title,
        /* Styles applied to the root element if `variant="subtitle"`. */
        subtitle: theme.atlas.typography.subtitle,
        /* Styles applied to the root element if `variant="body6"`. */
        body6: theme.atlas.typography.body6,
        /* Styles applied to the root element if `variant="body5"`. */
        body5: theme.atlas.typography.body5,
        /* Styles applied to the root element if `variant="body4"`. */
        body4: theme.atlas.typography.body4,
        /* Styles applied to the root element if `variant="body3"`. */
        body3: theme.atlas.typography.body3,
        /* Styles applied to the root element if `variant="body2"`. */
        body2: theme.atlas.typography.body2,
        /* Styles applied to the root element if `variant="body1"`. */
        body1: theme.atlas.typography.body1,
        /* Styles applied to the root element if `variant="caption"`. */
        caption: theme.atlas.typography.caption,
        /* Styles applied to the root element if `variant="micro"`. */
        micro: theme.atlas.typography.micro,
        /* Styles applied to the root element if `align="left"`. */
        alignLeft: {
            textAlign: 'left',
        },
        /* Styles applied to the root element if `align="center"`. */
        alignCenter: {
            textAlign: 'center',
        },
        /* Styles applied to the root element if `align="right"`. */
        alignRight: {
            textAlign: 'right',
        },
        /* Styles applied to the root element if `align="justify"`. */
        alignJustify: {
            textAlign: 'justify',
        },
        /* Styles applied to the root element if `nowrap={true}`. */
        noWrap: {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
        },
        /* Styles applied to the root element if `gutterBottom={true}`. */
        gutterBottom: {
            marginBottom: '0.35em',
        },
        /* Styles applied to the root element if `paragraph={true}`. */
        paragraph: {
            marginBottom: 16,
        },
        /* Styles applied to the root element if `color="inherit"`. */
        colorInherit: {
            color: 'inherit',
        },
        /* Styles applied to the root element if `color="primary"`. */
        colorPrimary: {
            color: theme.palette.primary.main,
        },
        /* Styles applied to the root element if `color="secondary"`. */
        colorSecondary: {
            color: theme.palette.secondary.main,
        },
        /* Styles applied to the root element if `color="textPrimary"`. */
        colorTextPrimary: {
            color: theme.palette.text.primary,
        },
        /* Styles applied to the root element if `color="textSecondary"`. */
        colorTextSecondary: {
            color: theme.palette.text.secondary,
        },
        /* Styles applied to the root element if `color="error"`. */
        colorError: {
            color: theme.palette.error.main,
        },
        /* Styles applied to the root element if `display="inline"`. */
        displayInline: {
            display: 'inline',
        },
        /* Styles applied to the root element if `display="block"`. */
        displayBlock: {
            display: 'block',
        },
        /* Styles applied to the root element if `weight="regular"`. */
        weightRegular: {
            fontWeight: 400,
        },
        /* Styles applied to the root element if `weight="medium"`. */
        weightMedium: {
            fontWeight: 500,
        },
        /* Styles applied to the root element if `weight="bold"`. */
        weightBold: {
            fontWeight: 700,
        },
    }),
    { name: 'Typo' }
);

const defaultVariantMapping: Record<AtlasTypographyNames, React.ElementType> = {
    promo2: 'h1',
    promo1: 'h2',
    header2: 'h3',
    header: 'h3',
    title: 'h6',
    subtitle: 'h6',
    body6: 'p',
    body5: 'p',
    body4: 'p',
    body3: 'p',
    body2: 'p',
    body1: 'p',
    caption: 'p',
    micro: 'p',
};

type Props<C extends React.ElementType = 'span'> = Omit<
    TypographyProps<C, { component?: C }>,
    'classes' | 'variant' | 'variantMapping' | 'color'
> & {
    color?: string;
    weight?: 'regular' | 'medium' | 'bold' | 'inherit';
    variant?: AtlasTypographyNames;
    variantMapping?: Partial<Record<AtlasTypographyNames, React.ElementType>>;
};

export const Typo = React.forwardRef(function Typo<
    T extends React.ElementType = 'span'
>(props: Props<T>, ref: any) {
    const {
        align = 'inherit',
        className,
        color = 'initial',
        component,
        display = 'initial',
        gutterBottom = false,
        noWrap = false,
        paragraph = false,
        variant = 'body1',
        variantMapping = defaultVariantMapping,
        weight = 'regular',
        ...other
    } = props;

    const classes = useStyles();

    const Component: React.ElementType =
        component ||
        (paragraph
            ? 'p'
            : variantMapping[variant] || defaultVariantMapping[variant]) ||
        'span';

    return (
        <>
            <Component
                className={clsx(
                    classes.root,
                    {
                        [classes[variant]]: variant,
                        // @ts-ignore
                        [classes[`color${upperFirst(color)}`]]:
                            color !== 'initial',
                        [classes.noWrap]: noWrap,
                        [classes.gutterBottom]: gutterBottom,
                        [classes.paragraph]: paragraph,
                        // @ts-ignore
                        [classes[`align${upperFirst(align)}`]]:
                            align !== 'inherit',
                        // @ts-ignore
                        [classes[`display${upperFirst(display)}`]]:
                            display !== 'initial',
                        // @ts-ignore
                        [classes[`weight${upperFirst(weight)}`]]:
                            weight !== 'inherit',
                    },
                    className
                )}
                ref={ref as any}
                {...other}
            />
        </>
    );
});
