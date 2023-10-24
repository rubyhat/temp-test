import React from 'react';
import { storiesOf } from '@storybook/react';

import { DesktopRoute } from './DesktopRoute';

export const routeProps = {
    departureDate: '2019-12-24T08:00:00',
    arrivalDate: '2019-12-24T13:00:00',
    departureTimezone: 'Europe/Moscow',
    arrivalTimezone: 'Europe/Moscow',
    departureCity: 'Москва',
    arrivalCity: 'Магадан',
};

storiesOf('DesktopRoute', module)
    .add('default', () => (
        <DesktopRoute
            {...routeProps}
            departureStop="ост. Тростенец (ТЦ Простор)"
            arrivalStop="ост. Симонова"
        />
    ))
    .add('only cities', () => <DesktopRoute {...routeProps} />);
