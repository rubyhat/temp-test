import React, { FC } from 'react';
import Divider from '@material-ui/core/Divider';
import Tooltip from '@material-ui/core/Tooltip';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { BookingButton } from './BookingButton';
import { Button } from 'components/ui/Button/Button';
import { OnlinePaymentBadge } from 'components/DesktopTrip/OnlinePaymentBadge';
import { SearchDto } from 'swagger/client';
import { SurgeBadge } from 'components/DesktopTrip/SurgeBadge';
import { TripFeature } from './TripFeature';
import { TripStop } from './TripStop';
import { Typo } from 'components/Typo/Typo';
import { benefitsHiddenAreaHeight, TripBenefits } from './TripBenefits';
import { getMilesReward } from 'utils/miles';
import { useBadges } from 'hooks/useBadges';
import { useRideWithFilters } from 'hooks/useRideWithFilters';
import { useSAAS } from 'hooks/useSAAS';
import { useTranslation } from 'i18n';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {},
        card: {
            display: 'flex',
            flexDirection: 'column',
            background: '#fff',
            borderRadius: theme.atlas.borderRadius.medium,
            overflow: 'hidden',
            boxShadow: theme.atlas.shadows.bottom,
            position: 'relative',
        },
        route: {
            padding: theme.spacing(2, 2, 0, 2),
        },
        routeContainer: {
            display: 'flex',
            justifyContent: 'space-between',
        },
        departureTripStop: {
            maxWidth: '50%', // съезжает верстка когда у остановки длинное название
        },
        arrivalTripStop: {
            maxWidth: '50%', // съезжает верстка когда у остановки длинное название
        },
        body: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: theme.spacing(1),
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
        },
        badgeContainer: {},
        SurgeBadge: {},
        OnlinePaymentBadge: {},
        freeCountSeats: {
            textAlign: 'right',
        },
        /* Styles applied to the `Divider` component. */
        divider: {
            marginTop: theme.spacing(1),
            backgroundColor: theme.atlas.palette.divider.separator,
        },
        /**
         * Pseudo-class applied to the `Divider` component if ride is `surged`.
         *
         * Нужен доп. паддинг когда `<SurgeIcon />` отображается
         * над кнопкой "Забронировать".
         *
         * @see https://t.carbus.io/youtrack/issue/ATLASDEV-1384
         */
        dividerSurged: {
            marginTop: theme.spacing(2),
        },
        footer: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
        },
        details: {
            fontSize: 16,
            lineHeight: '22px',
            color: theme.atlas.palette.text.link,
            textAlign: 'center',
            minWidth: 104,
            flexGrow: 1,
            cursor: 'pointer',
        },
        detailsButton: {
            fontWeight: theme.typography.fontWeightMedium,
            color: theme.atlas.palette.text.trinity,
        },
        bookingButton: {
            flexGrow: 1,
        },
        /* Styles applied to the `TripBenefits` component. */
        tripBenefits: {
            paddingTop: benefitsHiddenAreaHeight,
            marginTop: -benefitsHiddenAreaHeight,
        },
    }),
    { name: 'Trip' }
);

type TripProps = {
    ride: SearchDto;
    className?: string;
    onClickDetails?: (rideId: string) => void;
    onClickBooking?: (rideId: string) => void;
    onClick?: (rideId: string) => void;
};

