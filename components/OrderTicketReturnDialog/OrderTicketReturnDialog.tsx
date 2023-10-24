import React, { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';

import { ActionBar } from '../ActionBar';
import { Button } from '../ui/Button';
import { CurrencySymbol, currencySymbol } from 'utils/currency';
import { List } from '../ui/List/List';
import { MobileDialog } from '../ui/MobileDialog';
import { RootState } from 'store';
import { Stub } from '../Stub/Stub';
import {
    TICKET_CANCEL,
    TICKET_ERROR,
    TICKET_SUCCESS,
    TicketState,
} from 'store/ticket/types';
import {
    OrderDto,
    OrderDtoPaymentMethodEnum,
    RideDto,
    TicketDto,
} from 'swagger/client';
import { Typo } from '../Typo/Typo';
import { useTranslation } from 'i18n';
import apiClient from 'lib/apiClient';
import useSnackBar from '../ui/Snackbar/useSnackbar';
import { AppBar } from '../AppBar';
import { usePlatform } from 'hooks/usePlatform';
import { useCountry } from 'hooks/useCountry';
import { AtlasTheme } from 'typings/atlas-theme';
import { useSAAS } from 'hooks/useSAAS';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {},
        /* Styles applied to the `List` component. */
        list: {
            backgroundColor: '#FFF',
            marginTop: theme.spacing(2),
        },
        desktopContainer: {
            backgroundColor: theme.atlas.palette.background.deepCold,
        },
        desktopButtonContainer: {
            backgroundColor: '#FFF',
            marginTop: theme.spacing(2),
            padding: theme.spacing(2),
            textAlign: 'center',
        },
    }),
    { name: 'OrderTicketReturnDialog' }
);

type Props = {
    open: boolean;
    onClose: () => void;
    ticket: TicketDto;
    order: OrderDto;
    currency: CurrencySymbol;
    onReturnTicket: (ticketId: string) => void;
};

