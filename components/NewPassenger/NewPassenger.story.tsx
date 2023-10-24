import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import { BookField, NewPassenger, PassengerFormData } from './NewPassenger';
import {
    DocTypesDto,
    DocTypesDtoTypeEnum,
    GenderTypesDto,
    GenderTypesDtoTypeEnum,
    TicketTypeDto,
    TicketTypeDtoTypeEnum,
} from 'swagger/client';

storiesOf('NewPassenger', module)
    .add('default', () => {
        const Component = () => {
            const [
                passengerData,
                setPassengerData,
            ] = useState<PassengerFormData | null>(null);
            const handleSubmit = (data: PassengerFormData | null) => {
                console.log('data', data);
                setPassengerData(data);
            };

            return (
                <NewPassenger
                    title="Пассажир №1"
                    initialData={passengerDataExample}
                    ticketTypes={ticketTypes[0]}
                    docTypes={docTypes}
                    bookFields={bookFields}
                    genderTypes={genderTypes}
                    onSubmit={handleSubmit}
                    currency="RUB"
                />
            );
        };

        return <Component />;
    })
    .add('no bookFields', () => {
        const Component = () => {
            const [
                passengerData,
                setPassengerData,
            ] = useState<PassengerFormData | null>(null);
            const handleSubmit = (data: PassengerFormData | null) => {
                console.log('data', data);
                setPassengerData(data);
            };

            return (
                <NewPassenger
                    title="Пассажир №1"
                    initialData={passengerDataExample}
                    ticketTypes={ticketTypes[0]}
                    docTypes={docTypes}
                    bookFields={[]}
                    genderTypes={genderTypes}
                    onSubmit={handleSubmit}
                    currency="RUB"
                />
            );
        };

        return <Component />;
    });

export const ticketTypes: TicketTypeDto[][] = [
    [
        {
            price: 1000.0,
            onlinePrice: 1000.0,
            code: '246037',
            type: TicketTypeDtoTypeEnum.Full,
        },
        {
            price: 500.0,
            onlinePrice: 500.0,
            code: '246038',
            type: TicketTypeDtoTypeEnum.Child,
        },
        {
            price: 400.0,
            onlinePrice: 300.0,
            code: '246039',
            type: TicketTypeDtoTypeEnum.Baggage,
        },
        {
            price: 300.0,
            onlinePrice: 300.0,
            code: '246040',
            type: TicketTypeDtoTypeEnum.Discount,
        },
    ],
];

export const genderTypes: GenderTypesDto[] = [
    {
        code: '0',
        type: GenderTypesDtoTypeEnum.Male,
    },
    {
        code: '1',
        type: GenderTypesDtoTypeEnum.Female,
    },
];

export const docTypes: DocTypesDto[] = [
    {
        code: '0',
        type: DocTypesDtoTypeEnum.IdRu,
        partners: ['atlas'],
    },
    {
        code: '2',
        type: DocTypesDtoTypeEnum.PassportRu,
        partners: ['atlas'],
    },
    {
        code: '31',
        type: DocTypesDtoTypeEnum.PassportBy,
        partners: ['atlas'],
    },
    {
        code: '32',
        type: DocTypesDtoTypeEnum.IdUa,
        partners: ['atlas'],
    },
    {
        code: '3',
        type: DocTypesDtoTypeEnum.ForeignPassport,
        partners: ['atlas'],
    },
    {
        code: '4',
        type: DocTypesDtoTypeEnum.BirthCertificateRu,
        partners: ['atlas'],
    },
    {
        code: '5',
        type: DocTypesDtoTypeEnum.SoldierIdRu,
        partners: ['atlas'],
    },
    {
        code: '8',
        type: DocTypesDtoTypeEnum.MilitaryBookRu,
        partners: ['atlas'],
    },
    {
        code: '9',
        type: DocTypesDtoTypeEnum.PermitOfResidenceRu,
        partners: ['atlas'],
    },
    {
        code: '11',
        type: DocTypesDtoTypeEnum.PassportSu,
        partners: ['atlas'],
    },
];

export const bookFields: BookField[] = [
    'name',
    'email',
    'document',
    'gender',
    'surname',
    'phone',
    'birthDate',
];

const passengerDataExample: PassengerFormData = {
    id: 1,
    lastName: 'Sanchez',
    firstName: 'Rick',
    middleName: 'Sanchezovich',
    birthDate: '1949-01-01',
    genderCode: '0',
    docTypeCode: '1',
    docNumber: 'C-137',
    ticketTypeCode: '246037',
    citizenshipCode: 'RU',
};
