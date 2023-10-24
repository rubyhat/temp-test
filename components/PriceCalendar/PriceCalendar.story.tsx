import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import { PriceCalendar } from './PriceCalendar';
import { CalendarDto } from 'swagger/client';

storiesOf('PriceCalendar', module)
    .add('small', () => {
        const Component = () => {
            const [value, setValue] = useState('2020-05-18');
            const handleChange = (value: string) => setValue(value);

            return (
                <PriceCalendar
                    value={value}
                    onChange={handleChange}
                    calendar={calendar}
                />
            );
        };

        return <Component />;
    })
    .add('long', () => {
        const Component = () => {
            const [value, setValue] = useState('2020-05-18');
            const handleChange = (value: string) => setValue(value);

            return (
                <PriceCalendar
                    value={value}
                    onChange={handleChange}
                    calendar={calendarLong}
                />
            );
        };

        return <Component />;
    });

const calendar: CalendarDto[] = [
    {
        minPrices: [
            {
                currency: 'RUB',
                price: 500,
                maxPrice: 600,
            },
        ],
        rideCount: 3,
        date: '2020-05-17',
    },
    {
        minPrices: [
            {
                currency: 'RUB',
                price: 400,
                maxPrice: 600,
            },
        ],
        rideCount: 3,
        date: '2020-05-18',
    },
    {
        minPrices: [
            {
                currency: 'RUB',
                price: 600,
                maxPrice: 800,
            },
        ],
        rideCount: 3,
        date: '2020-05-19',
    },
];

const calendarLong: CalendarDto[] = [
    {
        minPrices: [
            {
                currency: 'RUB',
                price: 500,
                maxPrice: 600,
            },
        ],
        rideCount: 3,
        date: '2020-05-17',
    },
    {
        minPrices: [
            {
                currency: 'RUB',
                price: 400,
                maxPrice: 600,
            },
        ],
        rideCount: 3,
        date: '2020-05-18',
    },
    {
        minPrices: [
            {
                currency: 'RUB',
                price: 600,
                maxPrice: 800,
            },
        ],
        rideCount: 3,
        date: '2020-05-19',
    },
    {
        minPrices: [
            {
                currency: 'RUB',
                price: 250,
                maxPrice: 500,
            },
        ],
        rideCount: 3,
        date: '2020-05-20',
    },
    {
        minPrices: [
            {
                currency: 'RUB',
                price: 300,
                maxPrice: 500,
            },
        ],
        rideCount: 3,
        date: '2020-05-21',
    },
    {
        minPrices: [
            {
                currency: 'RUB',
                price: 350,
                maxPrice: 500,
            },
        ],
        rideCount: 3,
        date: '2020-05-22',
    },
    {
        minPrices: [
            {
                currency: 'RUB',
                price: 380,
                maxPrice: 500,
            },
        ],
        rideCount: 3,
        date: '2020-05-23',
    },
];
