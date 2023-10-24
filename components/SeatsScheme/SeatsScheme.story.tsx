import React from 'react';
import { storiesOf } from '@storybook/react';

import { SeatsMap, SeatsScheme } from './SeatsScheme';

storiesOf('SeatsScheme', module).add('default', () => {
    return <SeatsScheme seatsScheme={seatsScheme} seatsMap={seatsMap} />;
});

/**
 * d - Driver
 * e - Exit
 * s - Seat
 * w - WC
 */
const seatsScheme: SeatsScheme = [
    'd___e',
    'ss_ss',
    'ss_ss',
    'ss_ss',
    'ss_ss',
    'ss_ss',
    'ss__w',
    'ss__e',
    'ss_ss',
    'ss_ss',
    'ss_ss',
    'ss_ss',
    'ss_ss',
    'sssss',
];

const seatsMap: SeatsMap[] = [
    {
        number: 0,
        x: 1,
        y: 1,
        type: 'driver',
        status: 'free',
    },
    {
        number: 0,
        x: 2,
        y: 1,
        type: 'empty',
        status: 'free',
    },
    {
        number: 0,
        x: 3,
        y: 1,
        type: 'empty',
        status: 'free',
    },
    {
        number: 0,
        x: 4,
        y: 1,
        type: 'empty',
        status: 'free',
    },
    {
        number: 0,
        x: 1,
        y: 2,
        type: 'exit',
        status: 'free',
    },
    {
        number: 1,
        x: 2,
        y: 2,
        type: 'seat',
        status: 'free',
    },
    {
        number: 2,
        x: 3,
        y: 2,
        type: 'seat',
        status: 'free',
    },
    {
        number: 0,
        x: 4,
        y: 2,
        type: 'empty',
        status: 'free',
    },
    {
        number: 3,
        x: 1,
        y: 3,
        type: 'seat',
        status: 'occupied',
    },
    {
        number: 4,
        x: 2,
        y: 3,
        type: 'seat',
        status: 'occupied',
    },
    {
        number: 5,
        x: 3,
        y: 3,
        type: 'seat',
        status: 'occupied',
    },
    {
        number: 6,
        x: 4,
        y: 3,
        type: 'seat',
        status: 'free',
    },
    {
        number: 0,
        x: 1,
        y: 4,
        type: 'empty',
        status: 'free',
    },
    {
        number: 7,
        x: 2,
        y: 4,
        type: 'seat',
        status: 'free',
    },
    {
        number: 8,
        x: 3,
        y: 4,
        type: 'seat',
        status: 'free',
    },
    {
        number: 9,
        x: 4,
        y: 4,
        type: 'seat',
        status: 'free',
    },
    {
        number: 10,
        x: 1,
        y: 5,
        type: 'seat',
        status: 'free',
    },
    {
        number: 0,
        x: 2,
        y: 5,
        type: 'empty',
        status: 'free',
    },
    {
        number: 11,
        x: 3,
        y: 5,
        type: 'seat',
        status: 'free',
    },
    {
        number: 12,
        x: 4,
        y: 5,
        type: 'seat',
        status: 'free',
    },
    {
        number: 13,
        x: 1,
        y: 6,
        type: 'seat',
        status: 'free',
    },
    {
        number: 14,
        x: 2,
        y: 6,
        type: 'seat',
        status: 'free',
    },
    {
        number: 0,
        x: 3,
        y: 6,
        type: 'empty',
        status: 'free',
    },
    {
        number: 15,
        x: 4,
        y: 6,
        type: 'seat',
        status: 'free',
    },
    {
        number: 16,
        x: 1,
        y: 7,
        type: 'seat',
        status: 'free',
    },
    {
        number: 17,
        x: 2,
        y: 7,
        type: 'seat',
        status: 'occupied',
    },
    {
        number: 18,
        x: 3,
        y: 7,
        type: 'seat',
        status: 'occupied',
    },
    {
        number: 0,
        x: 4,
        y: 7,
        type: 'empty',
        status: 'free',
    },
    {
        number: 19,
        x: 1,
        y: 8,
        type: 'seat',
        status: 'free',
    },
    {
        number: 20,
        x: 2,
        y: 8,
        type: 'seat',
        status: 'free',
    },
    {
        number: 21,
        x: 3,
        y: 8,
        type: 'seat',
        status: 'free',
    },
    {
        number: 22,
        x: 4,
        y: 8,
        type: 'seat',
        status: 'free',
    },
    {
        number: 0,
        x: 1,
        y: 9,
        type: 'empty',
        status: 'free',
    },
    {
        number: 0,
        x: 2,
        y: 9,
        type: 'empty',
        status: 'free',
    },
    {
        number: 0,
        x: 3,
        y: 9,
        type: 'wc',
        status: 'free',
    },
    {
        number: 23,
        x: 4,
        y: 9,
        type: 'seat',
        status: 'free',
    },
    {
        number: 24,
        x: 1,
        y: 10,
        type: 'seat',
        status: 'free',
    },
    {
        number: 0,
        x: 2,
        y: 10,
        type: 'empty',
        status: 'free',
    },
    {
        number: 0,
        x: 3,
        y: 10,
        type: 'empty',
        status: 'free',
    },
    {
        number: 0,
        x: 4,
        y: 10,
        type: 'exit',
        status: 'free',
    },
    {
        number: 25,
        x: 1,
        y: 11,
        type: 'seat',
        status: 'occupied',
    },
    {
        number: 26,
        x: 2,
        y: 11,
        type: 'seat',
        status: 'free',
    },
    {
        number: 0,
        x: 3,
        y: 11,
        type: 'empty',
        status: 'free',
    },
    {
        number: 27,
        x: 4,
        y: 11,
        type: 'seat',
        status: 'free',
    },
    {
        number: 28,
        x: 1,
        y: 12,
        type: 'seat',
        status: 'free',
    },
    {
        number: 29,
        x: 2,
        y: 12,
        type: 'seat',
        status: 'free',
    },
    {
        number: 30,
        x: 3,
        y: 12,
        type: 'seat',
        status: 'free',
    },
    {
        number: 0,
        x: 4,
        y: 12,
        type: 'empty',
        status: 'free',
    },
    {
        number: 31,
        x: 1,
        y: 13,
        type: 'seat',
        status: 'occupied',
    },
    {
        number: 32,
        x: 2,
        y: 13,
        type: 'seat',
        status: 'free',
    },
    {
        number: 33,
        x: 3,
        y: 13,
        type: 'seat',
        status: 'free',
    },
    {
        number: 34,
        x: 4,
        y: 13,
        type: 'seat',
        status: 'free',
    },
    {
        number: 0,
        x: 1,
        y: 14,
        type: 'empty',
        status: 'free',
    },
    {
        number: 35,
        x: 2,
        y: 14,
        type: 'seat',
        status: 'occupied',
    },
    {
        number: 36,
        x: 3,
        y: 14,
        type: 'seat',
        status: 'free',
    },
    {
        number: 37,
        x: 4,
        y: 14,
        type: 'seat',
        status: 'free',
    },
    {
        number: 38,
        x: 1,
        y: 15,
        type: 'seat',
        status: 'free',
    },
    {
        number: 0,
        x: 2,
        y: 15,
        type: 'empty',
        status: 'free',
    },
    {
        number: 39,
        x: 3,
        y: 15,
        type: 'seat',
        status: 'free',
    },
    {
        number: 40,
        x: 4,
        y: 15,
        type: 'seat',
        status: 'free',
    },
    {
        number: 41,
        x: 1,
        y: 16,
        type: 'seat',
        status: 'free',
    },
    {
        number: 42,
        x: 2,
        y: 16,
        type: 'seat',
        status: 'free',
    },
    {
        number: 0,
        x: 3,
        y: 16,
        type: 'empty',
        status: 'free',
    },
    {
        number: 43,
        x: 4,
        y: 16,
        type: 'seat',
        status: 'free',
    },
    {
        number: 44,
        x: 1,
        y: 17,
        type: 'seat',
        status: 'free',
    },
    {
        number: 45,
        x: 1,
        y: 17,
        type: 'seat',
        status: 'free',
    },
    {
        number: 46,
        x: 1,
        y: 17,
        type: 'seat',
        status: 'occupied',
    },
    {
        number: 47,
        x: 1,
        y: 17,
        type: 'seat',
        status: 'occupied',
    },
    {
        number: 48,
        x: 1,
        y: 17,
        type: 'seat',
        status: 'free',
    },
    {
        number: 49,
        x: 1,
        y: 17,
        type: 'seat',
        status: 'free',
    },
];