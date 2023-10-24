import {
    SaaSConfigMetaDto,
    SearchDtoBenefitsEnum,
    SearchDtoRideTypeEnum,
} from 'swagger/client';
import { CountryCode } from 'utils/country';
import { TripFeature } from 'components/Admin/types';
import { SURGE_DEFAULT_COLOR } from 'components/Surge/constants';

export const atlasMetaConfig: Omit<
    SaaSConfigMetaDto,
    'carriers' | 'policies'
> & {
    ogImageURL: string;
    contactFormURL: string;
    contactFormIframeURL: string;
    termsIframeURL: Record<CountryCode, string>;
    driversURL: string;
    driversIframeURL: string;
    contactPhone: Record<CountryCode, string>;
    countries: CountryCode[];
    features: TripFeature[];
    /** Процент сурджовых рейсов от общего количества при котором будет показана плашка **/
    surgePercentage?: number;
    policies: Object[];
} = {
    security: [],
    domains: [],
    logoURL: '',
    logoDarkURL: '',
    ogImageURL: '',
    partnerID: 'atlas',
    billingID: 0,
    backgroundURL: '',
    yandexMetrikaId: Number(process.env.YANDEX_METRIKA_ID),
    countries: [],

    driversURL: 'https://forms.yandex.ru/u/5e4aa2b46a3a830112c15228/',
    driversIframeURL:
        'https://forms.yandex.ru/u/5e4aa2b46a3a830112c15228/?iframe=1',
    contactFormURL:
        'https://forms.yandex.ru/u/5c6fe47b6b6a501b2a7ec473/?from_connect=1&version=2.1.44',
    contactFormIframeURL:
        'https://forms.yandex.ru/u/5c6fe47b6b6a501b2a7ec473/?iframe=1&version=2.1.44',
    termsIframeURL: {
        RU:
            'https://docs.google.com/document/d/e/2PACX-1vQPV9Wqu4CliNkj02Bid4CbGs892smgPeGJJ75riDWUe4BSJhppXpFkHYA2ENY8J3rI7350A83Xx_8-/pub?embedded=true',
        BY:
            'https://docs.google.com/document/d/e/2PACX-1vS3yjeCQwFBGHkdgOt7n1UnjI4sIgwv22D98NhC105upo5z2mqD1tj5aYJ0meHEyvIB_pXy7FvWIpu9/pub?embedded=true',
        PL:
            'https://docs.google.com/document/d/e/2PACX-1vSQXvd13cM0K7T3PhHmHv3YFLDEOxk1v8fL7ICJ59HNZ7zQn9YCg9vzIppR93UePS19byz_7cX1sfAQ/pub?embedded=true',
        LT:
            'https://docs.google.com/document/d/e/2PACX-1vSQXvd13cM0K7T3PhHmHv3YFLDEOxk1v8fL7ICJ59HNZ7zQn9YCg9vzIppR93UePS19byz_7cX1sfAQ/pub?embedded=true',
        UA:
            'https://docs.google.com/document/d/e/2PACX-1vSGYmRqwLLQ6GD275Que0iZc1ULZ3YDu5rtusAaDCzrD3nnmAP7LDIyj5kzZllXCNq7LzEbbgXx9vEw/pub?embedded=true',
        LV:
            'https://docs.google.com/document/d/e/2PACX-1vSQXvd13cM0K7T3PhHmHv3YFLDEOxk1v8fL7ICJ59HNZ7zQn9YCg9vzIppR93UePS19byz_7cX1sfAQ/pub?embedded=true',
        DE:
            'https://docs.google.com/document/u/5/d/e/2PACX-1vS-MzT_ZMsprud04yQt6_5Z0YzPRA0gIGJcU_4xR4u99rVbTrOz-MfVZvZHHRQBdTBsOIXPeijHijsT/pub?embedded=true',
    },
    contactPhone: {
        RU: '+74952408211',
        BY: '',
        PL: '',
        LT: '',
        LV: '',
        UA: '',
        DE: '',
    },
    features: [
        {
            color: '',
            title: 'shuttleFeatureTitle',
            benefits: [],
            busBranding: [],
            subtitle: 'shuttleFeatureSubTitle',
            rideTypes: [SearchDtoRideTypeEnum.Shuttle],
            backgroundColor: '',
            showLogo: true,
            dynamicRidesOnly: false,
        },
        {
            color: '#ffffff',
            title: 'bigbusFeatureTitle',
            benefits: [SearchDtoBenefitsEnum.BigBus],
            busBranding: [],
            subtitle: '',
            rideTypes: [],
            backgroundColor: '#ba68c8',
            showLogo: false,
            dynamicRidesOnly: false,
        },
        {
            color: '#ffffff',
            title: 'meteorFeatureTitle',
            benefits: [SearchDtoBenefitsEnum.Meteor],
            busBranding: [],
            subtitle: 'meteorFeatureSubTitle',
            rideTypes: [],
            backgroundColor: `linear-gradient(69.64deg, #009AF1 3.38%, #64FFEB 100%)`,
            showLogo: true,
            dynamicRidesOnly: false,
        },
    ],
    routeDirectionsMeta: [],
    milesDisabled: false,
    ratingDisabled: false,
    surgeColor: SURGE_DEFAULT_COLOR,
    surgeDisabled: false,
    surgePercentage: 50,
    universalSuggest: false,
    callCenterPhoneNumberRU: '',
    policies: [],
};
