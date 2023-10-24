import React from 'react';
import { storiesOf } from '@storybook/react';

import { Stub } from './Stub';

storiesOf('Stub', module)
    .add('basic', () => (
        <div style={{ width: 300, height: 30 }}>
            <Stub />
        </div>
    ))
    .add('transparent', () => (
        <div style={{ width: 300, height: 30, background: 'red' }}>
            <Stub transparent />
        </div>
    ));
