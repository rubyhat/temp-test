import React, { FC } from 'react';
import { fade, makeStyles, Theme } from '@material-ui/core/styles';
import parseISO from 'date-fns/parseISO';
import clsx from 'clsx';

import { Button } from '../ui/Button';
import { CurrencySymbol } from 'utils/currency';
import {
    OrderCheckDto,
    OrderDto,
    OrderDtoPaymentMethodEnum,
    TicketDto,
} from 'swagger/client';
import { OrderTicketReturnDialog } from '../OrderTicketReturnDialog';
import { TicketDetailsList } from '../TicketDetailsList';
import { Typo } from '../Typo/Typo';
import { format } from 'utils/date';
import { useOrderTicket } from 'hooks/useOrderTicket';
import { useTranslation } from 'i18n';
import { useCountry } from 'hooks/useCountry';
import { AtlasTheme } from 'typings/atlas-theme';
import { List } from 'components/ui/List/List';
import { Divider, ListItem, ListItemText } from '@material-ui/core';
import { usePlatform } from 'hooks/usePlatform';
import { useSAAS } from 'hooks/useSAAS';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            backgroundColor: '#FFF',
            boxShadow: theme.atlas.shadows.bottom,
            borderRadius: theme.shape.borderRadius,
            padding: theme.spacing(2),
            minHeight: '302px',
        },
        /* Styles applied to the `TicketDetailsList` component. */
        ticketDetails: {},
        /* Styles applied to the ticket actions `div` element. */
        actions: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: theme.spacing(1),
            '& > button:last-child': {
                marginLeft: theme.spacing(1),
            },
        },
        downloadList: {
            width: '100%',
        },
        downloadIcon: {
            marginLeft: theme.spacing(1),
        },
        downloadButton: {
            fontSize: '15px',
            paddingTop: 0,
            paddingBottom: 0,
            minHeight: '30px',
        },
        /* Styles applied to the cancel `Button` component. */
        cancelButton: {
            color: theme.atlas.palette.text.alert,
            '&.MuiButton-outlined': {
                border: `1px solid ${theme.atlas.palette.text.alert}`,
                '&:hover': {
                    backgroundColor: fade(theme.atlas.palette.text.alert, 0.08),
                },
                '&:active': {
                    backgroundColor: fade(theme.atlas.palette.text.alert, 0.16),
                },
            },
        },
        /* Styles applied to the spacer `div` element. */
        spacer: {
            flexGrow: 1,
        },
    }),
    { name: 'DesktopOrderTicket' }
);

type Props = {
    order: OrderDto;
    ticket: TicketDto;
    currency?: CurrencySymbol;
    onReturnTicket: (ticketId: string) => void;
    className?: string;
};

export const DesktopOrderTicket: FC<Props> = props => {
    const {
        order,
        ticket,
        currency = 'RUB',
        onReturnTicket,
        className,
    } = props;
    const { passenger } = ticket;
    const classes = useStyles();
    const { t } = useTranslation();
    const { country } = useCountry();
    const { isDesktop } = usePlatform();

    const {
        cancelDialogOpen,
        canCancelTicket,
        canDownloadTicket,
        canDownloadChecks,
        discountPrice,
        currencyPaid,
        handleDialogClose,
        handleClickReturnTicket,
    } = useOrderTicket(order, ticket, currency);

    const dividerVariant = isDesktop ? 'fullWidth' : 'middle';
    const { isMioTaxi } = useSAAS();

    return (
        <div className={clsx(classes.root, className)}>
            <Typo variant="subtitle" weight="bold">
                {passenger.firstName}{' '}
                {passenger.middleName === 'NA' ||
                passenger.middleName === undefined
                    ? ''
                    : passenger.middleName + ' '}
                {passenger.lastName}
            </Typo>

            <TicketDetailsList
                className={classes.ticketDetails}
                ticket={ticket}
                discountPrice={discountPrice}
                currencyPaid={currencyPaid}
                paymentMethod={order.paymentMethod}
            />

            <List className={classes.downloadList} disablePadding={isDesktop}>
                {canDownloadTicket && !isMioTaxi ? (
                    <>
                        <Divider component="li" variant={dividerVariant} />
                        <ListItem disableGutters={isDesktop}>
                            <ListItemText
                                primary={
                                    <Typo color="textSecondary">
                                        {t('order:ticket')}
                                    </Typo>
                                }
                            ></ListItemText>
                            <Button
                                variant="text"
                                color="primary"
                                href={ticket.url}
                                className={classes.downloadButton}
                            >
                                {t('order:downloadTicket')}
                                <img
                                    className={classes.downloadIcon}
                                    src="/static/img/icon-download-file.svg"
                                    alt="download"
                                />
                            </Button>
                        </ListItem>
                    </>
                ) : null}

                {canDownloadChecks &&
                    canDownloadChecks.map((check: OrderCheckDto) => (
                        <React.Fragment key={check.link}>
                            <Divider component="li" variant={dividerVariant} />
                            <ListItem disableGutters={isDesktop}>
                                <ListItemText
                                    primary={
                                        <Typo color="textSecondary">
                                            {t('order:ticketCheck')}
                                        </Typo>
                                    }
                                ></ListItemText>
                                <Button
                                    variant="text"
                                    color="primary"
                                    href={check.link}
                                    className={classes.downloadButton}
                                >
                                    {check.type === 'payment'
                                        ? t('order:downloadCheckPayment')
                                        : t('order:downloadCheckRefund')}
                                    <img
                                        className={classes.downloadIcon}
                                        src="/static/img/icon-download-file.svg"
                                        alt="download"
                                    />
                                </Button>
                            </ListItem>
                        </React.Fragment>
                    ))}
            </List>

            <div className={classes.actions}>
                {ticket.cancelledAt ? (
                    <div>
                        <Typo variant="caption" color="textSecondary">
                            {t('order:orderCancelledAt', {
                                date: format(
                                    new Date(ticket.cancelledAt),
                                    'dd.LL.yyyy'
                                ),
                                time: format(
                                    new Date(ticket.cancelledAt),
                                    'HH:mm'
                                ),
                            })}
                        </Typo>
                    </div>
                ) : null}

                <div className={classes.spacer} />

                {canCancelTicket ? (
                    order.paymentMethod === OrderDtoPaymentMethodEnum.Card ? (
                        <Button
                            onClick={handleClickReturnTicket}
                            variant="outlined"
                            className={classes.cancelButton}
                        >
                            {t('order:returnTicket', {
                                context: country,
                            })}
                        </Button>
                    ) : (
                        <Button
                            onClick={handleClickReturnTicket}
                            variant="outlined"
                            className={classes.cancelButton}
                        >
                            {t('order:cancelTicket', {
                                context: country,
                            })}
                        </Button>
                    )
                ) : null}
            </div>

            {canCancelTicket ? (
                <OrderTicketReturnDialog
                    open={cancelDialogOpen}
                    onClose={handleDialogClose}
                    onReturnTicket={onReturnTicket}
                    ticket={ticket}
                    order={order}
                    currency={currency}
                />
            ) : null}
        </div>
    );
};
