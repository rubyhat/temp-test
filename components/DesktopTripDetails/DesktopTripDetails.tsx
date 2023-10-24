import React, { ChangeEvent, FC, useState } from 'react';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { AntTab, AntTabs, TabPanel } from 'components/ui/AntTabs';
import { DesktopBenefitsIcons } from './DesktopBenefitsIcons';
import { DesktopConditions } from './DesktopConditions';
import { DesktopRouteCard } from 'components/DesktopRouteCard/DesktopRouteCard';
import { DesktopShuttleRules } from './DesktopShuttleRules';
import { DesktopTripCarrierDetails } from './DesktopTripCarrierDetails';
import { DesktopTripDetailsHeader } from './DesktopTripDetailsHeader';
import { DesktopTripRouteDetails } from './DesktopTripRouteDetails';
import { MilesRewardTextWithBadge } from 'components/MilesRewardTextWithBadge';
import { SearchDto } from 'swagger/client';
import { ShowDetailsButton } from './ShowDetailsButton';
import { Typo } from 'components/Typo/Typo';
import { betweenSmAndMdQueryDown } from 'hooks/useBetweenSmAndMdMediaQuery';
import { formatBusName } from 'utils/ride';
import { getMilesReward } from 'utils/miles';
import { useRideWithFilters } from 'hooks/useRideWithFilters';
import { useSAAS } from 'hooks/useSAAS';
import { useTranslation } from 'i18n';
import { AtlasTheme } from 'typings/atlas-theme';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            backgroundColor: theme.palette.common.white,
        },
        column2: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        DesktopBenefitsIcons: {
            display: 'flex',
            marginLeft: theme.spacing(2),

            [`@media ${betweenSmAndMdQueryDown}`]: {
                display: 'none',
            },
        },
        routeContainer: {},
        DesktopRouteCard: {
            marginTop: theme.spacing(2),
        },
        tabs: {},
        divider: {
            marginTop: theme.spacing(2),
        },
        sectionHeading: {
            fontSize: theme.atlas.typography.body1.fontSize,
        },
        DesktopTripRouteDetails: {
            marginTop: theme.spacing(2),
        },
        MilesRewardTextWithBadge: {
            marginTop: theme.spacing(2),
        },
        milesRewardInfo: {
            marginTop: theme.spacing(1),
        },

        carrierContainer: {},
        DesktopTripCarrierDetails: {
            marginTop: theme.spacing(2),
        },
        otherConditionsContainer: {
            marginTop: theme.spacing(2),
            // display: 'inline-flex',
            flexDirection: 'column',

            '& > div ~ div': {
                marginTop: theme.spacing(1),
            },
        },
        desktopShuttleRules: {},
        desktopConditions: {},
    }),
    { name: 'DesktopTripDetails' }
);

type DesktopTripDetailsProps = {
    ride: SearchDto;
};

export const DesktopTripDetails: FC<DesktopTripDetailsProps> = props => {
    const { ride } = props;
    const classes = useStyles();
    const { t } = useTranslation();
    const { isAtlas } = useSAAS();

    const busName = ride.bus ? formatBusName(ride.bus) : '';
    const { displayDuration } = useRideWithFilters(ride);

    const [tab, setTab] = useState(0);

    const handleTabChange = (event: ChangeEvent<{}>, newValue: number) => {
        setTab(newValue);
    };

    const [detailsOpened, toggleDetails] = useState(false);
    const handleClickDetails = () => {
        toggleDetails(!detailsOpened);
    };

    const milesReward = getMilesReward(ride);

    const { benefits } = ride;

    return (
        <div className={classes.root}>
            <DesktopTripDetailsHeader
                column1={
                    <ShowDetailsButton
                        onClick={handleClickDetails}
                        arrowDirection={detailsOpened ? 'up' : 'down'}
                    />
                }
                column2={
                    <div className={classes.column2}>
                        {/* @todo Тут должен быть аватар и ФИО водителя */}
                        {busName ? (
                            <Typo color="textSecondary">{busName}</Typo>
                        ) : null}

                        {benefits ? (
                            <DesktopBenefitsIcons
                                className={classes.DesktopBenefitsIcons}
                                benefits={benefits}
                                maxItems={5}
                                SvgIconProps={{
                                    fontSize: 'small',
                                }}
                            />
                        ) : null}
                    </div>
                }
                column3={
                    <div>
                        <Typo color="textSecondary">
                            {t('travelTimeBrief', {
                                time: displayDuration,
                            })}
                        </Typo>
                    </div>
                }
            />

            {detailsOpened ? (
                <>
                    <AntTabs
                        className={classes.tabs}
                        value={tab}
                        onChange={handleTabChange}
                    >
                        <AntTab label={t('tripDetailsTabRoute')} />
                        <AntTab label={t('tripDetailsTabCarrier')} />
                    </AntTabs>

                    <TabPanel value={tab} index={0}>
                        <Grid
                            container
                            className={classes.routeContainer}
                            spacing={4}
                        >
                            <Grid item md={6}>
                                <Typo
                                    className={classes.sectionHeading}
                                    weight="bold"
                                >
                                    {t('tripDetailsRouteTabTitle')}
                                </Typo>

                                <DesktopRouteCard
                                    className={classes.DesktopRouteCard}
                                    ride={ride}
                                />
                            </Grid>

                            {isAtlas && milesReward > 0 ? (
                                <Grid item md={6}>
                                    <Typo
                                        className={classes.sectionHeading}
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
                                </Grid>
                            ) : null}
                        </Grid>

                        <Grid
                            container
                            className={classes.routeContainer}
                            spacing={4}
                        >
                            <Grid item md={6}>
                                <Divider className={classes.divider} />
                                <DesktopTripRouteDetails
                                    className={classes.DesktopTripRouteDetails}
                                    ride={ride}
                                />
                            </Grid>

                            <Grid item md={6}>
                                <Divider className={classes.divider} />
                                <div
                                    className={classes.otherConditionsContainer}
                                >
                                    {ride.rideType === 'shuttle' ? (
                                        <DesktopShuttleRules
                                            className={
                                                classes.desktopShuttleRules
                                            }
                                        />
                                    ) : null}

                                    {ride.refundConditions ? (
                                        <DesktopConditions
                                            className={
                                                classes.desktopConditions
                                            }
                                            title={t('refundConditions')}
                                            text={ride.refundConditions}
                                        />
                                    ) : null}
                                    {ride.luggage &&
                                    ride.luggage.available &&
                                    ride.luggage.description ? (
                                        <DesktopConditions
                                            title={t('luggageRules')}
                                            text={ride.luggage.description}
                                        />
                                    ) : null}

                                    {ride.animals &&
                                    ride.animals.available &&
                                    ride.animals.description ? (
                                        <DesktopConditions
                                            title={t('petsRules')}
                                            text={ride.animals.description}
                                        />
                                    ) : null}
                                </div>
                            </Grid>
                        </Grid>
                    </TabPanel>
                    <TabPanel value={tab} index={1}>
                        <Grid
                            container
                            className={classes.carrierContainer}
                            spacing={2}
                        >
                            <Grid item md={6}>
                                <Typo
                                    className={classes.sectionHeading}
                                    weight="bold"
                                >
                                    {t('carrierDetails')}
                                </Typo>

                                <DesktopTripCarrierDetails
                                    className={
                                        classes.DesktopTripCarrierDetails
                                    }
                                    ride={ride}
                                />
                            </Grid>
                        </Grid>
                    </TabPanel>
                </>
            ) : null}
        </div>
    );
};
