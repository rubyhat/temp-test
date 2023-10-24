import React, { FC } from 'react';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import camelCase from 'lodash/camelCase';
import upperFirst from 'lodash/upperFirst';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { List } from 'components/ui/List/List';
import { OrderDtoPaymentMethodEnum, TicketDto } from 'swagger/client';
import { Typo } from '../Typo/Typo';
import { usePlatform } from 'hooks/usePlatform';
import { useTranslation } from 'i18n';
import { useSAAS } from 'hooks/useSAAS';
import { RootState } from 'store';
import { RideState } from 'store/ride/types';
import { useSelector } from 'react-redux';

const useStyles = makeStyles(
    (theme: Theme) => ({
        /* Styles applied to the subject `Typo` component. */
        subject: {
            marginTop: theme.spacing(1),
        },
    }),
    { name: 'TicketDetailsList' }
);

type Props = {
    ticket: TicketDto;
    discountPrice: number;
    currencyPaid: string;
    paymentMethod: OrderDtoPaymentMethodEnum;
    className?: string;
};

export const TicketDetailsList: FC<Props> = props => {
    const {
        ticket,
        discountPrice,
        currencyPaid,
        paymentMethod,
        className,
    } = props;
    const { passenger } = ticket;
    const { t } = useTranslation();
    const { isDesktop } = usePlatform();
    const classes = useStyles();
    const { isMioTaxi, isCompasBus } = useSAAS();

    const dividerVariant = isDesktop ? 'fullWidth' : 'middle';
    const { rideInfo: ride } = useSelector<RootState, RideState>(
        rootState => rootState.ride
    );
    const isSeatingSchemeEnable =
        ride && ride.seatingScheme && ride.seatingScheme.length > 0;

    return (
        <List className={className} disablePadding={isDesktop}>
            {!isDesktop ? (
                <>
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

                    <Divider component="li" variant={dividerVariant} />
                </>
            ) : null}

            {passenger.docType ? (
                <>
                    <ListItem disableGutters={isDesktop}>
                        <ListItemText
                            primary={
                                <Typo color="textSecondary">
                                    {t(
                                        `booking:docTypeName${upperFirst(
                                            camelCase(passenger.docType)
                                        )}`
                                    )}
                                </Typo>
                            }
                        />
                        <ListItemSecondaryAction>
                            <ListItemText
                                primary={
                                    <Typo color="textPrimary">
                                        {passenger.docNumber}
                                    </Typo>
                                }
                            />
                        </ListItemSecondaryAction>
                    </ListItem>

                    <Divider component="li" variant={dividerVariant} />
                </>
            ) : null}

            {!isMioTaxi && !isCompasBus && (
                <>
                    <ListItem disableGutters={isDesktop}>
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
                                    <Typo color="textPrimary">{ticket.id}</Typo>
                                }
                            />
                        </ListItemSecondaryAction>
                    </ListItem>
                    <Divider component="li" variant={dividerVariant} />
                </>
            )}

            <ListItem disableGutters={isDesktop}>
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
                                {discountPrice} {currencyPaid}
                            </Typo>
                        }
                    />
                </ListItemSecondaryAction>
            </ListItem>

            <Divider component="li" variant={dividerVariant} />

            {paymentMethod ? (
                <ListItem disableGutters={isDesktop}>
                    <ListItemText
                        primary={
                            <Typo color="textSecondary">
                                {t('booking:payment')}
                            </Typo>
                        }
                    />
                    <ListItemSecondaryAction>
                        <ListItemText
                            primary={
                                <Typo color="textPrimary">
                                    {t(
                                        `booking:paymentType${upperFirst(
                                            paymentMethod
                                        )}`
                                    )}
                                </Typo>
                            }
                        />
                    </ListItemSecondaryAction>
                </ListItem>
            ) : null}
            {isSeatingSchemeEnable && ticket.passenger.seat && (
                <>
                    <Divider component="li" variant={dividerVariant} />
                    <ListItem disableGutters={isDesktop}>
                        <ListItemText
                            primary={
                                <Typo color="textSecondary">
                                    {t('selectSeatTitle')}
                                </Typo>
                            }
                        />
                        <ListItemSecondaryAction>
                            <ListItemText
                                primary={
                                    <Typo color="textPrimary">
                                        №{ticket.passenger.seat}
                                    </Typo>
                                }
                            />
                        </ListItemSecondaryAction>
                    </ListItem>
                </>
            )}

            {passenger.subject ? (
                <>
                    <Divider component="li" variant={dividerVariant} />

                    <ListItem disableGutters={isDesktop}>
                        <ListItemText
                            primary={
                                <Typo color="textSecondary">
                                    {t('booking:orderSubject')}
                                </Typo>
                            }
                            secondary={
                                <Typo
                                    color="textPrimary"
                                    className={classes.subject}
                                >
                                    {passenger.subject}
                                </Typo>
                            }
                        />
                    </ListItem>
                </>
            ) : null}
        </List>
    );
};
