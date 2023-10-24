import React, { FC } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

import {
    TwoLineList,
    TwoLineListItem,
    TwoLineListItemText,
} from 'components/ui/TwoLineList';
import { SearchDto, SearchDtoBenefitsEnum } from 'swagger/client';
import { formatBusColor, formatBusName } from 'utils/ride';
import { getExecutorName } from 'utils/getExecutorName';
import { useTranslation } from 'i18n';
import { RootState } from 'store';
import { CountryState } from 'store/country/types';
import { CurrencySymbol } from 'utils/currency';
import { CountryCode } from 'utils/country';

const useStyles = makeStyles(
    {
        /* Styles applied to the root element. */
        root: {
            backgroundColor: '#FFF',
        },
    },
    { name: 'RideVehicleDetailsCard' }
);

type RideVehicleDetailsCardProps = {
    className?: string;
    ride: SearchDto;
};

export const RideVehicleDetailsCard: FC<
    RideVehicleDetailsCardProps
> = props => {
    const { className, ride } = props;
    const classes = useStyles();
    const { t } = useTranslation();
    const { country } = useSelector<RootState, CountryState>(
        rootState => rootState.country
    );

    const { bus } = ride;
    const busName = bus ? formatBusName(bus) : '';
    // todo: use bus type from api
    const isMeteor =
        ride.benefits && ride.benefits.includes(SearchDtoBenefitsEnum.Meteor);
    const isBigBus =
        ride.benefits && ride.benefits.includes(SearchDtoBenefitsEnum.BigBus);
    const busColor = bus && bus.color ? formatBusColor(bus.color) : '';
    const busType =
        ride.rideType === 'shuttle'
            ? t('shuttle')
            : isBigBus
            ? t('bus')
            : isMeteor
            ? t('benefitMeteor')
            : t('minibus');
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
    const executorName = getExecutorName(ride);
    const currency = ride.currency as CurrencySymbol;

    return (
        <TwoLineList className={clsx(classes.root, className)}>
            {busName ? (
                <TwoLineListItem>
                    <TwoLineListItemText
                        primary={t('busName')}
                        secondary={busName}
                    />
                </TwoLineListItem>
            ) : null}

            {busType ? (
                <TwoLineListItem>
                    <TwoLineListItemText
                        primary={t('busType')}
                        secondary={busType}
                    />
                </TwoLineListItem>
            ) : null}

            {serviceType ? (
                <TwoLineListItem>
                    <TwoLineListItemText
                        primary={t('serviceType')}
                        secondary={serviceType}
                    />
                </TwoLineListItem>
            ) : null}

            {busColor ? (
                <TwoLineListItem>
                    <TwoLineListItemText
                        primary={t('busColor')}
                        secondary={busColor}
                    />
                </TwoLineListItem>
            ) : null}

            {executorName ? (
                <TwoLineListItem>
                    <TwoLineListItemText
                        primary={t('executor')}
                        secondary={executorName}
                    />
                </TwoLineListItem>
            ) : null}
        </TwoLineList>
    );
};
