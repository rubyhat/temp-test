import React from 'react';
import { storiesOf } from '@storybook/react';

import { Header } from './Header';

storiesOf('Header', module)
    .add('basic', () => (
        <Header>
            <div style={{ background: '#f9f', height: 50, width: '100%' }} />
        </Header>
    ));
