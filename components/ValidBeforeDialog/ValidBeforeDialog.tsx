import React, { FC, useState } from 'react';
import Countdown from 'react-countdown';
import Grid from '@material-ui/core/Grid';
import addSeconds from 'date-fns/addSeconds';
import zonedTimeToUtc from 'date-fns-tz/zonedTimeToUtc';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useRouter } from 'next/router';

import { Button } from '../ui/Button';
import { NotifyDialog } from '../NotifyDialog';
import { useTranslation } from 'i18n';
import { useCountry } from 'hooks/useCountry';
import { useSAAS } from 'hooks/useSAAS';

const useStyles = makeStyles(
    (theme: Theme) => ({
        /* Styles applied to the root element. */
        root: {},
    }),
    { name: 'ValidBeforeDialog' }
);

type Props = {
    departureTimezone: string;
    departureDate: string; // ISO
    validBefore: number; // seconds
};

export const ValidBeforeDialog: FC<Props> = props => {
    const { departureDate, departureTimezone, validBefore } = props;
    const classes = useStyles();
    const router = useRouter();
    const { t } = useTranslation();
    const { country } = useCountry();
    const [open, setOpen] = useState(false);
    const { isMioTaxi } = useSAAS();

    const goToSearch = () => router.push('/');
    const handleComplete = () => setOpen(true);

    const departureDateUTC = zonedTimeToUtc(departureDate, departureTimezone);
    const validTimestamp = addSeconds(departureDateUTC, validBefore).getTime();

    return (
        <div className={classes.root}>
            <Countdown
                date={validTimestamp}
                key={validTimestamp}
                onComplete={handleComplete}
                renderer={() => null}
            />

            <NotifyDialog
                open={open}
                title={t('booking:validBeforeExpired', {
                    context: country,
                })}
                subtitle={
                    isMioTaxi
                        ? t('booking:validBeforeDescTaxi')
                        : t('booking:validBeforeDesc')
                }
                actions={
                    <Grid container spacing={2} justify="center">
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
        </div>
    );
};
