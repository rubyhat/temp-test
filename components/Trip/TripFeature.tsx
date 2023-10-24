import React, { ReactNode } from 'react';
import {
    BusDto,
    BusDtoBrandingEnum,
    RideDto,
    SearchDto,
    SearchDtoBenefitsEnum,
    SearchDtoRideTypeEnum,
} from 'swagger/client';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { useSAAS } from 'hooks/useSAAS';
import { useTranslation } from 'i18n';
import { LogoSign } from 'components/LogoSign';
import { AtlasTheme } from 'typings/atlas-theme';
import { LogoSignMeteor } from 'components/LogoSignMeteor';

const useStyles = makeStyles(
    (theme: Theme & AtlasTheme) => ({
        /* Styles applied to the root element. */
        root: {
            padding: 2,
            backgroundColor: theme.palette.primary.main,
            borderRadius: theme.atlas.borderRadius.medium,
        },
        /* Styles applied to the header `div` element. */
        header: {
            fontSize: theme.atlas.typography.caption.fontSize,
            paddingLeft: theme.spacing(1),
            paddingRight: theme.spacing(1),
            height: 26,
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            color: '#FFF',
        },
        /* Styles applied to the trip `div` element. */
        trip: {},
        /* Styles applied to the componentTitle `div` element. */
        componentTitle: {
            fontWeight: 700,
            textTransform: 'uppercase',
        },
        /* Styles applied to the componentTitle `div` element. */
        componentSubtitle: {
            marginLeft: theme.spacing(1),
        },
        /* Styles applied to the `LogoSign` component if `feature.showLogo={true}`. */
        LogoSign: {
            marginRight: 4,
        },
    }),
    { name: 'TripFeature' }
);

export type TripFeatureProps = {
    bus?: BusDto;
    benefits?: SearchDtoBenefitsEnum[];
    rideType: SearchDtoRideTypeEnum;
    ride: SearchDto | RideDto;
    children: ReactNode;
};

export const TripFeature: React.FC<TripFeatureProps> = props => {
    const { meta } = useSAAS();
    const { benefits = [], rideType, bus, ride, children } = props;
    const classes = useStyles();
    const { t } = useTranslation();

    const featureCandidates = meta.features.filter(feature => {
        const shouldSkipBenefits = feature.benefits.length === 0;
        const shouldSkipBusBranding =
            !feature.busBranding || feature.busBranding.length === 0;
        const shouldSkipRideType = feature.rideTypes.length === 0;

        let benefitsMatch = false;
        let busBrandingMatch = false;
        let rideTypeMatch = false;

        if (benefits && benefits.length) {
            if (benefits.some(benefit => feature.benefits.includes(benefit))) {
                benefitsMatch = true;
            }
        }

        if (bus && bus.branding && feature.busBranding) {
            if (feature.busBranding.includes(bus.branding)) {
                busBrandingMatch = true;
            }
        }
        if (rideType && feature.rideTypes) {
            if (feature.rideTypes.includes(rideType)) {
                rideTypeMatch = true;
            }
        }

        return (
            (benefitsMatch || shouldSkipBenefits) &&
            (busBrandingMatch || shouldSkipBusBranding) &&
            (rideTypeMatch || shouldSkipRideType) &&
            (!feature.dynamicRidesOnly ||
                (feature.dynamicRidesOnly && ride.dynamicMode))
        );
    });

    // Если big-bus и full_branding, то нужно показывать плашку именно full_branding, а не big-bus
    const feature =
        featureCandidates.length > 1 &&
        ride.bus &&
        ride.bus.branding === BusDtoBrandingEnum.FullBranding
            ? featureCandidates[1]
            : featureCandidates[0];

    const hasFeatureTranslation =
        feature && t(`brand:${feature.title}`, { defaultValue: '' });

    const isMeteor =
        feature &&
        feature.benefits.some(el => el === SearchDtoBenefitsEnum.Meteor);

    const frame = ride.frame && ride.frame.use ? ride.frame : false;
    // @TODO: add optional logo showing in new feature

    return frame ? (
        <div
            className={classes.root}
            style={{
                background: `linear-gradient(72.01deg, ${frame.colorCode1} 0%, ${frame.colorCode2} 100%)`,
            }}
        >
            <div
                className={classes.header}
                style={{
                    color: '#fff',
                }}
            >
                <LogoSign className={classes.LogoSign} dark size="xs" />

                <span className={classes.componentTitle}>{frame.title}</span>

                <span className={classes.componentSubtitle}>
                    {frame.slogan}
                </span>
            </div>

            <div className={classes.trip}>{children}</div>
        </div>
    ) : feature && hasFeatureTranslation ? (
        <div
            className={classes.root}
            style={{
                background: feature.backgroundColor,
            }}
        >
            <div
                className={classes.header}
                style={{
                    color: feature.color,
                }}
            >
                {feature.showLogo ? (
                    <LogoSign className={classes.LogoSign} dark size="xs" />
                ) : null}

                <span className={classes.componentTitle}>
                    {t(`brand:${feature.title}`)}
                </span>

                <span className={classes.componentSubtitle}>
                    {t(`brand:${feature.subtitle}`, {
                        defaultValue: '',
                    })}
                </span>
            </div>

            <div className={classes.trip}>{children}</div>
        </div>
    ) : (
        <>{children}</>
    );
};
