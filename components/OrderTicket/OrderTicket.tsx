import React, { FC } from 'react';
import { fade, makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import parseISO from 'date-fns/parseISO';

import {
    OrderCheckDto,
    OrderDto,
    OrderDtoPaymentMethodEnum,
    TicketDto,
} from 'swagger/client';
import { Typo } from '../Typo/Typo';
import { useTranslation } from 'i18n';
import { CurrencySymbol } from 'utils/currency';
import { Button } from '../ui/Button';
import { OrderTicketReturnDialog } from '../OrderTicketReturnDialog';
import { format } from 'utils/date';
import { useOrderTicket } from 'hooks/useOrderTicket';
import { TicketDetailsList } from 'components/TicketDetailsList';
import { useCountry } from 'hooks/useCountry';
import { AtlasTheme } from 'typings/atlas-theme';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import { usePlatform } from 'hooks/usePlatform';
import { List } from 'components/ui/List/List';
import ListItemText from '@material-ui/core/ListItemText';
import { useSAAS } from 'hooks/useSAAS';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            backgroundColor: '#FFF',
            paddingBottom: theme.spacing(2),
        },
        /* Styles applied to the ticket `div` element. */
        ticket: {
            marginTop: theme.spacing(2),
        },
        /* Styles applied to the ticket actions `div` element. */
        actions: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2),
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
        /* Styles applied to the order cancelled date `div` element. */
        ticketCancelledDate: {
            marginTop: theme.spacing(1),
        },
        downloadList: {
            width: '100%',
            padding: 0,
            marginTop: '-8px',
        },
        downloadIcon: {
            marginLeft: theme.spacing(1),
        },
        downloadButton: {
            fontSize: '15px',
            padding: 0,
            minHeight: '30px',
        },
    }),
    { name: 'OrderTicket' }
);

type Props = {
    order: OrderDto;
    ticket: TicketDto;
    currency?: CurrencySymbol;
    onReturnTicket: (ticketId: string) => void;
};

export const OrderTicket: FC<Props> = props => {
    const { order, ticket, currency = 'RUB', onReturnTicket } = props;
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
        <div className={classes.root}>
            <div className={classes.ticket}>
                <TicketDetailsList
                    ticket={ticket}
                    discountPrice={discountPrice}
                    currencyPaid={currencyPaid}
                    paymentMethod={order.paymentMethod}
                />

                <List
                    className={classes.downloadList}
                    disablePadding={isDesktop}
                >
                    {canDownloadTicket && !isMioTaxi ? (
                        <Grid item xs={12} md={6}>
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
                        </Grid>
                    ) : null}

                    {canDownloadChecks &&
                        canDownloadChecks.map((check: OrderCheckDto) => (
                            <React.Fragment key={check.link}>
                                <Divider
                                    component="li"
                                    variant={dividerVariant}
                                />
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
            </div>

            {canCancelTicket ? (
                <div className={classes.actions}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            {order.paymentMethod ===
                            OrderDtoPaymentMethodEnum.Card ? (
                                <Button
                                    onClick={handleClickReturnTicket}
                                    variant="outlined"
                                    fullWidth
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
                                    fullWidth
                                    className={classes.cancelButton}
                                >
                                    {t('order:cancelTicket', {
                                        context: country,
                                    })}
                                </Button>
                            )}
                        </Grid>
                    </Grid>
                </div>
            ) : null}

            {ticket.cancelledAt ? (
                <div className={classes.ticketCancelledDate}>
                    <Typo
                        variant="caption"
                        color="textSecondary"
                        align="center"
                    >
                        {t('order:orderCancelledAt', {
                            date: format(
                                new Date(ticket.cancelledAt),
                                'dd.LL.yyyy'
                            ),
                            time: format(new Date(ticket.cancelledAt), 'HH:mm'),
                        })}
                    </Typo>
                </div>
            ) : null}

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
