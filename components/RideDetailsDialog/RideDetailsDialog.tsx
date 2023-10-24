import React, { FC, useState } from 'react';
import parseISO from 'date-fns/parseISO';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { ActionBar } from '../ActionBar';
import { CurrencySymbol } from 'utils/currency';
import { DesktopRouteCard } from 'components/DesktopRouteCard';
import { LegalInfoList } from 'components/LegalInfoList';
import { MilesRewardTextWithBadge } from 'components/MilesRewardTextWithBadge';
import { MobileDialog } from '../ui/MobileDialog';
import { PriceButton } from '../PriceButton';
import { RideBenefitsCard } from 'components/RideBenefitsCard';
import { RideCarrierDetails } from 'components/RideCarrierDetails';
import { RideConditionsCard } from 'components/RideConditionsCard';
import { RideVehicleDetailsCard } from 'components/RideVehicleDetailsCard';
import { SearchDto } from 'swagger/client';
import { SwitchingTab, SwitchingTabs } from 'components/ui/SwitchingTabs';
import { Typo } from 'components/Typo/Typo';
import { format } from 'utils/date';
import { rideMinPrice } from 'utils/ride';
import { getMilesReward } from 'utils/miles';
import { useSAAS } from 'hooks/useSAAS';
import { useTranslation } from 'i18n';
import { RouteNameWithArrow } from 'components/RouteNameWithArrow';

const useStyles = makeStyles(
    (theme: Theme) => ({
        /* Styles applied to the `SwitchingTabs` container `div` element. */
        tabsContainer: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
        },
        /* Styles applied to the `SwitchingTabs` component. */
        tabs: {
            marginTop: theme.spacing(2),
        },
        /* Styles applied to the tab body `div` element. */
        tabBody: {
            marginTop: theme.spacing(4),
        },
        /* Styles applied to the tab with value `route`. */
        routeTab: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
        },
        routeCard: {
            marginTop: theme.spacing(1),
        },

        divider: {
            marginTop: theme.spacing(2),
        },
        rideBenefitsTitle: {
            marginTop: theme.spacing(4),
        },
        RideBenefitsCard: {
            marginTop: theme.spacing(1),
        },

        milesRewardTitle: {
            marginTop: theme.spacing(4),
        },
        MilesRewardTextWithBadge: {
            marginTop: theme.spacing(2),
        },
        milesRewardInfo: {
            marginTop: theme.spacing(1),
        },

        vehicleTab: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
        },
        VehicleDetailsCard: {
            marginTop: theme.spacing(1),
        },

        carrierTab: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
        },
        carrierDetailsTitle: {},
        /* Styles applied to the `RideCarrierDetails` component. */
        RideCarrierDetails: {
            marginTop: theme.spacing(1),
        },
        otherConditionsTitle: {
            marginTop: theme.spacing(4),
        },
        /* Styles applied to the `RideConditionsCard` component. */
        RideConditionsCard: {
            backgroundColor: '#FFF',
            marginTop: theme.spacing(2),
        },

        /* Styles applied to the container `div` element. */
        container: {
            paddingBottom: 88 + theme.spacing(2), // 88 == ActionBar height
        },
    }),
    { name: 'RideDetailsDialog' }
);

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit: (rideId: SearchDto['id']) => void;
    ride: SearchDto;
    passengers?: number;
};

type TabType = 'route' | 'vehicle' | 'carrier';

