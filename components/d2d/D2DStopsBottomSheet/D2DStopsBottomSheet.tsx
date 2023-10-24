import React, { FC } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import parseISO from 'date-fns/parseISO';
import truncate from 'lodash/truncate';
import { makeStyles, Theme } from '@material-ui/core/styles';

import {
    BookParamsDto,
    DestinationDto,
    RideDto,
    StopsDto,
} from 'swagger/client';
import {
    PersistentBottomSheet,
    PersistentBottomSheetProps,
} from 'components/ui/PersistentBottomSheet';
import {
    calcApproximateArrivalTime,
    calcApproximateDepartureTime,
} from 'utils/calcD2dTime';
import { Button } from 'components/ui/Button';
import { Chip } from 'components/ui/Chip/Chip';
import { CurrencySymbol, currencySymbol } from 'utils/currency';
import { Typo } from 'components/Typo/Typo';
import { approximateRidePrice } from 'utils/booking';
import { format } from 'utils/date';
import { formatPrice } from 'utils/price';
import { useTranslation } from 'i18n';
import { D2DInfoSlider } from 'components/d2d/D2DInfoSlider';
import { AtlasTheme } from 'typings/atlas-theme';
import { useSAAS } from 'hooks/useSAAS';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {},
        bottomSheetPaper: {
            // Negative margin (Grid component)
            // https://material-ui.com/ru/components/grid/#negative-margin
            overflow: 'hidden',
        },
        container: {
            backgroundColor: theme.palette.common.white,
        },
        header: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
        },
        headerQuestion: {
            lineHeight: 1,
        },
        headerBox: {
            marginTop: theme.spacing(1),
        },
        headerTitle: {},
        headerSubtitle: {},
        priceBlock: {},
        chips: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
            marginTop: theme.spacing(1),
        },
        chipDanger: {
            color: '#FF2D2D',
            backgroundColor: '#F5F6F7',
        },
        content: {
            padding: theme.spacing(2),
        },
        continueButton: {
            borderRadius: theme.atlas.borderRadius.high,
        },
    }),
    { name: 'D2DStopsBottomSheet' }
);

type D2DStopsBottomSheetProps = {
    PersistentBottomSheetProps: PersistentBottomSheetProps;
    ride: RideDto;
    bookParams: BookParamsDto;
    stop?: StopsDto | null;
    stopNotAlowed?: Boolean;
    destination?: DestinationDto;
    onNext: () => void;
    direction: 'departure' | 'arrival';
};

// Bottom sheet peek height
export const peekHeight = 100.2; // px

export const D2DStopsBottomSheet: FC<D2DStopsBottomSheetProps> = props => {
    const {
        PersistentBottomSheetProps,
        destination,
        stop,
        stopNotAlowed,
        ride,
        bookParams,
        onNext,
        direction,
    } = props;
    const classes = useStyles();
    const { t } = useTranslation();
    const { isMioTaxi } = useSAAS();

    const price = approximateRidePrice(bookParams, ride.paymentTypes);
    const departureTime =
        stop && stop.dynamic
            ? calcApproximateDepartureTime(ride, stop)
            : format(parseISO(ride.departure), 'HH:mm');
    const arrivalTime =
        stop && stop.dynamic
            ? calcApproximateArrivalTime(ride, stop)
            : format(parseISO(ride.arrival as string), 'HH:mm');

    if (!destination || !stop || !ride) return null;

    const directionChipNode =
        direction === 'departure' && departureTime && !stopNotAlowed ? (
            <Grid item>
                <Chip
                    className={classes.chipDanger}
                    size="small"
                    label={
                        isMioTaxi
                            ? `Заказ на ${departureTime}`
                            : t('booking:approximateDepartureTime', {
                                  time: departureTime,
                              })
                    }
                />
            </Grid>
        ) : direction === 'arrival' && arrivalTime && !stopNotAlowed ? (
            <Grid item style={isMioTaxi ? { display: 'none' } : {}}>
                <Chip
                    color="danger"
                    size="small"
                    label={t('booking:approximateArrivalTime', {
                        time: arrivalTime,
                    })}
                />
            </Grid>
        ) : (
            <Grid item>
                <Chip
                    className={classes.chipDanger}
                    size="small"
                    label={'Этот адрес временно не поддерживается'}
                />
            </Grid>
        );

    return (
        <PersistentBottomSheet
            classes={{
                paper: classes.bottomSheetPaper,
            }}
            {...PersistentBottomSheetProps}
            peekHeight={peekHeight}
        >
            <div className={classes.container}>
                <div className={classes.header}>
                    <Typo
                        className={classes.headerQuestion}
                        variant="caption"
                        weight="bold"
                        color="textSecondary"
                    >
                        {direction === 'departure'
                            ? t('booking:fromQuestion')
                            : t('booking:toQuestion')}
                    </Typo>

                    <Box
                        className={classes.headerBox}
                        display="flex"
                        justifyContent="space-between"
                    >
                        <div>
                            <Typo
                                className={classes.headerTitle}
                                variant="subtitle"
                                weight="bold"
                            >
                                {truncate(destination.desc, {
                                    length: 20,
                                })}
                            </Typo>
                            <Typo
                                className={classes.headerSubtitle}
                                variant="body1"
                                weight="medium"
                                color="textSecondary"
                            >
                                {truncate(stop.desc, {
                                    length: 25,
                                })}
                            </Typo>
                        </div>

                        <div className={classes.priceBlock}>
                            <Typo variant="body2" color="primary" weight="bold">
                                {formatPrice(
                                    price,
                                    currencySymbol[
                                        ride.currency as CurrencySymbol
                                    ]
                                )}
                            </Typo>
                        </div>
                    </Box>
                </div>

                <Grid container className={classes.chips} spacing={1}>
                    {directionChipNode}
                    <D2DInfoSlider />
                </Grid>

                <div className={classes.content}>
                    <Button
                        onClick={onNext}
                        className={classes.continueButton}
                        color="primary"
                        variant="contained"
                        size="large"
                        fullWidth
                        disabled={!stop} // @todo stop
                    >
                        {t('booking:continue')}
                    </Button>
                </div>
            </div>
        </PersistentBottomSheet>
    );
};
