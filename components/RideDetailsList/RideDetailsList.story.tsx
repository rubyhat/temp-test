import React from 'react';
import { storiesOf } from '@storybook/react';

import { RideDetailsList } from './RideDetailsList';

storiesOf('RideDetailsList', module)
    .add('default', () => <RideDetailsList items={details} />);

export const details = [
    { name: 'Транспорт', value: 'Микроавтобус' },
    { name: 'Цвет', value: 'Белый' },
    { name: 'Номер', value: 'АМ 5555' },
    { name: 'Партнер', value: 'ООО Дамеком групп' },
];
