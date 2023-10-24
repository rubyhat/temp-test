import {
    BusDtoBrandingEnum,
    SearchDtoBenefitsEnum,
    SearchDtoRideTypeEnum,
} from 'swagger/client';

export type TripFeature = {
    benefits: SearchDtoBenefitsEnum[];
    busBranding?: BusDtoBrandingEnum[];
    rideTypes: SearchDtoRideTypeEnum[];
    title: string;
    subtitle: string;
    backgroundColor: string;
    color: string;
    /** Показать лого Атласа перед заголовком **/
    showLogo?: boolean;
    /** Отображать фичу только для динамических рейсов (D2D) **/
    dynamicRidesOnly?: boolean;
};
