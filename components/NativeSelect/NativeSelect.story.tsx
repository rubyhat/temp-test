import React from 'react';
import { storiesOf } from '@storybook/react';

import { NativeSelect } from './NativeSelect';

storiesOf('NativeSelect', module)
    .add('default', () => <NativeSelect>
        <option value={'full'}>Взрослый</option>
        <option value={'child'}>Детский</option>
    </NativeSelect>);
