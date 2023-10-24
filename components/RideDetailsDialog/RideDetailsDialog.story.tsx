import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import { Button } from '../ui/Button';
import { RideDetailsDialog } from './RideDetailsDialog';
import {
    SearchDto,
    SearchDtoBenefitsEnum,
    SearchDtoBookFieldsEnum,
    SearchDtoPaymentTypesEnum,
    SearchDtoRideTypeEnum,
} from 'swagger/client';
import { freighter } from 'components/Trip/Trip.story';
import { saleTypes } from 'components/DesktopTrip/DesktopTrip.story';

storiesOf('RideDetailsDialog', module).add('default', () => {
    const Component = () => {
        const [open, setOpen] = useState(false);
        const handleClick = () => {
            setOpen(true);
        };
        const handleClose = () => {
            document.body.style.overflow = 'auto';
            setOpen(false);
        };
        const handleSubmit = () => {};

        return (
            <>
                <Button
                    onClick={handleClick}
                    variant="contained"
                    color="primary"
                >
                    Open
                </Button>

                <RideDetailsDialog
                    open={open}
                    onClose={handleClose}
                    onSubmit={handleSubmit}
                    ride={ride}
                    passengers={1}
                />
            </>
        );
    };

    return <Component />;
});

const ride: SearchDto = {
    saleTypes,
    fee: 0,
    partnerName: 'Atlas',
    rideType: SearchDtoRideTypeEnum.Charter,
    refundConditions: '',
    departure: '2019-12-23T07:00:00',
    partner: '101',
    currency: 'RUB',
    to: {
        timezone: 'Europe/Moscow',
        id: 'c524901',
        desc: 'Москва',
    },
    carrier: 'Тестовая Служба\' 2"',
    saasId: '1',
    benefits: [
        SearchDtoBenefitsEnum.Wifi,
        SearchDtoBenefitsEnum.Tv,
        SearchDtoBenefitsEnum.Air,
    ],
    onlineRefund: true,
    bookFields: [
        SearchDtoBookFieldsEnum.Phone,
        SearchDtoBookFieldsEnum.Name,
        SearchDtoBookFieldsEnum.Surname,
    ],
    valid_before: 3600,
    onlinePrice: 550,
    dischargeStops: [
        {
            latitude: 55.74509262979952,
            id: '10886',
            timezone: 'Europe/Moscow',
            datetime: '2019-12-23T11:30:00',
            desc: 'Метро Новокосино',
            longitude: 37.86375145950311,
            important: false,
            dynamic: false,
        },
        {
            latitude: 55.75700093615955,
            id: '10887',
            timezone: 'Europe/Moscow',
            datetime: '2019-12-23T12:00:00',
            desc: 'Курский вокзал',
            longitude: 37.66050438919006,
            important: false,
            dynamic: false,
        },
    ],
    paymentTypes: [
        SearchDtoPaymentTypesEnum.Cash,
        SearchDtoPaymentTypesEnum.Miles,
        SearchDtoPaymentTypesEnum.Reccur,
        SearchDtoPaymentTypesEnum.Card,
    ],
    id: 'atlas:457606:554234:524901:1',
    price: 550,
    bus: {
        mark: 'Mercedes-Benz',
        color: {
            code: 'FFFFFF',
            name: 'Белый',
        },
        model: 'Sprinter',
        reg: 'P620CE 150',
    },
    arrival: '2019-12-23T12:00:00',
    ticketLimit: 5,
    pickupStops: [
        {
            latitude: 54.704616680174254,
            id: '10737',
            timezone: 'Europe/Kaliningrad',
            datetime: '2019-12-23T07:30:00',
            desc: 'Московский проспект',
            longitude: 20.609953503417948,
            important: false,
            dynamic: false,
        },
        {
            latitude: 54.696812420975284,
            id: '10885',
            timezone: 'Europe/Kaliningrad',
            datetime: '2019-12-23T07:00:00',
            desc: 'Стадион &quot;Калининград&quot;',
            longitude: 20.53396115760784,
            important: false,
            dynamic: false,
        },
    ],
    carrierID: '77',
    connector: 'atlas',
    from: {
        timezone: 'Europe/Kaliningrad',
        id: 'c554234',
        desc: 'Калининград',
    },
    freeSeats: 22,
    freighter,
    dynamicMode: false,
    dynamicConfig: {
        prepareTime: 0,
    },
};
