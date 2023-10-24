import React, { ChangeEvent, FC, useState } from 'react';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import ArrowForwardIos from '@material-ui/icons/ArrowForwardIos';
import upperFirst from 'lodash/upperFirst';

import { Button } from '../ui/Button';
import { NativeSelect } from '../NativeSelect';
import {
    NewPassengerDialog,
    PassengerDetailsFormData,
} from '../NewPassengerDialog';
import { List } from '../ui/List/List';
import { Typo } from '../Typo/Typo';
import {
    DocTypesDto,
    GenderTypesDto,
    PersonalDataDto,
    TicketTypeDto,
} from 'swagger/client';
import { useTranslation } from 'i18n';
import { CurrencySymbol, currencySymbol } from 'utils/currency';
import { formatPassengerName, formatPassengerData } from 'utils/passenger';
import { rideMinPrice } from 'utils/ride';
import { AtlasTheme } from 'typings/atlas-theme';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { BookingState } from 'store/booking/types';
import { Divider } from '@material-ui/core';

export type PassengerFormData = {
    id: number;
    /**
     * NewPassengerDialog state.
     */
    lastName: string;
    firstName: string;
    middleName: string;
    birthDate: string; // ISO format
    genderCode: string;

    /**
     * NewPassengerDialog state (passport data).
     */
    docTypeCode: string;
    docNumber: string;
    citizenshipCode: string;

    /**
     * NewPassenger state.
     */
    ticketTypeCode: string;
};

export type PassengerTicketFormData = Pick<PassengerFormData, 'ticketTypeCode'>;

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            marginTop: theme.spacing(2),
            padding: theme.spacing(2),
            paddingBottom: 0,
            backgroundColor: '#FFF',
            boxShadow: theme.atlas.shadows.bottom,
            borderRadius: theme.spacing(1),
        },
        passenger: {
            display: 'flex',
            flexDirection: 'column',
        },
        passengerTitle: {
            fontSize: theme.atlas.typography.body1.fontSize,
            fontWeight: 700,
            color: theme.atlas.palette.text.base,
            flexGrow: 1,
            marginBottom: theme.spacing(1),
        },
        /* Styles applied to the Select component. */
        select: {
            width: '100%',
            paddingRight: '76px',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            // width: '55%',
        },
        /* Styles applied to the Button component. */
        button: {
            marginTop: theme.spacing(2),
        },
        buttonError: {
            marginTop: theme.spacing(2),
            borderColor: '#E62E4F',
            color: '#E62E4F',
        },
        /* Styles applied to the ArrowForwardIos component. */
        icon: {
            fontSize: 12,
        },
        divider: {
            marginTop: theme.spacing(2),
        },
    }),
    { name: 'NewPassenger' }
);

export type BookField =
    | 'name'
    | 'email'
    | 'document'
    | 'gender'
    | 'surname'
    | 'phone'
    | 'birthDate'
    | 'patronymic'
    | 'citizenship';

export type Props = {
    title: string;
    ticketTypes: TicketTypeDto[];
    docTypes: DocTypesDto[];
    genderTypes: GenderTypesDto[];
    bookFields?: BookField[];
    initialData?: PassengerFormData | null;
    onSubmit: (data: PassengerFormData | null) => void;
    currency: CurrencySymbol;
    className?: string;
    documents?: PersonalDataDto[];
    handleTicketPriceChange?: (ticket: TicketTypeDto) => void;
    paymentTypes?: string[];
};

