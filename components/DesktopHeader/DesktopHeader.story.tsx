import React from 'react';
import { storiesOf } from '@storybook/react';

import { DesktopHeader } from './DesktopHeader';

storiesOf('DesktopHeader', module).add('default', () => (
    <DesktopHeader
        title="Минск — Гродно"
        subTitle="Билеты на автобус и расписание"
    >
        <div style={{ background: '#f9f', height: 50, width: '100%' }} />
    </DesktopHeader>
));
