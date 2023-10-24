import React, { FC } from 'react';
import Box from '@material-ui/core/Box';
import clsx from 'clsx';
import parseISO from 'date-fns/parseISO';
import { makeStyles } from '@material-ui/core/styles';
import { SearchDto, SearchDtoBenefitsEnum } from 'swagger/client';
import { Typo } from 'components/Typo/Typo';
import { format } from 'utils/date';
import { useRideWithFilters } from 'hooks/useRideWithFilters';
import { useTranslation } from 'i18n';
import { CurrencySymbol } from 'utils/currency';
import { CountryCode } from 'utils/country';
import { formatPhone, tel } from 'utils/phone';

const useStyles = makeStyles(
    theme => ({
        /* Styles applied to the root element. */
        root: {},
        directionName: {
            // marginLeft: theme.spacing(1),
        },
        dateContainer: {
            marginTop: 4,
        },
        aboutContainer: {
            marginTop: theme.spacing(2),
        },
        rideType: {},
        busColor: {
            marginTop: 4,
        },
        busReg: {
            marginTop: 4,
        },
        driverName: {
            marginTop: 4,
        },
        formattedPhone: {
            marginTop: 4,
        },
        travelTime: {
            marginTop: 4,
        },
        serviceType: {
            marginTop: 4,
        },
        aboutDepartureTime: {
            marginTop: 4,
        },
    }),
    { name: 'DesktopTripRouteDetails' }
);

type DesktopTripRouteDetailsProps = {
    className?: string;
    ride: SearchDto;
};

export const DesktopTripRouteDetails: FC<
    DesktopTripRouteDetailsProps
> = props => {
    const { className, ride } = props;
    const classes = useStyles();
    const { t } = useTranslation();

    const { departureDate, displayDuration } = useRideWithFilters(ride);

    const isMeteor =
        ride.benefits && ride.benefits.includes(SearchDtoBenefitsEnum.Meteor);
    const isBigBus =
        ride.benefits && ride.benefits.includes(SearchDtoBenefitsEnum.BigBus);
    const busType =
        ride.rideType === 'shuttle'
            ? t('shuttle')
            : isBigBus
            ? t('bus')
            : isMeteor
            ? t('benefitMeteor')
            : t('minibus');

    const busColor = (ride.bus && ride.bus.color && ride.bus.color.name) || '';
    const busReg = (ride.bus && ride.bus.reg) || '';
    const driverName = (ride.driver && ride.driver.name) || '';
    const driverPhone = (ride.driver && ride.driver.phone) || '';
    const formattedPhone = driverPhone ? formatPhone(driverPhone) : '';
    const countryByCurrency: CountryCode =
        (ride.currency as CurrencySymbol) === 'BYN' ? 'BY' : 'RU';
    const serviceType =
        ride.rideType === 'shuttle'
            ? t(`serviceTypeShuttle${countryByCurrency}`)
            : ride.rideType === 'regular'
            ? t(`serviceTypeRegular${countryByCurrency}`)
            : ride.rideType === 'charter'
            ? t(`serviceTypeCharter${countryByCurrency}`)
            : t(`serviceTypeOther${countryByCurrency}`);

    const directionName = `${ride.to.desc} - ${ride.from.desc}`;
    const departureDateString = format(
        parseISO(departureDate),
        'd MMM, EEEEEE'
    );

    return (
        <div className={clsx(classes.root, className)}>
            <Box display="flex">
                {/*<Typo weight="medium">*/}
                {/*    {t('rideNumber', {*/}
                {/*        id: 666, // @todo flight number*/}
                {/*    })}*/}
                {/*</Typo>*/}
                <Typo weight="medium" className={classes.directionName}>
                    {directionName}
                </Typo>
            </Box>

            <div className={classes.dateContainer}>
                <Typo color="textSecondary">{departureDateString}</Typo>
            </div>

            <div className={classes.aboutContainer}>
                <Typo className={classes.rideType}>
                    {t('rideType')}: {busType}
                </Typo>
                {busColor ? (
                    <Typo className={classes.busColor}>
                        {t('busColor')}: {busColor}
                    </Typo>
                ) : null}
                {busReg ? (
                    <Typo className={classes.busReg}>
                        {t('busReg')}: {busReg}
                    </Typo>
                ) : null}
                {driverName ? (
                    <Typo className={classes.driverName}>
                        {t('driver')}: {driverName}
                    </Typo>
                ) : null}
                {formattedPhone ? (
                    <Typo className={classes.formattedPhone}>
                        {t('phoneDriver')}:&nbsp;
                        <a href={`tel:${tel(formattedPhone)}`}>
                            {formattedPhone}
                        </a>
                    </Typo>
                ) : null}
                <Typo className={classes.travelTime}>
                    {t('travelTime')}: {displayDuration}
                </Typo>
                <Typo className={classes.serviceType}>
                    {t('serviceType')}: {serviceType}
                </Typo>
                <Typo className={classes.aboutDepartureTime}>
                    {t('tripDetailsAboutDepartureTime')}
                </Typo>
            </div>
        </div>
    );
};