export const NewPassenger: FC<Props> = props => {
    const {
        ticketTypes,
        docTypes,
        genderTypes,
        bookFields = [],
        onSubmit,
        title,
        initialData = null,
        className,
        currency,
        documents = [],
        handleTicketPriceChange,
        paymentTypes = [],
    } = props;
    const { t } = useTranslation();
    let passengerTicketInitialData: PassengerTicketFormData | null = null;
    let passengerDetailsInitialData: PassengerDetailsFormData | null = null;

    if (initialData) {
        let { ticketTypeCode, ...rest } = initialData;

        passengerTicketInitialData = {
            ticketTypeCode: ticketTypeCode,
        };

        passengerDetailsInitialData = {
            ...rest,
        };
    }

    const classes = useStyles();

    const [passengerTicketFormData, setPassengerTicketFormData] = useState<
        PassengerTicketFormData
    >({
        ticketTypeCode: ticketTypes[0].code,
        ...passengerTicketInitialData,
    });
    const [
        passengerDetailsFormData,
        setPassengerDetailsFormData,
    ] = useState<PassengerDetailsFormData | null>(passengerDetailsInitialData);

    const [open, setOpen] = useState(false);
    const handleClose = () => {
        document.body.style.overflow = 'auto';
        setOpen(false);
    };
    const handlePassengerDetailsSubmit = (data: PassengerDetailsFormData) => {
        setPassengerDetailsFormData(data);
        document.body.style.overflow = 'auto';
        setOpen(false);

        if (data) {
            onSubmit({
                ...passengerTicketFormData,
                ...data,
            });
        }
    };

    const handleAddButtonClick = () => {
        document.body.style.overflow = 'hidden';
        setOpen(true);
    };
    const handleListItemClick = () => {
        document.body.style.overflow = 'hidden';
        setOpen(true);
    };

    const handleTicketTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setPassengerTicketFormData({
            ...passengerTicketFormData,
            ticketTypeCode: e.target.value,
        });

        if (passengerDetailsFormData) {
            onSubmit({
                ...passengerTicketFormData,
                ticketTypeCode: e.target.value,
                ...passengerDetailsFormData,
            });
        }

        if (handleTicketPriceChange) {
            const ticket = ticketTypes.find(
                ticket => ticket.code === e.target.value
            );

            if (ticket) {
                handleTicketPriceChange(ticket);
            }
        }
    };

    const renderTicketTypeLabel = () => {
        const ticket = ticketTypes.find(
            ticket => ticket.code === passengerTicketFormData.ticketTypeCode
        );

        return (
            ticket &&
            `${rideMinPrice(ticket.price, ticket.onlinePrice, paymentTypes)} ${
                currencySymbol[currency]
            }`
        );
    };

    const { fireFormValidate } = useSelector<RootState, BookingState>(
        rootState => rootState.booking
    );

    return (
        <div className={clsx(classes.root, className)}>
            <div className={classes.passenger}>
                <div className={classes.passengerTitle}>{title}</div>
                <NativeSelect
                    className={classes.select}
                    value={passengerTicketFormData.ticketTypeCode}
                    onChange={handleTicketTypeChange}
                    renderLabel={renderTicketTypeLabel}
                >
                    {ticketTypes.map(ticket => (
                        <option value={ticket.code} key={ticket.code}>
                            {ticket.type === 'custom'
                                ? ticket.name
                                : t(
                                      `booking:ticketType${upperFirst(
                                          ticket.type
                                      )}`
                                  )}
                        </option>
                    ))}
                </NativeSelect>
            </div>
            <Divider className={classes.divider} />
            {bookFields.length ? (
                passengerDetailsFormData ? (
                    <List>
                        <ListItem disableGutters onClick={handleListItemClick}>
                            <ListItemText
                                primary={
                                    <Typo
                                        component="span"
                                        variant="body1"
                                        color="textPrimary"
                                    >
                                        {formatPassengerName(
                                            passengerDetailsFormData.lastName,
                                            passengerDetailsFormData.firstName,
                                            passengerDetailsFormData.middleName,
                                            bookFields
                                        )}
                                    </Typo>
                                }
                                secondary={
                                    <Typo
                                        component="span"
                                        variant="caption"
                                        color="textSecondary"
                                    >
                                        {formatPassengerData(
                                            t,
                                            passengerDetailsFormData.genderCode,
                                            passengerDetailsFormData.birthDate,
                                            passengerDetailsFormData.docNumber,
                                            bookFields
                                        )}
                                    </Typo>
                                }
                            />
                            <ListItemSecondaryAction>
                                <IconButton edge="end">
                                    <ArrowForwardIos className={classes.icon} />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    </List>
                ) : (
                    <Button
                        onClick={handleAddButtonClick}
                        className={
                            fireFormValidate && !passengerDetailsFormData
                                ? classes.buttonError
                                : classes.button
                        }
                        variant="outlined"
                        color="primary"
                        fullWidth
                    >
                        {t('booking:addPassengerData')}
                    </Button>
                )
            ) : null}
            <NewPassengerDialog
                title={title}
                docTypes={docTypes}
                genderTypes={genderTypes}
                bookFields={bookFields}
                documents={documents}
                open={open}
                onClose={handleClose}
                onSubmit={handlePassengerDetailsSubmit}
                initialData={passengerDetailsInitialData}
            />
        </div>
    );
};
