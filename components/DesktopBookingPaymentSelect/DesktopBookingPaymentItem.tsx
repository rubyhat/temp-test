import React, { FC, ReactNode } from 'react';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { Typo } from 'components/Typo/Typo';
import { currencySymbol, CurrencySymbol } from 'utils/currency';
import { formatPrice } from 'utils/price';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            backgroundColor: '#FFF',
            borderRadius: theme.shape.borderRadius,
            border: `1px solid ${theme.palette.primary.main}`,
            padding: theme.spacing(3),
            cursor: 'pointer',
        },
        /* Pseudo-class applied to the root element if `disabled={true}`. */
        disabled: {
            opacity: 0.5,
            borderColor: theme.palette.text.disabled,
        },
        /* Pseudo-class applied to the root element if `selected={true}`. */
        selected: {
            backgroundColor: theme.palette.primary.main,
            color: '#FFF',
        },
        /* Styles applied to the container `div` element. */
        container: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        /* Styles applied to the title `div` element. */
        title: {
            color: theme.palette.primary.main,
        },
        /* Pseudo-class applied to the title `div` element if `disabled={true}`. */
        titleDisabled: {
            color: theme.palette.text.primary,
        },
        /* Pseudo-class applied to the title `div` element if `selected={true}`. */
        titleSelected: {
            color: '#FFF',
        },
        /* Styles applied to the subtitle `div` element. */
        subtitle: {
            color: theme.atlas.palette.text.minor,
        },
        /* Pseudo-class applied to the subtitle `div` element if `disabled={true}`. */
        subtitleDisabled: {
            color: theme.palette.text.primary,
        },
        /* Pseudo-class applied to the subtitle `div` element if `selected={true}`. */
        subtitleSelected: {
            color: theme.atlas.palette.textInv.minor,
        },
        /* Styles applied to the price element. */
        price: {
            fontWeight: 700,
            color: theme.palette.primary.main,
        },
        /* Pseudo-class applied to the subtitle `div` element if `disabled={true}`. */
        priceDisabled: {
            color: theme.palette.text.secondary,
        },
        /* Pseudo-class applied to the subtitle `div` element if `selected={true}`. */
        priceSelected: {
            color: '#FFF',
        },
    }),
    { name: 'DesktopBookingPaymentItem' }
);

export type Props = {
    title: string;
    subtitle?: ReactNode;
    price: number;
    currency: string;
    selected?: boolean;
    disabled?: boolean;
    onClick: () => void;
    className?: string;
};

export const DesktopBookingPaymentItem: FC<Props> = props => {
    const {
        title,
        subtitle,
        price,
        currency,
        selected,
        disabled,
        onClick,
        className,
    } = props;
    const classes = useStyles();

    const handleClick = () => {
        if (!disabled) onClick();
    };

    return (
        <div
            onClick={handleClick}
            className={clsx(classes.root, className, {
                [classes.selected]: selected,
                [classes.disabled]: disabled,
            })}
        >
            <div className={classes.container}>
                <div>
                    <Typo
                        className={clsx(classes.title, {
                            [classes.titleSelected]: selected,
                            [classes.titleDisabled]: disabled,
                        })}
                    >
                        {title}
                    </Typo>
                    {subtitle ? (
                        <Typo
                            className={clsx(classes.subtitle, {
                                [classes.subtitleSelected]: selected,
                                [classes.subtitleDisabled]: disabled,
                            })}
                            variant="caption"
                        >
                            {subtitle}
                        </Typo>
                    ) : null}
                </div>

                <div>
                    <Typo
                        className={clsx(classes.price, {
                            [classes.priceSelected]: selected,
                            [classes.priceDisabled]: disabled,
                        })}
                    >
                        {formatPrice(price, currency)}
                    </Typo>
                </div>
            </div>
        </div>
    );
};