export const OrderTicketReturnDialog: FC<Props> = props => {
    const { open, onClose, ticket, order, currency, onReturnTicket } = props;
    const rideInfo = order.rideInfo as RideDto;
    const { passenger } = ticket;
    const classes = useStyles();
    const { t } = useTranslation();
    const { country } = useCountry();
    const { isDesktop } = usePlatform();
    const [, snackbar] = useSnackBar();
    const { isMioTaxi, isCompasBus } = useSAAS();

    const { status } = useSelector<RootState, TicketState>(
        rootState => rootState.ticket
    );
    const handleReturnTicket = () => onReturnTicket(ticket.id);

    const pricePaid = ticket.paid || ticket.price;
    const currencyPaid =
        order.paymentMethod === OrderDtoPaymentMethodEnum.Miles
            ? t('booking:miles', { count: pricePaid })
            : currencySymbol[rideInfo.currency as CurrencySymbol];

    const [refundAmount, setRefundAmount] = useState(0);
    const refundAmountPercentage = Math.floor(
        100 - (refundAmount * 100) / pricePaid
    );

    const canCancel =
        status !== TICKET_CANCEL &&
        (order.paymentMethod === OrderDtoPaymentMethodEnum.Cash ||
            refundAmount > 0);

    const paidInCash = order.paymentMethod === OrderDtoPaymentMethodEnum.Cash;

    useEffect(() => {
        async function calcRefund() {
            try {
                const { data } = await apiClient.calcRefund(ticket.id);
                const amount = (data.amount && data.amount[0].price) || 0; // @todo Backend types
                setRefundAmount(amount);
            } catch (err) {}
        }

        if (open) calcRefund();
    }, [ticket, open]);

    useEffect(() => {
        if (status === TICKET_SUCCESS) {
            snackbar({
                type: 'show',
                payload: {
                    message: t('order:returnTicketSuccess', {
                        context: country,
                    }),
                    variant: 'success',
                },
            });
        } else if (status === TICKET_ERROR) {
            snackbar({
                type: 'show',
                payload: {
                    message: t('order:returnTicketError'),
                    variant: 'alert',
                },
            });
        }
    }, [status]);

    const renderList = () => {
        return (
            <>
                <List className={classes.list}>
                    <ListItem>
                        <ListItemText
                            primary={
                                <Typo weight="bold">
                                    {passenger.firstName}{' '}
                                    {passenger.middleName === 'NA' ||
                                    passenger.middleName === undefined
                                        ? ''
                                        : passenger.middleName + ' '}
                                    {passenger.lastName}
                                </Typo>
                            }
                        />
                    </ListItem>

                    <Divider component="li" variant="middle" />

                    {!isMioTaxi && !isCompasBus && (
                        <ListItem>
                            <ListItemText
                                primary={
                                    <Typo color="textSecondary">
                                        {t('order:ticketNumber')}
                                    </Typo>
                                }
                            />
                            <ListItemSecondaryAction>
                                <ListItemText
                                    primary={
                                        <Typo color="textPrimary">
                                            {ticket.id}
                                        </Typo>
                                    }
                                />
                            </ListItemSecondaryAction>
                        </ListItem>
                    )}
                </List>

                <List className={classes.list}>
                    <ListItem>
                        <ListItemText
                            primary={
                                <Typo color="textSecondary">
                                    {t('order:ticketTypeName')}
                                </Typo>
                            }
                        />
                        <ListItemSecondaryAction>
                            <ListItemText
                                primary={
                                    <Typo color="textPrimary">
                                        {/* @todo: fix backend types */}
                                        {passenger.ticketType && (
                                            <React.Fragment>
                                                {passenger.ticketType}
                                                {', '}
                                            </React.Fragment>
                                        )}
                                        {pricePaid} {currencyPaid}
                                    </Typo>
                                }
                            />
                        </ListItemSecondaryAction>
                    </ListItem>

                    <Divider component="li" variant="middle" />

                    <ListItem>
                        <ListItemText
                            primary={
                                <Typo color="textSecondary">
                                    {t('order:total')}
                                </Typo>
                            }
                        />
                        <ListItemSecondaryAction>
                            <ListItemText
                                primary={
                                    <Typo color="textPrimary" weight="bold">
                                        {pricePaid} {currencyPaid}
                                    </Typo>
                                }
                            />
                        </ListItemSecondaryAction>
                    </ListItem>
                </List>

                {!paidInCash && (
                    <List className={classes.list}>
                        <ListItem>
                            <ListItemText
                                primary={
                                    <Typo color="textSecondary">
                                        {t('order:moneyRetention')}
                                    </Typo>
                                }
                            />
                            <ListItemSecondaryAction>
                                <ListItemText
                                    primary={
                                        <Typo color="textPrimary">
                                            {refundAmountPercentage}%
                                        </Typo>
                                    }
                                />
                            </ListItemSecondaryAction>
                        </ListItem>

                        <ListItem>
                            <ListItemText
                                primary={
                                    <Typo color="textSecondary">
                                        {t('order:returnAmount')}
                                    </Typo>
                                }
                            />
                            <ListItemSecondaryAction>
                                <ListItemText
                                    primary={
                                        <Typo color="textPrimary">
                                            {refundAmount} {currencyPaid}
                                        </Typo>
                                    }
                                />
                            </ListItemSecondaryAction>
                        </ListItem>

                        <ListItem>
                            <Typo color="textSecondary" variant="caption">
                                {t('order:returnAmountDesc')}
                            </Typo>
                        </ListItem>
                    </List>
                )}
            </>
        );
    };

    if (isDesktop) {
        return (
            <Dialog
                disableScrollLock
                open={open}
                onClose={onClose}
                fullWidth
                maxWidth="sm"
            >
                <AppBar
                    title={
                        paidInCash
                            ? t('order:cancelTicketTitle', {
                                  context: country,
                              })
                            : t('order:returnTicketTitle', {
                                  context: country,
                              })
                    }
                    disableBackIcon
                    endIcon={
                        <IconButton
                            color="primary"
                            edge="end"
                            onClick={onClose}
                        >
                            <CloseIcon />
                        </IconButton>
                    }
                />

                <div className={classes.desktopContainer}>
                    {renderList()}

                    <div className={classes.desktopButtonContainer}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleReturnTicket}
                            disabled={!canCancel}
                        >
                            {status === TICKET_CANCEL ? (
                                <Stub absolute transparent />
                            ) : null}
                            {paidInCash
                                ? t('order:cancelTicket', {
                                      context: country,
                                  })
                                : t('order:returnTicket', {
                                      context: country,
                                  })}
                        </Button>
                    </div>
                </div>
            </Dialog>
        );
    }

    return (
        <MobileDialog
            open={open}
            onClose={onClose}
            title={
                paidInCash
                    ? t('order:cancelTicketTitle', {
                          context: country,
                      })
                    : t('order:returnTicketTitle', {
                          context: country,
                      })
            }
            textCenter
            startIcon="close"
        >
            {renderList()}

            <ActionBar>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleReturnTicket}
                    disabled={!canCancel}
                >
                    {status === TICKET_CANCEL ? (
                        <Stub absolute transparent />
                    ) : null}
                    {paidInCash
                        ? t('order:cancelTicket', {
                              context: country,
                          })
                        : t('order:returnTicket', {
                              context: country,
                          })}
                </Button>
            </ActionBar>
        </MobileDialog>
    );
};
