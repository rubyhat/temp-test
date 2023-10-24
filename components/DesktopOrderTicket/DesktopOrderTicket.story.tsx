import React from 'react';
import { storiesOf } from '@storybook/react';

import { DesktopOrderTicket } from './DesktopOrderTicket';
import {
    OrderDto,
    OrderDtoPaymentMethodEnum,
    OrderDtoStatusEnum,
    PassengerDtoDocTypeEnum,
    PassengerDtoGenderTypeEnum,
    TicketTypeDtoTypeEnum,
    TicketDto,
    TicketDtoStatusEnum,
    RideDtoPaymentTypesEnum,
    RideDtoBookFieldsEnum,
    RideDtoBenefitsEnum,
    RideDtoRideTypeEnum,
} from 'swagger/client';
import { freighter } from 'components/Trip/Trip.story';
import { saleTypes } from 'components/DesktopTrip/DesktopTrip.story';

storiesOf('DesktopOrderTicket', module)
    .add('expired', () => (
        <DesktopOrderTicket
            order={orderExpired}
            ticket={(orderExpired.tickets as TicketDto[])[0]}
            onReturnTicket={() => {}}
        />
    ))
    .add('active', () => (
        <DesktopOrderTicket
            order={orderActive}
            ticket={(orderActive.tickets as TicketDto[])[0]}
            onReturnTicket={() => {}}
        />
    ));

const ticketExpired: TicketDto = {
    id: 'atlas:3816813',
    price: 550,
    fee: 0,
    onlinePrice: 550,
    passenger: {
        genderType: PassengerDtoGenderTypeEnum.Male,
        middleName: 'Иванович',
        ticketType: TicketTypeDtoTypeEnum.Full,
        firstName: 'Иван',
        docType: PassengerDtoDocTypeEnum.IdRu,
        lastName: 'Иванов',
        docNumber: '11111111114611770735',
        birthDate: '1993-08-18',
        citizenship: 'RU',
    },
    status: TicketDtoStatusEnum.Expired,
    discount: 0,
    milesAccrual: {
        card: 0,
        cash: 0,
    },
};

const orderExpired: OrderDto = {
    id: 'eab64e81-58d1-4893-9115-d42445661273',
    status: OrderDtoStatusEnum.Expired,
    tickets: [ticketExpired],
    rideInfo: {
        saleTypes,
        valid_before: 0,
        dischargeStops: [
            {
                timezone: 'Europe/Moscow',
                longitude: 37.86375145950311,
                latitude: 55.74509262979952,
                datetime: '2020-04-24T11:30:00',
                desc: 'Метро Новокосино',
                id: '10886',
                important: false,
                dynamic: false,
            },
            {
                timezone: 'Europe/Moscow',
                longitude: 37.66050438919006,
                latitude: 55.75700093615955,
                datetime: '2020-04-24T12:00:00',
                desc: 'Курский вокзал',
                id: '10887',
                important: false,
                dynamic: false,
            },
        ],
        carrier: 'Тестовая Служба\' 2"',
        bus: {
            color: {
                name: 'Белый',
                code: 'FFFFFF',
            },
            mark: 'Mercedes-Benz',
            model: 'Sprinter',
            reg: '5 TAX 3744',
        },
        departure: '2020-04-24T07:00:00',
        fee: 0,
        connector: 'atlas',
        from: {
            timezone: 'Europe/Kaliningrad',
            id: 'c554234',
            desc: 'Калининград',
        },
        carrierID: '77',
        saasId: '1',
        to: {
            timezone: 'Europe/Moscow',
            id: 'c524901',
            desc: 'Москва',
        },
        price: 550,
        onlinePrice: 550,
        onlineRefund: true,
        partner: '101',
        id: 'atlas:458922:554234:524901:1',
        partnerName: 'Atlas',
        refundConditions: '',
        ticketLimit: 5,
        freeSeats: 22,
        benefits: [
            RideDtoBenefitsEnum.Wifi,
            RideDtoBenefitsEnum.Tv,
            RideDtoBenefitsEnum.Air,
        ],
        arrival: '2020-04-24T12:00:00',
        currency: 'RUB',
        bookFields: [
            RideDtoBookFieldsEnum.Phone,
            RideDtoBookFieldsEnum.Name,
            RideDtoBookFieldsEnum.Surname,
        ],
        rideType: RideDtoRideTypeEnum.Charter,
        paymentTypes: [
            RideDtoPaymentTypesEnum.AtlasPromocode,
            RideDtoPaymentTypesEnum.Card,
            RideDtoPaymentTypesEnum.Reccur,
            RideDtoPaymentTypesEnum.Miles,
            RideDtoPaymentTypesEnum.Cash,
        ],
        forbiddenPaymentTypes: [],
        pickupStops: [
            {
                timezone: 'Europe/Kaliningrad',
                longitude: 20.53396115760784,
                latitude: 54.696812420975284,
                datetime: '2020-04-24T07:00:00',
                desc: 'Стадион "Калининград"',
                id: '10885',
                important: false,
                dynamic: false,
            },
            {
                timezone: 'Europe/Kaliningrad',
                longitude: 20.609953503417948,
                latitude: 54.704616680174254,
                datetime: '2020-04-24T07:30:00',
                desc: 'Московский проспект',
                id: '10737',
                important: false,
                dynamic: false,
            },
        ],
        freighter,
        bookingAvailable: {
            available: true,
            reason: null,
        },
        dynamicMode: false,
        dynamicConfig: {
            prepareTime: 0,
        },
    },
    pickupStop: {
        timezone: 'Europe/Kaliningrad',
        longitude: 20.609953503417948,
        latitude: 54.704616680174254,
        datetime: '2020-04-24T07:30:00',
        desc: 'Московский проспект',
        id: '10737',
        important: false,
        dynamic: false,
    },
    dischargeStop: {
        timezone: 'Europe/Moscow',
        longitude: 37.66050438919006,
        latitude: 55.75700093615955,
        datetime: '2020-04-24T12:00:00',
        desc: 'Курский вокзал',
        id: '10887',
        important: false,
        dynamic: false,
    },
    paymentMethod: OrderDtoPaymentMethodEnum.Cash,
    onlinePrice: 550,
    price: 550,
    createdAt: '2020-04-21T15:00:03.143Z',
    expiresIn: -539226,
};

const orderActive: OrderDto = {
    ...orderExpired,
    status: OrderDtoStatusEnum.Active,
    tickets: [
        {
            ...ticketExpired,
            status: TicketDtoStatusEnum.Active,
        },
    ],
};
