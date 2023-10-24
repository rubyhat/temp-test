import React from 'react';
import { storiesOf } from '@storybook/react';

import { BaseBar } from './BaseBar';

storiesOf('ui/BaseBar', module)
    .add('shadow top', () => <BaseBar shadow="top">Фильтры</BaseBar>)
    .add('shadow bottom', () => (
        <BaseBar shadow="bottom">Выберите место посадки</BaseBar>
    ))
    .add('shadow none', () => (
        <BaseBar shadow="none">Выберите место посадки</BaseBar>
    ))
    .add('color primary', () => (
        <BaseBar color="primary" shadow="bottom">
            Выберите место посадки
        </BaseBar>
    ));
