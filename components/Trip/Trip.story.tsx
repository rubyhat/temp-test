import React from 'react';
import { storiesOf } from '@storybook/react';

import { FreighterDto } from 'swagger/client';
import { Trip } from './Trip';
import { TripShimmer } from 'components/TripShimmer';
import { ride } from 'components/DesktopTrip/DesktopTrip.story';

export const freighter: FreighterDto = {
    id: 1,
    name: 'ИП Лебедев Сергей Петрович',
    authority: 'Оглы Ыглы',
    inn: '',
    kpp: '',
    ogrn: '',
    regDate: '16.05.2020',
    unp: '12312315125',
    address: 'ул. Пушкина, дом Колотушкина',
    workingTime: '',
    license: '123456',
};

storiesOf('Trip', module)
    .add('basic', () => <Trip ride={ride} />)
    .add('loading', () => <TripShimmer />);
