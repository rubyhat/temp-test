import React from 'react';
import { storiesOf } from '@storybook/react';

import { Route } from './Route';

storiesOf('Route', module)
    .add('basic', () => (
        <Route
            departureDate="2019-12-24T08:00:00"
            arrivalDate="2019-12-24T13:00:00"
        />
    ))
    .add('next day', () => (
        <Route
            departureDate="2019-12-24T08:00:00"
            arrivalDate="2019-12-25T13:00:00"
        />
    ))
    .add('with endpoints', () => (
        <Route
            departureDate="2019-12-24T08:00:00"
            arrivalDate="2019-12-24T13:00:00"
            departureName="ост. Тростенец (ТЦ Простор)"
            arrivalName="ост. Симонова"
        />
    ));