export const RideDetailsDialog: FC<Props> = props => {
    const { open, onClose, onSubmit, ride, passengers = 1 } = props;
    const classes = useStyles();
    const { t } = useTranslation();
    const { isAtlas } = useSAAS();

    const title = (
        <RouteNameWithArrow departure={ride.from.desc} arrival={ride.to.desc} />
    );
    const departureDate = format(parseISO(ride.departure), 'd MMM, EEEEEE');
    const price = rideMinPrice(ride.price, ride.onlinePrice, ride.paymentTypes);
    const currency = ride.currency as CurrencySymbol; // @todo GDS type;

    const carrierDetailsItemsPartner = [
        {
            name: t('legalInformation'),
            value: ride.legal ? (
                <LegalInfoList
                    legal={ride.legal}
                    currency={ride.currency as CurrencySymbol}
                />
            ) : null,
            collapsed: true,
        },
    ];
    const carrierDetailsItemsRide = [
        {
            name: t('refundConditions'),
            value: ride.refundConditions,
            collapsed: true,
            html: true,
        },
        {
            name: t('shuttleRules'),
            value: ride.rideType === 'shuttle' && t('shuttleRulesDesc'),
            collapsed: true,
            html: true,
        },
        {
            name: t('luggageRules'),
            value:
                ride.luggage &&
                ride.luggage.available &&
                ride.luggage.description,
            collapsed: true,
            html: true,
        },
        {
            name: t('petsRules'),
            value:
                ride.animals &&
                ride.animals.available &&
                ride.animals.description,
            collapsed: true,
            html: true,
        },
    ];

    const handleClick = () => onSubmit(ride.id);

    const [tab, setTab] = useState<TabType>('route');
    const handleTabsChange = (
        e: React.MouseEvent<HTMLElement, MouseEvent>,
        newValue: any
    ) => {
        // tab should always have a value
        if (newValue) {
            setTab(newValue);
        }
    };

    const milesReward = getMilesReward(ride);

    return (
        <MobileDialog
            open={open}
            onClose={onClose}
            title={title}
            subtitle={departureDate}
            titleOverflowHidden
        >
            <div className={classes.container}>
                <div className={classes.tabsContainer}>
                    <SwitchingTabs
                        className={classes.tabs}
                        value={tab}
                        exclusive
                        onChange={handleTabsChange}
                    >
                        <SwitchingTab value="route">
                            {t('tripDetailsTabRoute')}
                        </SwitchingTab>

                        <SwitchingTab value="vehicle">
                            {t('tripDetailsTabTransport')}
                        </SwitchingTab>

                        <SwitchingTab value="carrier">
                            {t('tripDetailsTabCarrier')}
                        </SwitchingTab>
                    </SwitchingTabs>
                </div>

                <div className={classes.tabBody}>
                    {tab === 'route' ? (
                        <div className={classes.routeTab}>
                            <Typo variant="subtitle" weight="bold">
                                {t('tripDetailsRouteTabTitle')}
                            </Typo>

                            <DesktopRouteCard
                                className={classes.routeCard}
                                ride={ride}
                            />

                            <Typo
                                className={classes.rideBenefitsTitle}
                                variant="subtitle"
                                weight="bold"
                            >
                                {t('search:benefits')}
                            </Typo>

                            {(ride.benefits || []).length > 0 ? (
                                <RideBenefitsCard
                                    ride={ride}
                                    className={classes.RideBenefitsCard}
                                />
                            ) : null}

                            {isAtlas && milesReward > 0 ? (
                                <>
                                    <Typo
                                        className={classes.milesRewardTitle}
                                        variant="subtitle"
                                        weight="bold"
                                    >
                                        {t('milesRewardTitle')}
                                    </Typo>

                                    <MilesRewardTextWithBadge
                                        className={
                                            classes.MilesRewardTextWithBadge
                                        }
                                        miles={milesReward}
                                    />

                                    <Typo
                                        className={classes.milesRewardInfo}
                                        variant="caption"
                                        color="textSecondary"
                                    >
                                        {t('milesRewardInfo')}
                                    </Typo>
                                </>
                            ) : null}

                            <RideConditionsCard
                                className={classes.RideConditionsCard}
                                items={carrierDetailsItemsRide}
                            />
                        </div>
                    ) : tab === 'vehicle' ? (
                        <div className={classes.vehicleTab}>
                            <Typo variant="subtitle" weight="bold">
                                {t('bus')}
                            </Typo>

                            <RideVehicleDetailsCard
                                className={classes.VehicleDetailsCard}
                                ride={ride}
                            />
                        </div>
                    ) : tab === 'carrier' ? (
                        <div className={classes.carrierTab}>
                            <Typo
                                className={classes.carrierDetailsTitle}
                                variant="subtitle"
                                weight="bold"
                            >
                                {t('carrierDetails')}
                            </Typo>

                            <RideCarrierDetails
                                className={classes.RideCarrierDetails}
                                ride={ride}
                            />
                            <Typo
                                className={classes.otherConditionsTitle}
                                variant="subtitle"
                                weight="bold"
                            >
                                {t('otherConditions')}
                            </Typo>
                            <RideConditionsCard
                                className={classes.RideConditionsCard}
                                items={carrierDetailsItemsPartner}
                            />
                        </div>
                    ) : null}
                </div>
            </div>

            <ActionBar>
                <PriceButton
                    onClick={handleClick}
                    price={price}
                    currency={currency}
                    freeSeats={ride.freeSeats}
                    passengers={passengers}
                    variant={ride.freeSeats === 0 ? 'no-seats' : 'active'}
                    fullWidth
                    flightPopular={ride.flightPopular}
                />
            </ActionBar>
        </MobileDialog>
    );
};
