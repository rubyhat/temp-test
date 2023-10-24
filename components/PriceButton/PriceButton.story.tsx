import React from 'react';
import { storiesOf } from '@storybook/react';

import { PriceButton } from './PriceButton';

storiesOf('PriceButton', module)
    .addDecorator(fn => <div style={{ width: 328 }}>{fn()}</div>)
    .add('active', () => <PriceButton price={500} freeSeats={2} fullWidth />)
    .add('loading', () => (
        <PriceButton price={500} freeSeats={2} variant="loading" fullWidth />
    ))
    .add('no seats', () => <PriceButton variant="no-seats" fullWidth />);