export const Trip: FC<TripProps> = props => {
    const {
        className,
        onClickDetails = () => {},
        onClickBooking = () => {},
        ride,
        onClick,
    } = props;
    const { freeSeats, benefits, bus, rideType } = ride;
    const classes = useStyles();
    const { t } = useTranslation();
    const { isAtlas, isMioTaxi } = useSAAS();
    const {
        departureDate,
        showDepartureDate,
        arrivalDate,
        showArrivalDate,
        pickupStopName,
        dischargeStopName,
        passengers,
    } = useRideWithFilters(ride);

    const {
        displaySurgedBadge,
        displayBadgeType,
        onlinePaymentBadgeEnabled,
    } = useBadges(ride);

    const handleDetailsClick = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.stopPropagation();
        onClickDetails(ride.id);
    };
    const handleBookingClick = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.stopPropagation();
        onClickBooking(ride.id);
    };
    const handleClick = () => {
        if (onClick) {
            onClick(ride.id);
        }
    };

    const milesReward = getMilesReward(ride);
    const priceButtonSubtitle =
        isAtlas && milesReward > 0
            ? t('milesRewardButtonText', {
                  miles:
                      milesReward +
                      ' ' +
                      t('miles', {
                          count: milesReward,
                          context: milesReward % 10 === 1 ? 'except' : 'common',
                      }),
              })
            : null;

    const tripNode = (
        <>
            <div className={classes.card}>
                <div className={classes.route}>
                    <div className={classes.routeContainer}>
                        <TripStop
                            className={classes.departureTripStop}
                            datetime={departureDate}
                            city={ride.from.desc}
                            stop={pickupStopName}
                            align="left"
                            showDate={showDepartureDate}
                        />

                        <TripStop
                            className={classes.arrivalTripStop}
                            datetime={arrivalDate}
                            city={ride.to.desc}
                            stop={dischargeStopName}
                            align="right"
                            showDate={showArrivalDate}
                            showArrivalTime={!isMioTaxi}
                        />
                    </div>
                </div>
                <div className={classes.body}>
                    <div className={classes.badgeContainer}>
                        {displaySurgedBadge ? ( // У сурджа приоритет перед бейджом "Можно картой"
                            <Tooltip
                                title={<Typo>{t(`search:surgeCardText`)}</Typo>}
                            >
                                <SurgeBadge className={classes.SurgeBadge} />
                            </Tooltip>
                        ) : onlinePaymentBadgeEnabled && ride.freeSeats > 0 ? (
                            <Tooltip
                                title={
                                    <Typo>
                                        {t(
                                            `search:onlinePaymentBadgeTooltipText`
                                        )}
                                    </Typo>
                                }
                            >
                                <OnlinePaymentBadge
                                    className={classes.OnlinePaymentBadge}
                                    type={displayBadgeType}
                                />
                            </Tooltip>
                        ) : null}
                    </div>

                    <Typo variant="body6" className={classes.freeCountSeats}>
                        {t('search:freeCountSeats', {
                            count: freeSeats >= 5 ? 5 : freeSeats,
                            plus: freeSeats > 5 ? '+' : '',
                        })}
                    </Typo>
                </div>

                <Divider
                    className={clsx(classes.divider, {
                        [classes.dividerSurged]: displaySurgedBadge,
                    })}
                />

                <div className={classes.footer}>
                    {freeSeats > 0 && (
                        <div className={classes.details}>
                            <Button
                                className={classes.detailsButton}
                                color="primary"
                                variant="text"
                                onClick={handleDetailsClick}
                                fullWidth
                            >
                                {t('search:details')}
                            </Button>
                        </div>
                    )}
                    {freeSeats > 0 && (
                        <div className={classes.bookingButton}>
                            <BookingButton
                                ride={ride}
                                onClick={handleBookingClick}
                                passengers={passengers}
                                subtitle={priceButtonSubtitle}
                                fullWidth
                            />
                        </div>
                    )}
                </div>
            </div>

            {freeSeats > 0 ? (
                <TripBenefits
                    ride={ride}
                    className={classes.tripBenefits}
                    benefits={benefits || []}
                />
            ) : null}
        </>
    );

    // У рейсов без свободных мест другой стиль карточки,
    // поэтому лучше их не фичить.
    if (freeSeats > 0) {
        return (
            <div
                className={clsx(classes.root, className)}
                onClick={handleClick}
            >
                <TripFeature
                    bus={bus}
                    benefits={benefits}
                    rideType={rideType}
                    ride={ride}
                >
                    {tripNode}
                </TripFeature>
            </div>
        );
    }

    // freeSeats === 0
    return (
        <div className={clsx(classes.root, className)} onClick={handleClick}>
            {tripNode}
        </div>
    );
};
