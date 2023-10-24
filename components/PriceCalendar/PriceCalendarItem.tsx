import React, { EventHandler, FC, ChangeEvent, MouseEvent } from 'react';
import Box from '@material-ui/core/Box';
import ButtonBase from '@material-ui/core/ButtonBase';
import SearchIcon from '@material-ui/icons/Search';
import clsx from 'clsx';
import parseISO from 'date-fns/parseISO';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { Typo } from '../Typo/Typo';
import { currencySymbol, CurrencySymbol } from 'utils/currency';
import { format } from 'utils/date';
import { formatPrice } from 'utils/price';
import { useTranslation } from 'i18n';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: theme.spacing(2),
            minWidth: 120,
            height: 85,
            [theme.breakpoints.up('md')]: {
                minWidth: 148,
            },
            textAlign: 'left',
            alignItems: 'flex-start',
        },
        /* Pseudo-class applied to the root element if selected={true} */
        selected: {},
        /* Styles applied to the price `Typo` component. */
        price: {
            textAlign: 'left',
        },
        /* Pseudo-class applied to the price `Typo` component if priceLow={true} */
        priceLow: {
            color: theme.palette.secondary.main,
        },
        /* Pseudo-class applied to the price `Typo` component if priceHigh={true} */
        priceHigh: {
            color: theme.atlas.palette.text.base,
        },
        /* Pseudo-class applied to the price `Typo` component if no price */
        priceNone: {
            color: theme.atlas.palette.text.disabled,
        },
        /* Styles applied to the date `Typo` component. */
        date: {},
        searchBoxIcon: {
            color: theme.atlas.palette.text.minor,
            fontSize: 28,
        },
    }),
    { name: 'PriceCalendarItem' }
);

type Props = {
    value?: string;
    onChange?: (
        event: ChangeEvent<{ checked: boolean }>,
        value: string
    ) => void;
    onClick?: EventHandler<any>;
    price: number;
    priceLow?: boolean;
    priceHigh?: boolean;
    currency?: CurrencySymbol;
    date: string; // ISO
    selected?: boolean;
};

export const PriceCalendarItem: FC<Props> = React.forwardRef<
    HTMLDivElement,
    Props
>((props, ref) => {
    const {
        price,
        priceLow,
        priceHigh,
        currency,
        date,
        selected,
        onClick,
        onChange,
        value,
    } = props;
    const classes = useStyles();
    const { t } = useTranslation();

    const showPrice = price && currency;
    const formattedPrice = currency
        ? t('from') + ' ' + formatPrice(price, currencySymbol[currency])
        : '';
    const formattedDate = format(parseISO(date), 'd MMM, EEEEEE');

    const handleClick = (event: MouseEvent<any>) => {
        if (onChange && value) {
            onChange(
                {
                    ...event,
                    target: {
                        ...event.target,
                        checked: true,
                    },
                },
                value
            );
        }

        if (onClick) {
            onClick(event);
        }
    };

    return (
        <ButtonBase
            className={clsx(classes.root, {
                [classes.selected]: selected,
            })}
            onClick={handleClick}
            // При использовани стандартного button портятся стили шрифтов
            component="div"
        >
            {showPrice ? (
                <Typo
                    className={clsx(classes.price, {
                        [classes.priceNone]: !showPrice,
                        [classes.priceLow]: priceLow,
                        [classes.priceHigh]: priceHigh,
                    })}
                    variant="subtitle"
                    weight="bold"
                >
                    {formattedPrice}
                </Typo>
            ) : (
                <Box display="flex" alignItems="center">
                    <SearchIcon className={classes.searchBoxIcon} />
                </Box>
            )}

            <Typo className={classes.date} color="textSecondary">
                {formattedDate}
            </Typo>
        </ButtonBase>
    );
});
