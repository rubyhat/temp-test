import React, { FC } from 'react';
import Grid from '@material-ui/core/Grid';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';

import parseISO from 'date-fns/parseISO';
import { BookingAvailabilityDto, RideDto } from 'swagger/client';
import { Button } from '../ui/Button';
import { NotifyDialog } from '../NotifyDialog';
import { format } from 'utils/date';
import { useTranslation } from 'i18n';
import { useCountry } from 'hooks/useCountry';
import { formatPhone, tel } from 'utils/phone';
import { useCallCenterOrCarrierPhones } from 'hooks/useCallCenterOrCarrierPhones';

const useStyles = makeStyles(
    theme => ({
        /* Styles applied to the root element. */
        root: {},
        buttonPhone: {
            '& ~ &': {
                marginTop: theme.spacing(2),
            },
        },
    }),
    { name: 'DenyBookingDialog' }
);

type Props = {
    availability: BookingAvailabilityDto;
    ride?: RideDto;
    onClose?: () => void;
};

export const DenyBookingDialog: FC<Props> = props => {
    const { onClose, availability, ride } = props;
    const { available, reason } = availability;
    const { t } = useTranslation();
    const classes = useStyles();
    const router = useRouter();
    const { country } = useCountry();

    const carrierPhones: string[] = (ride && ride.carrier_phones) || [];
    const phones = useCallCenterOrCarrierPhones(carrierPhones);

    const goToSearch = () => router.replace('/');
    const goToOrders = () => router.push('/orders');

    if (!reason) return null;

    if (reason.code === 'new_user') {
        return (
            <NotifyDialog
                open={!available}
                onClose={onClose}
                title={t(`formErrors:denyBookingNewUserTitle`, {
                    context: country,
                })}
                subtitle={t(`formErrors:denyBookingNewUserDesc`, {
                    context: country,
                })}
                actions={
                    <Grid container spacing={2} justify="space-around">
                        {ride && ride.carrier_phones ? (
                            <Grid container item xs={12} justify="space-around">
                                <Grid item xs={12} md={6}>
                                    {phones.map(phone => {
                                        const formattedPhone = formatPhone(
                                            phone
                                        );

                                        return (
                                            <Button
                                                className={classes.buttonPhone}
                                                key={phone}
                                                color="primary"
                                                variant="contained"
                                                fullWidth
                                                href={`tel:${tel(
                                                    formattedPhone
                                                )}`}
                                                itemProp="telephone"
                                            >
                                                {formattedPhone}
                                            </Button>
                                        );
                                    })}
                                </Grid>
                            </Grid>
                        ) : null}

                        <Grid item xs={12} md={6}>
                            <Button
                                onClick={goToSearch}
                                variant="outlined"
                                color="primary"
                                fullWidth
                            >
                                {t('booking:backToSearch')}
                            </Button>
                        </Grid>
                    </Grid>
                }
            />
        );
    }

    if (reason.code === 'forbidden_near_routes') {
        let time = 'xx:xx';

        try {
            const dateObj = parseISO(reason.value);
            time = format(dateObj, 'HH:mm');
        } catch (err) {
            console.error(err);
            console.log('Invalid date', time);
        }

        return (
            <NotifyDialog
                open={!available}
                onClose={onClose}
                title={t(`formErrors:denyBookingForbiddenNearRoutesTitle`, {
                    context: country,
                })}
                subtitle={t(`formErrors:denyBookingForbiddenNearRoutesDesc`, {
                    context: country,
                    time,
                })}
                actions={
                    <Grid container spacing={2} justify="space-around">
                        <Grid item xs={12} md={6}>
                            <Button
                                onClick={goToOrders}
                                variant="contained"
                                color="secondary"
                                fullWidth
                            >
                                {t('myTrips')}
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Button
                                onClick={goToSearch}
                                variant="outlined"
                                color="primary"
                                fullWidth
                            >
                                {t('booking:backToSearch')}
                            </Button>
                        </Grid>
                    </Grid>
                }
            />
        );
    }

    if (reason.code === 'tickets_per_route_count') {
        const count = reason.value; // кол-во имеющихся заказов
        const limit = reason.limit; // максимальный лимит

        return (
            <NotifyDialog
                open={!available}
                onClose={onClose}
                title={t(`formErrors:denyBookingTicketsPerRouteCountTitle`)}
                subtitle={t(`formErrors:denyBookingTicketsPerRouteCountDesc`, {
                    context: country,
                    count,
                    limit,
                })}
                actions={
                    <Grid container spacing={2} justify="space-around">
                        <Grid item xs={12} md={6}>
                            <Button
                                onClick={goToOrders}
                                variant="contained"
                                color="secondary"
                                fullWidth
                            >
                                {t('myTrips')}
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Button
                                onClick={goToSearch}
                                variant="outlined"
                                color="primary"
                                fullWidth
                            >
                                {t('booking:backToSearch')}
                            </Button>
                        </Grid>
                    </Grid>
                }
            />
        );
    }

    if (reason.code === 'in_black_list') {
        return (
            <NotifyDialog
                open={!available}
                onClose={onClose}
                title={t(`formErrors:denyBookingInBlackListTitle`, {
                    context: country,
                })}
                subtitle={t(`formErrors:denyBookingInBlackListDesc`, {
                    context: country,
                })}
                actions={
                    <Grid container spacing={2} justify="space-around">
                        <Grid item xs={12} md={6}>
                            <Button
                                onClick={goToSearch}
                                variant="outlined"
                                color="primary"
                                fullWidth
                            >
                                {t('booking:backToSearch')}
                            </Button>
                        </Grid>
                    </Grid>
                }
            />
        );
    }

    return (
        <NotifyDialog
            open={!available}
            onClose={onClose}
            title={t(`formErrors:denyBookingUnknownReasonTitle`)}
            subtitle={t(`formErrors:denyBookingUnknownReasonDesc`, {
                context: country,
            })}
            actions={
                <Grid container spacing={2} justify="space-around">
                    <Grid item xs={12} md={6}>
                        <Button
                            onClick={goToSearch}
                            variant="outlined"
                            color="primary"
                            fullWidth
                        >
                            {t('booking:backToSearch')}
                        </Button>
                    </Grid>
                </Grid>
            }
        />
    );
};
