import React, { ChangeEvent, FC, useRef } from 'react';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import clsx from 'clsx';
import upperFirst from 'lodash/upperFirst';
import { FormControlProps } from '@material-ui/core/FormControl';
import { MenuProps } from '@material-ui/core/Menu';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { CurrencySymbol, currencySymbol } from 'utils/currency';
import { TicketTypeDto } from 'swagger/client';
import { rideMinPrice } from 'utils/ride';
import { useTranslation } from 'i18n';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {},
        /* Styles applied to the `Paper` component. */
        paper: {
            boxShadow: theme.atlas.shadows.fly,
        },
        /* Styles applied to the `FormControl` component. */
        formControl: {
            minWidth: 200,
        },
        /* Styles applied to the menu item `div` element. */
        item: {
            display: 'flex',
            justifyContent: 'space-between',
            flexGrow: 1,
        },
        /* Styles applied to the menu item price `div` element. */
        price: {
            color: theme.atlas.palette.text.minor,
            paddingRight: theme.spacing(1),
        },
        ticketName: {
            maxWidth: '106px',
            whiteSpace: 'initial',
        },
    }),
    { name: 'TicketTypeSelect' }
);

type Props = {
    value: string;
    onChange: (code: string) => void;
    ticketTypes: TicketTypeDto[];
    currency: CurrencySymbol;
    className?: string;
    paymentTypes?: string[];
} & Pick<FormControlProps, 'fullWidth'>;

export const TicketTypeSelect: FC<Props> = props => {
    const {
        value,
        onChange,
        ticketTypes,
        currency,
        className,
        paymentTypes = [],
        ...formControlProps
    } = props;
    const classes = useStyles();
    const { t } = useTranslation();

    const { current: menuProps } = useRef<Partial<MenuProps>>({
        anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
        },
        transformOrigin: {
            vertical: 'top',
            horizontal: 'left',
        },
        getContentAnchorEl: null,
        PaperProps: {
            className: classes.paper,
        },
    });

    const getTicketName = (ticket: TicketTypeDto) => {
        return ticket.type === 'custom'
            ? ticket.name
            : t(`booking:ticketType${upperFirst(ticket.type)}`);
    };

    const handleChange = (e: ChangeEvent<{ value?: unknown }>) => {
        onChange(e.target.value as string);
    };

    return (
        <div className={clsx(classes.root, className)}>
            <FormControl
                variant="outlined"
                className={classes.formControl}
                placeholder={t('booking:ticketType')}
                {...formControlProps}
            >
                <Select
                    value={value}
                    onChange={handleChange}
                    MenuProps={menuProps}
                >
                    {ticketTypes.map((ticket, i) => (
                        <MenuItem value={ticket.code} key={i}>
                            <div className={classes.item}>
                                <div className={classes.ticketName}>
                                    {getTicketName(ticket)}
                                </div>
                                <div className={classes.price}>
                                    {rideMinPrice(
                                        ticket.price,
                                        ticket.onlinePrice,
                                        paymentTypes
                                    )}{' '}
                                    {currencySymbol[currency]}
                                </div>
                            </div>
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
};
