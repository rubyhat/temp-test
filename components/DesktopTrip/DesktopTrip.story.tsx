import React from 'react';
import { storiesOf } from '@storybook/react';

import { DesktopTrip } from './DesktopTrip';
import {
    SearchDto,
    SearchDtoBenefitsEnum,
    SearchDtoBookFieldsEnum,
    SearchDtoPaymentTypesEnum,
    SearchDtoRideTypeEnum,
} from 'swagger/client';
import { freighter } from 'components/Trip/Trip.story';

storiesOf('DesktopTrip', module).add('basic', () => (
    <DesktopTrip onClickBooking={() => {}} ride={ride} />
));

export const saleTypes: Array<string> = [];

export const ride: SearchDto = {
    saleTypes,
    rideType: SearchDtoRideTypeEnum.Charter,
    valid_before: 600,
    bus: {
        model: 'Sprinter',
        color: {
            name: 'Белый',
            code: 'FFFFFF',
        },
        mark: 'Mercedes-Benz',
        reg: 'P620CE 150',
    },
    dischargeStops: [
        {
            longitude: 20.53396115760784,
            id: '10881',
            latitude: 54.696812420975284,
            desc: 'Стадион "Калининград"',
            datetime: '2020-04-17T11:10:00',
            timezone: 'Europe/Kaliningrad',
            important: false,
            dynamic: false,
        },
    ],
    partner: '101',
    to: {
        desc: 'Калининград',
        id: 'c554234',
        timezone: 'Europe/Kaliningrad',
    },
    carrierID: '77',
    departure: '2020-04-17T00:10:00',
    onlineRefund: true,
    currency: 'RUB',
    refundConditions: '',
    ticketLimit: 5,
    pickupStops: [
        {
            longitude: 37.75201052402473,
            id: '10880',
            latitude: 55.758571646169955,
            desc: 'Шоссе Энтузиастов',
            datetime: '2020-04-17T01:10:00',
            timezone: 'Europe/Moscow',
            important: false,
            dynamic: false,
        },
        {
            longitude: 37.784690666580175,
            id: '10879',
            latitude: 55.750575261079575,
            desc: 'м. Перово',
            datetime: '2020-04-17T00:10:00',
            timezone: 'Europe/Moscow',
            important: false,
            dynamic: false,
        },
        {
            longitude: 37.86375145950311,
            id: '10889',
            latitude: 55.74509262979952,
            desc: 'Метро Новокосино',
            datetime: '2020-04-17T00:40:00',
            timezone: 'Europe/Moscow',
            important: false,
            dynamic: false,
        },
    ],
    paymentTypes: [
        SearchDtoPaymentTypesEnum.AtlasPromocode,
        SearchDtoPaymentTypesEnum.Miles,
    ],
    partnerName: 'Atlas',
    benefits: [
        SearchDtoBenefitsEnum.Wifi,
        SearchDtoBenefitsEnum.Tv,
        SearchDtoBenefitsEnum.Air,
    ],
    carrier: 'Тестовая Служба\' 2"',
    id: 'atlas:458709:524901:554234:2',
    arrival: '2020-04-17T11:10:00',
    onlinePrice: 2000,
    freeSeats: 22,
    bookFields: [
        SearchDtoBookFieldsEnum.Phone,
        SearchDtoBookFieldsEnum.Name,
        SearchDtoBookFieldsEnum.Surname,
    ],
    connector: 'atlas',
    price: 2000,
    carrier_phones: ['375333333333', '375290000000', '88001001001'],
    from: {
        desc: 'Москва',
        id: 'c524901',
        timezone: 'Europe/Moscow',
    },
    fee: 0,
    freighter,
    saasId: '1',
    dynamicMode: false,
    dynamicConfig: {
        prepareTime: 0,
    },
};
